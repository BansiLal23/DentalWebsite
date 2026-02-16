import secrets
from django.db import models
from django.utils import timezone

OTP_EXPIRE_MINUTES = 5


def default_expiry():
    return timezone.now() + timezone.timedelta(minutes=OTP_EXPIRE_MINUTES)


class OTP(models.Model):
    """One-time password for email verification (signup, forgot password)."""
    PURPOSE_SIGNUP = 'signup'
    PURPOSE_FORGOT_PASSWORD = 'forgot_password'
    PURPOSE_CHOICES = [
        (PURPOSE_SIGNUP, 'Sign up verification'),
        (PURPOSE_FORGOT_PASSWORD, 'Forgot password'),
    ]

    email = models.EmailField(db_index=True)
    otp_code = models.CharField(max_length=8)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email', 'purpose']),
        ]

    def is_expired(self):
        return timezone.now() >= self.expires_at

    @classmethod
    def create_otp(cls, email, purpose):
        """Create a new OTP and invalidate any previous OTP for this email+purpose."""
        cls.objects.filter(email__iexact=email, purpose=purpose).delete()
        code = ''.join(secrets.choice('0123456789') for _ in range(6))
        return cls.objects.create(
            email=email,
            otp_code=code,
            purpose=purpose,
        )

    @classmethod
    def verify(cls, email, otp_code, purpose):
        """Return the OTP record if valid and not expired, else None."""
        try:
            otp = cls.objects.filter(
                email__iexact=email,
                purpose=purpose,
                otp_code=otp_code.strip(),
            ).latest('created_at')
        except cls.DoesNotExist:
            return None
        if otp.is_expired():
            return None
        return otp
