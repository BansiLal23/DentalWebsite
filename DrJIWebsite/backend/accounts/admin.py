from django.contrib import admin
from .models import OTP


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'purpose', 'otp_code', 'created_at', 'expires_at')
    list_filter = ('purpose',)
    search_fields = ('email',)
