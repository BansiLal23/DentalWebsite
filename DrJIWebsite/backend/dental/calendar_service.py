"""
Google Calendar integration for appointment slots.
- Reads busy periods so available-slots excludes times already blocked in Google Calendar.
- Optionally creates a calendar event when an appointment is booked.

Requires: GOOGLE_CALENDAR_ID and GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON).
Share your Google Calendar with the service account email (e.g. xxx@yyy.iam.gserviceaccount.com)
with "Make changes to events" or "See all event details" for read-only slots.
"""
import logging
from datetime import datetime, time, timedelta

from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

# Scopes: readonly for freebusy; events for creating events
SCOPES_READ = ['https://www.googleapis.com/auth/calendar.readonly']
SCOPES_EVENTS = ['https://www.googleapis.com/auth/calendar.events']


def _get_calendar_service(scopes=None):
    """Return Calendar API service or None if not configured."""
    calendar_id = getattr(settings, 'GOOGLE_CALENDAR_ID', None) or ''
    creds_path = getattr(settings, 'GOOGLE_APPLICATION_CREDENTIALS', None)
    if not calendar_id or not creds_path:
        return None, None
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        creds = service_account.Credentials.from_service_account_file(
            creds_path,
            scopes=scopes or SCOPES_READ,
        )
        service = build('calendar', 'v3', credentials=creds)
        return service, calendar_id
    except Exception as e:
        logger.warning('Google Calendar not available: %s', e)
        return None, None


def get_busy_slot_times_for_date(date):
    """
    Return a set of slot time strings (e.g. "09:00") that are busy on the given date
    according to Google Calendar. Returns empty set if Calendar is not configured or on error.
    """
    service, calendar_id = _get_calendar_service(SCOPES_READ)
    if not service:
        return set()

    start_h = getattr(settings, 'APPOINTMENT_SLOT_START_HOUR', 9)
    end_h = getattr(settings, 'APPOINTMENT_SLOT_END_HOUR', 17)
    duration = getattr(settings, 'APPOINTMENT_SLOT_DURATION_MINUTES', 30)

    # Day range in local timezone
    tz = timezone.get_current_timezone()
    day_start = timezone.make_aware(datetime.combine(date, time(0, 0)), tz)
    day_end = day_start + timedelta(days=1)

    time_min = day_start.isoformat()
    time_max = day_end.isoformat()

    try:
        body = {
            'timeMin': time_min,
            'timeMax': time_max,
            'items': [{'id': calendar_id}],
        }
        result = service.freebusy().query(body=body).execute()
        busy_list = result.get('calendars', {}).get(calendar_id, {}).get('busy', [])
    except Exception as e:
        logger.exception('Google Calendar freebusy query failed: %s', e)
        return set()

    # Build set of our slot times that overlap any busy period
    slot_times = []
    t = time(start_h, 0)
    end_t = time(end_h, 0)
    while (t.hour, t.minute) < (end_t.hour, end_t.minute):
        slot_times.append((t, t.strftime('%H:%M')))
        t = (datetime.combine(date, t) + timedelta(minutes=duration)).time()

    busy_slots = set()
    for slot_time, slot_str in slot_times:
        slot_start = timezone.make_aware(datetime.combine(date, slot_time), tz)
        slot_end = slot_start + timedelta(minutes=duration)
        for b in busy_list:
            b_start = datetime.fromisoformat(b['start'].replace('Z', '+00:00'))
            b_end = datetime.fromisoformat(b['end'].replace('Z', '+00:00'))
            if b_start.tzinfo is None:
                b_start = timezone.make_aware(b_start, timezone.utc)
            if b_end.tzinfo is None:
                b_end = timezone.make_aware(b_end, timezone.utc)
            b_start = b_start.astimezone(tz)
            b_end = b_end.astimezone(tz)
            if slot_start < b_end and slot_end > b_start:
                busy_slots.add(slot_str)
                break
    return busy_slots


def create_calendar_event(appointment):
    """
    Create a Google Calendar event for the appointment. No-op if Calendar not configured
    or if appointment has no preferred_date/slot_time.
    """
    if not appointment.preferred_date or not appointment.slot_time:
        return
    service, calendar_id = _get_calendar_service(SCOPES_EVENTS)
    if not service:
        return
    tz = timezone.get_current_timezone()
    start_dt = timezone.make_aware(
        datetime.combine(appointment.preferred_date, appointment.slot_time),
        tz,
    )
    duration = getattr(settings, 'APPOINTMENT_SLOT_DURATION_MINUTES', 30)
    end_dt = start_dt + timedelta(minutes=duration)
    title = f"Appointment: {appointment.name} – {appointment.get_service_display()}"
    body = {
        'summary': title,
        'description': f"Patient: {appointment.name}\nEmail: {appointment.email}\nPhone: {appointment.phone}\nService: {appointment.get_service_display()}\nMessage: {appointment.message or '—'}",
        'start': {'dateTime': start_dt.isoformat(), 'timeZone': str(tz)},
        'end': {'dateTime': end_dt.isoformat(), 'timeZone': str(tz)},
    }
    try:
        service.events().insert(calendarId=calendar_id, body=body).execute()
        logger.info('Created Google Calendar event for appointment id=%s', appointment.id)
    except Exception as e:
        logger.exception('Failed to create Google Calendar event: %s', e)
