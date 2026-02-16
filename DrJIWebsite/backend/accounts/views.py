from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import OTP
from .serializers import (
    SignUpSerializer,
    VerifyEmailSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from .services import send_otp_email

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'email': user.email,
        },
    }


class SignUpView(APIView):
    """Customer sign up. Creates inactive user and sends OTP to email."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        otp_record = OTP.create_otp(user.email, OTP.PURPOSE_SIGNUP)
        send_otp_email(user.email, otp_record.otp_code, OTP.PURPOSE_SIGNUP)
        return Response(
            {'detail': 'Verification code sent to your email. Please verify within 5 minutes.'},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    """Verify email OTP and activate customer account."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_record = serializer.validated_data['otp_record']
        user = User.objects.get(email__iexact=otp_record.email)
        user.is_active = True
        user.save(update_fields=['is_active'])
        otp_record.delete()
        return Response({'detail': 'Email verified. You can now sign in.'}, status=status.HTTP_200_OK)


class LoginView(APIView):
    """Customer sign in. Returns JWT access and refresh tokens."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']
        user = User.objects.filter(email__iexact=email).first()
        if not user or not user.check_password(password):
            return Response(
                {'detail': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_active:
            return Response(
                {'detail': 'Please verify your email before signing in.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        if user.is_staff:
            return Response(
                {'detail': 'Use the admin site to sign in as staff.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    """Send OTP to email for password reset."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp_record = OTP.create_otp(email, OTP.PURPOSE_FORGOT_PASSWORD)
        send_otp_email(email, otp_record.otp_code, OTP.PURPOSE_FORGOT_PASSWORD)
        return Response(
            {'detail': 'Password reset code sent to your email. Valid for 5 minutes.'},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    """Verify OTP and set new password."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()
        new_password = serializer.validated_data['new_password']
        otp_record = serializer.validated_data['otp_record']
        user = User.objects.get(email__iexact=email)
        user.set_password(new_password)
        user.save(update_fields=['password'])
        otp_record.delete()
        return Response({'detail': 'Password reset successfully. You can now sign in.'}, status=status.HTTP_200_OK)
