# Dr. JI Dental Website – Project Overview

This document explains **what the project is**, **what was used**, **how it works**, and **how everything connects**.

---

## 1. Big Picture: Two Parts

The project has **two separate applications** that talk to each other:

```
┌─────────────────────────────────────┐          ┌─────────────────────────────────────┐
│           FRONTEND                   │   HTTP   │           BACKEND                   │
│  (React + Vite + TypeScript)        │ ───────► │  (Django + Django REST Framework)    │
│  Runs on: http://localhost:3000      │   API    │  Runs on: http://127.0.0.1:8000     │
│  Folder: frontend/                  │  calls   │  Folder: backend/                    │
│  - Shows pages (UI)                 │          │  - Stores data (SQLite)               │
│  - Sends form data to API          │          │  - Serves REST API                    │
│  - Displays data from API          │          │  - Admin panel                        │
└─────────────────────────────────────┘          └─────────────────────────────────────┘
```

- **Frontend** = What the user sees and interacts with (browser).
- **Backend** = Where data is stored and where the API lives (server).
- They communicate over **HTTP**: frontend calls backend URLs (e.g. `/api/appointments/`) to get or save data.

---

## 2. What Was Used (Tech Stack)

| Layer      | Technology              | What it does in this project |
|-----------|--------------------------|-------------------------------|
| Frontend  | **React**                | Builds the UI (pages, forms, buttons). |
| Frontend  | **TypeScript**           | Typed JavaScript for fewer bugs. |
| Frontend  | **Vite**                 | Dev server, builds the app, proxies API to backend. |
| Frontend  | **React Router**         | Handles routes: `/`, `/about`, `/services`, `/book`, `/contact`. |
| Backend   | **Django**               | Web framework: URLs, settings, admin. |
| Backend   | **Django REST Framework**| Exposes REST API (GET/POST) for dentists, services, appointments. |
| Backend   | **SQLite**               | Database file (`db.sqlite3`) where all data is saved. |
| Backend   | **django-cors-headers**  | Allows frontend (different port) to call the API. |

---

## 3. Project Folder Structure (What You Have)

```
DrJIWebsite/
├── backend/                    # Django API + database
│   ├── config/                 # Django project settings
│   │   ├── settings.py         # DB, apps, CORS, REST config
│   │   └── urls.py             # Root URLs: /admin/, /api/
│   ├── dental/                 # Main Django app
│   │   ├── models.py           # Dentist, Service, Appointment (database tables)
│   │   ├── serializers.py      # Convert model data ↔ JSON for API
│   │   ├── views.py            # API logic: list dentists/services, create appointment
│   │   ├── urls.py             # API routes: /api/dentists/, /api/services/, /api/appointments/
│   │   ├── admin.py            # Register models for Django admin panel
│   │   └── migrations/         # Database schema (tables)
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3              # ← Appointment & other data saved HERE
│
├── frontend/                   # React app (what user sees)
│   ├── src/
│   │   ├── main.tsx            # Entry: renders <App /> into #root
│   │   ├── App.tsx              # Routes: Home, About, Services, Book, Contact
│   │   ├── index.css            # Global styles (colors, buttons, etc.)
│   │   ├── api/
│   │   │   └── client.ts        # All API calls to backend (fetch)
│   │   ├── components/          # Reusable UI: Layout, Header, Footer, ServiceCard
│   │   ├── pages/               # One component per page
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx        # Fetches dentist from API
│   │   │   ├── Services.tsx    # Fetches services from API
│   │   │   ├── BookAppointment.tsx  # Form → POST to API
│   │   │   └── Contact.tsx
│   │   └── types/               # TypeScript types (Dentist, Service, etc.)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts          # Port 3000, proxy /api → backend
│
└── README.md
```

---

## 4. How the Frontend Works

1. **Entry:** Browser loads `index.html` → loads `main.tsx` → React renders `App`.
2. **Routing:** `App.tsx` uses React Router. Depending on the URL:
   - `/` → Home  
   - `/about` → About  
   - `/services` → Services  
   - `/book` → BookAppointment  
   - `/contact` → Contact  
3. **Layout:** Every page is wrapped in `Layout` (Header + main content + Footer).
4. **API calls:** Pages that need data use `api` from `src/api/client.ts`:
   - **About:** `api.dentists.list()` → GET `/api/dentists/`
   - **Services:** `api.services.list()` → GET `/api/services/`
   - **Book:** `api.appointments.create(data)` → POST `/api/appointments/` with form data.

The frontend does **not** have a database. It only:
- Renders HTML/CSS (UI),
- Sends HTTP requests to the backend,
- Shows the response (e.g. list of services, or “Appointment received”).

---

## 5. How the Backend Works

1. **URLs:** Django gets a request. `config/urls.py` sends:
   - `/admin/` → Django admin site
   - `/api/` → `dental/urls.py`
2. **API routes:** In `dental/urls.py`, a router registers:
   - `/api/dentists/` → DentistViewSet (list dentists)
   - `/api/services/` → ServiceViewSet (list services)
   - `/api/appointments/` → AppointmentViewSet (create appointment)
3. **Views:** Each ViewSet in `views.py` uses a **serializer** to turn JSON ↔ Python objects and uses **models** to read/write the database.
4. **Models:** In `models.py`:
   - **Dentist** – name, bio, experience, philosophy, certifications
   - **Service** – name, slug, description, benefits, etc.
   - **Appointment** – name, email, phone, service, preferred_date, message
5. **Database:** All of this is stored in **SQLite** in `backend/db.sqlite3`. One table per model.

So: **backend = API + database**. It does not render HTML for the main site; it only returns JSON for the frontend and serves the admin panel.

---

## 6. How Frontend and Backend Connect (Proxy)

- Frontend runs at **http://localhost:3000**.
- Backend runs at **http://127.0.0.1:8000**.

If the frontend called `http://127.0.0.1:8000/api/appointments/` directly, you’d have to worry about CORS. So in **development**, Vite is configured as a **proxy**:

- In `vite.config.ts`: any request from the browser to **/api/...** is forwarded to **http://127.0.0.1:8000/api/...**.
- So the frontend code only says `fetch('/api/appointments/', ...)`. The browser sends that to the same origin (localhost:3000), and Vite forwards it to the Django server. The user stays on port 3000; the API runs on port 8000.

---

## 7. Example Flow: User Books an Appointment

| Step | Where | What happens |
|------|--------|----------------|
| 1 | User | Fills form on `/book` and clicks Submit. |
| 2 | `BookAppointment.tsx` | `handleSubmit` runs → validates form → calls `api.appointments.create({ name, email, phone, service, ... })`. |
| 3 | `api/client.ts` | `appointments.create()` does `fetch('/api/appointments/', { method: 'POST', body: JSON.stringify(data) })`. |
| 4 | Vite | Sees `/api/appointments/` → proxies request to `http://127.0.0.1:8000/api/appointments/`. |
| 5 | Django | Receives POST at `/api/appointments/` → router calls `AppointmentViewSet.create(request)`. |
| 6 | `views.py` | `create()` uses `AppointmentSerializer(data=request.data)` → `is_valid()` → `save()`. |
| 7 | `serializers.py` | Validates fields (e.g. name length, phone). |
| 8 | `models.py` | `serializer.save()` creates one `Appointment` row in the database. |
| 9 | Django | Returns HTTP 201 and the saved appointment as JSON. |
| 10 | Frontend | `api.appointments.create()` gets the response → no error → `setSuccess(true)` → user sees “Appointment Request Received”. |

**Where is the data?** In the **Appointment** table in **backend/db.sqlite3**. You can also see it in **Django admin**: http://127.0.0.1:8000/admin → Dental → Appointments.

---

## 8. Summary Table

| Question | Answer |
|----------|--------|
| What is the frontend? | React app (Vite + TypeScript) in `frontend/`. Shows pages and forms, calls API. |
| What is the backend? | Django app in `backend/`. Serves REST API and stores data in SQLite. |
| Where is booking data saved? | In `backend/db.sqlite3`, table **Appointment**. |
| How does the frontend talk to the backend? | HTTP: GET/POST to `/api/...`. In dev, Vite proxies `/api` to port 8000. |
| What APIs exist? | GET `/api/dentists/`, GET `/api/services/`, POST `/api/appointments/`. |
| How do I see saved appointments? | Run backend, open http://127.0.0.1:8000/admin, log in, go to Appointments. |

---

This is the overall flow and how the project works end to end.
