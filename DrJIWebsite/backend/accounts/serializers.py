from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import OTP
from .validators import validate_strong_password

User = get_user_model()


class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate_password(self, value):
        validate_strong_password(value)
        return value

    def create(self, validated_data):
        email = validated_data['email'].lower()
        password = validated_data['password']
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            is_active=False,
            is_staff=False,
        )
        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    otp = serializers.CharField(write_only=True, max_length=8)

    def validate(self, data):
        otp_record = OTP.verify(data['email'], data['otp'], OTP.PURPOSE_SIGNUP)
        if not otp_record:
            raise serializers.ValidationError('Invalid or expired verification code.')
        data['otp_record'] = otp_record
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)

    def validate_email(self, value):
        value = value.strip().lower()
        if not User.objects.filter(email__iexact=value, is_staff=False).exists():
            raise serializers.ValidationError('No customer account found with this email.')
        return value


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    otp = serializers.CharField(write_only=True, max_length=8)
    new_password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    def validate_new_password(self, value):
        validate_strong_password(value)
        return value

    def validate(self, data):
        otp_record = OTP.verify(data['email'], data['otp'], OTP.PURPOSE_FORGOT_PASSWORD)
        if not otp_record:
            raise serializers.ValidationError('Invalid or expired reset code.')
        data['otp_record'] = otp_record
        return data
