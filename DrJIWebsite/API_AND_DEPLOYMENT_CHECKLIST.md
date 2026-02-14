# API & Deployment Checklist

## ✅ API Status – All Done

| API | Method | URL | Backend | Frontend use | Status |
|-----|--------|-----|---------|--------------|--------|
| List dentists | GET | `/api/dentists/` | `DentistViewSet` | About page | ✅ |
| Get dentist (by id) | GET | `/api/dentists/<id>/` | `DentistViewSet` | Optional (not used) | ✅ |
| List services | GET | `/api/services/` | `ServiceViewSet` | Services page | ✅ |
| Get service (by slug) | GET | `/api/services/<slug>/` | `ServiceViewSet` | Optional (not used) | ✅ |
| Create appointment | POST | `/api/appointments/` | `AppointmentViewSet.create` | Book Appointment form | ✅ |

- **Backend:** `backend/dental/views.py`, `urls.py`, `serializers.py`, `models.py`
- **Frontend:** `frontend/src/api/client.ts` – all three resources (dentists, services, appointments) are wired.
- **CORS:** Updated to allow `localhost:3000` and `127.0.0.1:3000` (and 5173).

Nothing is missing for the current features. The site uses only these APIs; no extra endpoints are required for the current scope.

---

## Should You Deploy?

**You can deploy when:**
- You have run the backend locally (migrate, seed_data) and the frontend (npm run dev) and confirmed:
  - About page loads dentist
  - Services page loads services
  - Book form submits and shows “Appointment Request Received”
  - You see the new appointment in Django admin

**Before deploying, do:**

1. **Backend (Django)**  
   - Set `DEBUG = False`.  
   - Set a strong `SECRET_KEY` (env var).  
   - Set `ALLOWED_HOSTS` to your real domain(s).  
   - Use a production database (e.g. PostgreSQL), not SQLite.  
   - Set `CORS_ALLOWED_ORIGINS` to your frontend URL(s), e.g. `https://yourdomain.com`.  
   - Serve static/admin files (e.g. `whitenoise` or your host’s method).

2. **Frontend (React/Vite)**  
   - Build: `npm run build`.  
   - Point the app’s API base URL to your deployed backend (e.g. env var `VITE_API_URL` and use it in `api/client.ts` instead of `/api` if backend is on a different domain).  
   - Serve the `dist/` folder with a web server (Nginx, or host’s static hosting).

3. **Hosting ideas**  
   - **Backend:** Railway, Render, PythonAnywhere, or a VPS (e.g. Ubuntu + Gunicorn + Nginx).  
   - **Frontend:** Vercel, Netlify, or same server as backend (Nginx serving `dist/`).  
   - **Database:** Use the host’s PostgreSQL or a managed DB (e.g. Railway, Render, Neon).

**Summary:** All APIs for this project are implemented and working. You can deploy once the above production settings and hosting are in place.
