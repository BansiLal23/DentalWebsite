import logging
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Dentist, Service, Appointment
from .serializers import DentistSerializer, ServiceSerializer, AppointmentSerializer

logger = logging.getLogger(__name__)


def send_appointment_notification(appointment):
    """Send email notification to staff when a new appointment is booked (backend only)."""
    recipients = getattr(settings, 'APPOINTMENT_NOTIFY_EMAILS', None) or []
    if not recipients:
        return
    date_str = appointment.preferred_date.strftime('%A, %B %d, %Y') if appointment.preferred_date else 'Not specified'
    subject = f'New appointment request: {appointment.name} – {appointment.get_service_display()}'
    body = (
        f'A new appointment request has been submitted.\n\n'
        f'Name: {appointment.name}\n'
        f'Email: {appointment.email}\n'
        f'Phone: {appointment.phone}\n'
        f'Service: {appointment.get_service_display()}\n'
        f'Preferred date: {date_str}\n'
    )
    if getattr(appointment, 'preferred_time', None) and appointment.preferred_time:
        body += f'Preferred time: {appointment.get_preferred_time_display()}\n'
    if appointment.message:
        body += f'\nMessage:\n{appointment.message}\n'
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

    def create(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            send_appointment_notification(appointment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
