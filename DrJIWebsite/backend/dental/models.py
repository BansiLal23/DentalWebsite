from django.db import models


class Dentist(models.Model):
    """Dentist profile for About page."""
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(default=20)
    philosophy = models.TextField(blank=True)
    image = models.ImageField(upload_to='dentist/', blank=True, null=True)
    certifications = models.TextField(blank=True, help_text='One per line')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Dentists'

    def __str__(self):
        return self.name


class Service(models.Model):
    """Dental services offered."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    benefits = models.TextField(blank=True, help_text='One benefit per line')
    experience_highlight = models.CharField(max_length=300, blank=True)
    icon = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Appointment(models.Model):
    """Appointment booking requests."""
    SERVICE_CHOICES = [
        ('general', 'General Dentistry'),
        ('cleaning', 'Teeth Cleaning & Polishing'),
        ('root_canal', 'Root Canal Treatment'),
        ('extraction', 'Tooth Extraction'),
        ('implants', 'Dental Implants'),
        ('orthodontics', 'Braces & Orthodontics'),
        ('whitening', 'Teeth Whitening'),
        ('cosmetic', 'Cosmetic Dentistry'),
        ('pediatric', 'Pediatric Dentistry'),
        ('gum_treatment', 'Gum Treatment'),
    ]
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    preferred_date = models.DateField(null=True, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.get_service_display()} ({self.created_at.date()})"
