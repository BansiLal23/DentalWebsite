from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SignUpView, VerifyEmailView, LoginView, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='auth_signup'),
    path('verify-email/', VerifyEmailView.as_view(), name='auth_verify_email'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='auth_forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='auth_reset_password'),
]
