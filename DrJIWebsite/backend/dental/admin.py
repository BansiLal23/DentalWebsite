from django.contrib import admin
from .models import Dentist, Service, Appointment


@admin.register(Dentist)
class DentistAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'experience_years', 'updated_at')
    search_fields = ('name', 'title')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order', 'is_active', 'updated_at')
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'service', 'preferred_date', 'preferred_time', 'created_at', 'is_confirmed')
    list_filter = ('service', 'is_confirmed', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_editable = ('is_confirmed',)
    date_hierarchy = 'created_at'
