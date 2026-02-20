from rest_framework import serializers
from .models import Dentist, Service, Appointment


class DentistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dentist
        fields = [
            'id', 'name', 'title', 'bio', 'experience_years',
            'philosophy', 'certifications', 'image'
        ]


class ServiceSerializer(serializers.ModelSerializer):
    benefits_list = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'short_description', 'description',
            'benefits', 'benefits_list', 'experience_highlight', 'icon', 'order'
        ]

    def get_benefits_list(self, obj):
        if not obj.benefits:
            return []
        return [b.strip() for b in obj.benefits.splitlines() if b.strip()]


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'name', 'email', 'phone', 'service',
            'preferred_date', 'slot_time', 'preferred_time', 'message', 'created_at', 'customer'
        ]
        read_only_fields = ['created_at', 'customer']

    def validate_phone(self, value):
        if not value or len(value.strip()) < 8:
            raise serializers.ValidationError('Please enter a valid phone number.')
        return value.strip()

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError('Name must be at least 2 characters.')
        return value.strip()

    def validate_message(self, value):
        if value and len(value) > 2000:
            raise serializers.ValidationError('Message must be 2000 characters or fewer.')
        return value or ''

    def validate_preferred_date(self, value):
        if value is None:
            return value
        from django.utils import timezone
        if value < timezone.localdate():
            raise serializers.ValidationError('Preferred date cannot be in the past.')
        return value

    def validate_slot_time(self, value):
        if value is None:
            return value
        from datetime import time
        from django.conf import settings
        start_h = getattr(settings, 'APPOINTMENT_SLOT_START_HOUR', 9)
        end_h = getattr(settings, 'APPOINTMENT_SLOT_END_HOUR', 17)
        slot_min = getattr(settings, 'APPOINTMENT_SLOT_DURATION_MINUTES', 30)
        # Check value is on a valid slot boundary
        total_minutes = value.hour * 60 + value.minute
        start_minutes = start_h * 60
        end_minutes = end_h * 60
        if total_minutes < start_minutes or total_minutes >= end_minutes:
            raise serializers.ValidationError('Selected time is outside working hours.')
        if (total_minutes - start_minutes) % slot_min != 0:
            raise serializers.ValidationError('Invalid slot time.')
        return value

    def validate(self, attrs):
        preferred_date = attrs.get('preferred_date')
        slot_time = attrs.get('slot_time')
        if preferred_date and slot_time:
            if Appointment.objects.filter(preferred_date=preferred_date, slot_time=slot_time).exists():
                raise serializers.ValidationError(
                    {'slot_time': 'This slot is no longer available. Please choose another.'}
                )
        return attrs
