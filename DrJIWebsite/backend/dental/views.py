from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Dentist, Service, Appointment
from .serializers import DentistSerializer, ServiceSerializer, AppointmentSerializer


class DentistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


class AppointmentViewSet(viewsets.GenericViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def create(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
