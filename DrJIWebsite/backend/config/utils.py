"""
Standard API response format (success/error envelope).
Use across all endpoints for consistent, production-style responses.
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def success_response(data=None, message=None, status_code=status.HTTP_200_OK):
    """
    Success envelope: { "success": true, "data": ..., "message": ... }
    """
    payload = {'success': True}
    if data is not None:
        payload['data'] = data
    if message:
        payload['message'] = message
    return Response(payload, status=status_code)


def error_response(message, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Error envelope: { "success": false, "message": "...", "errors": {...} }
    """
    payload = {'success': False, 'message': message}
    if errors is not None:
        payload['errors'] = errors
    return Response(payload, status=status_code)


def exception_handler(exc, context):
    """
    DRF exception handler: return standard error envelope for all API errors.
    """
    response = drf_exception_handler(exc, context)
    if response is None:
        return None
    payload = {
        'success': False,
        'message': 'Request failed.',
        'errors': response.data,
    }
    if isinstance(response.data, dict):
        if 'detail' in response.data:
            detail = response.data['detail']
            payload['message'] = detail if isinstance(detail, str) else str(detail)
            if len(response.data) == 1:
                payload['errors'] = None
        else:
            payload['message'] = 'Validation error.'
    response.data = payload
    return response
