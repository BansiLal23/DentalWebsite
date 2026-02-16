"""
Email sending for OTP (Gmail SMTP). Single dentist clinic - customer verification only.
"""
import logging
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_otp_email(email, otp_code, purpose):
    """
    Send OTP to customer email. Uses Gmail SMTP when EMAIL_BACKEND is smtp.
    purpose: 'signup' | 'forgot_password'
    """
    if purpose == 'signup':
        subject = 'Verify your email - Dr. JI Dental'
        body = (
            f'Your verification code is: {otp_code}\n\n'
            'This code expires in 5 minutes. Do not share it with anyone.\n\n'
            'If you did not request this, please ignore this email.'
        )
    else:  # forgot_password
        subject = 'Password reset code - Dr. JI Dental'
        body = (
            f'Your password reset code is: {otp_code}\n\n'
            'This code expires in 5 minutes. Do not share it with anyone.\n\n'
            'If you did not request a password reset, please ignore this email.'
        )
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        logger.exception('Failed to send OTP email to %s: %s', email, e)
        raise
