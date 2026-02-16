"""
Strong password validation for customer accounts.
"""
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


def validate_strong_password(password):
    """Enforce: min 8 chars, uppercase, lowercase, digit, special character."""
    if len(password) < 8:
        raise ValidationError(
            _('Password must be at least 8 characters long.'),
            code='password_too_short',
        )
    if not re.search(r'[A-Z]', password):
        raise ValidationError(
            _('Password must contain at least one uppercase letter.'),
            code='password_no_upper',
        )
    if not re.search(r'[a-z]', password):
        raise ValidationError(
            _('Password must contain at least one lowercase letter.'),
            code='password_no_lower',
        )
    if not re.search(r'\d', password):
        raise ValidationError(
            _('Password must contain at least one digit.'),
            code='password_no_digit',
        )
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>/?]', password):
        raise ValidationError(
            _('Password must contain at least one special character (!@#$%^&* etc.).'),
            code='password_no_special',
        )


class StrongPasswordValidator:
    """Django validator class for AUTH_PASSWORD_VALIDATORS."""
    def validate(self, password, user=None):
        validate_strong_password(password)

    def get_help_text(self):
        return _(
            'Password must be 8+ characters with uppercase, lowercase, digit, and special character.'
        )
