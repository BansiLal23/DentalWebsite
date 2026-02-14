from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DentistViewSet, ServiceViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'dentists', DentistViewSet, basename='dentist')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
]
