from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

def api_root(request):
    """Root URL: confirm backend is running and point to API."""
    return JsonResponse({
        'message': 'Dr. JI Dental API is running.',
        'docs': '/api/',
        'admin': '/admin/',
        'auth': '/api/auth/',
    })

urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('dental.urls')),
]
