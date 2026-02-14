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
            'preferred_date', 'message', 'created_at'
        ]
        read_only_fields = ['created_at']

    def validate_phone(self, value):
        if not value or len(value.strip()) < 8:
            raise serializers.ValidationError('Please enter a valid phone number.')
        return value.strip()

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError('Name must be at least 2 characters.')
        return value.strip()
