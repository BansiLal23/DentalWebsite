import logging
from datetime import time, timedelta
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from config.utils import success_response, error_response
from .models import Dentist, Service, Appointment
from .serializers import DentistSerializer, ServiceSerializer, AppointmentSerializer
from . import calendar_service

logger = logging.getLogger(__name__)


def get_all_slot_times():
    """Return list of (time, label) for configured working hours and slot duration."""
    start_h = getattr(settings, 'APPOINTMENT_SLOT_START_HOUR', 9)
    end_h = getattr(settings, 'APPOINTMENT_SLOT_END_HOUR', 17)
    duration = getattr(settings, 'APPOINTMENT_SLOT_DURATION_MINUTES', 30)
    slots = []
    t = time(start_h, 0)
    end_t = time(end_h, 0)
    while (t.hour, t.minute) < (end_t.hour, end_t.minute):
        label = t.strftime('%I:%M %p').lstrip('0')  # 9:00 AM
        slots.append({'time': t.strftime('%H:%M'), 'label': label})
        t = (timezone.datetime.combine(timezone.datetime.today(), t) + timedelta(minutes=duration)).time()
    return slots


def get_available_slots_for_date(date):
    """Return list of slot dicts (time, label) that are free on the given date (DB + Google Calendar)."""
    all_slots = get_all_slot_times()
    booked = set(
        Appointment.objects.filter(preferred_date=date)
        .exclude(slot_time__isnull=True)
        .values_list('slot_time', flat=True)
    )
    booked_str = {t.strftime('%H:%M') for t in booked}
    try:
        google_busy = calendar_service.get_busy_slot_times_for_date(date)
    except Exception:
        google_busy = set()
    busy = booked_str | google_busy
    return [s for s in all_slots if s['time'] not in busy]


def send_appointment_notification(appointment):
    """Send full appointment details to configured staff email when a new appointment is booked."""
    recipients = getattr(settings, 'APPOINTMENT_NOTIFY_EMAILS', None) or []
    if not recipients:
        return
    date_str = appointment.preferred_date.strftime('%A, %B %d, %Y') if appointment.preferred_date else 'Not specified'
    slot_str = appointment.slot_time.strftime('%I:%M %p').lstrip('0') if appointment.slot_time else 'Not specified'
    subject = f'New appointment booked: {appointment.name} – {appointment.get_service_display()} ({date_str}, {slot_str})'
    body = (
        'A new appointment has been booked. Details below.\n\n'
        '--- PATIENT ---\n'
        f'Name: {appointment.name}\n'
        f'Email: {appointment.email}\n'
        f'Phone: {appointment.phone}\n\n'
        '--- APPOINTMENT ---\n'
        f'Service: {appointment.get_service_display()}\n'
        f'Date: {date_str}\n'
        f'Time: {slot_str}\n\n'
    )
    if getattr(appointment, 'preferred_time', None) and appointment.preferred_time:
        body += f'Preferred period: {appointment.get_preferred_time_display()}\n'
    body += f'Booked at (UTC): {appointment.created_at.isoformat()}\n'
    if appointment.message:
        body += f'\n--- MESSAGE ---\n{appointment.message}\n'
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
    except Exception as e:
        logger.exception('Failed to send appointment notification email: %s', e)


class DentistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


class AppointmentViewSet(viewsets.GenericViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    @action(detail=False, methods=['get'], url_path='available-slots')
    def available_slots(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return error_response('Query parameter "date" (YYYY-MM-DD) is required.', status_code=status.HTTP_400_BAD_REQUEST)
        try:
            from datetime import datetime
            dt = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return error_response('Invalid date format. Use YYYY-MM-DD.', status_code=status.HTTP_400_BAD_REQUEST)
        if dt < timezone.localdate():
            return error_response(
                'Please select today or a future date. Slots are not available for past dates.',
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        slots = get_available_slots_for_date(dt)
        return success_response(data=slots, message='Available slots retrieved.')

    def create(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save(
                customer=request.user if request.user.is_authenticated else None
            )
            send_appointment_notification(appointment)
            try:
                calendar_service.create_calendar_event(appointment)
            except Exception:
                pass
            return success_response(
                data=serializer.data,
                message='Appointment created successfully.',
                status_code=status.HTTP_201_CREATED,
            )
        return error_response(
            message='Validation failed.',
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )
