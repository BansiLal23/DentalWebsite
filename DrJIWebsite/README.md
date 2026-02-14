# Dr. JI Dental Care – Professional Dentist Website

A full-stack professional dentist website featuring **20+ years of trusted dental care**, built with **Django (REST API)** and **React + Vite + TypeScript**.

## Tech Stack

- **Backend:** Django 4.x, Django REST Framework, SQLite (development)
- **Frontend:** React 18, Vite 5, TypeScript
- **Database:** SQLite for development

## Project Structure

```
DrJIWebsite/
├── backend/          # Django REST API
│   ├── config/       # Django settings & URLs
│   ├── dental/       # Main app: models, API, admin
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/      # API client
│   │   ├── components/
│   │   ├── pages/
│   │   └── types/
│   ├── index.html
│   └── package.json
└── README.md
```

## Running the Project Locally

### 1. Backend (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data     # Load default dentist + services
python manage.py runserver
```

- API: **http://127.0.0.1:8000**
- Admin: **http://127.0.0.1:8000/admin** (create a superuser with `python manage.py createsuperuser`)

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- App: **http://localhost:5173**

The Vite dev server proxies `/api` to `http://127.0.0.1:8000`, so API calls from the frontend work without CORS issues during development.

### 3. Run Both

1. Start the Django server in one terminal (`cd backend && python manage.py runserver`).
2. Start the frontend in another terminal (`cd frontend && npm run dev`).
3. Open **http://localhost:5173** in your browser.

## Website Features

- **Home:** Hero (“20 Years of Trusted Dental Care”), intro, CTAs (Book Appointment, Contact Us).
- **About:** Dentist profile from API (bio, experience, philosophy, certifications).
- **Services:** All major dental services as cards (General, Cleaning, Root Canal, Extraction, Implants, Orthodontics, Whitening, Cosmetic, Pediatric, Gum Treatment) with description, benefits, and experience highlights.
- **Book Appointment:** Form (name, email, phone, service, preferred date, message) with client- and server-side validation; submissions stored via Django API.
- **Contact:** Address, phone, email, hours, and a Google Map placeholder.

## Backend (Django)

- **Models:** `Dentist`, `Service`, `Appointment`
- **REST APIs:**
  - `GET /api/dentists/` – list dentist(s)
  - `GET /api/services/` – list services
  - `POST /api/appointments/` – create appointment
- **Admin:** Full CRUD for Dentist, Service, and Appointments at `/admin/`

## Frontend

- **Routing:** React Router (Home, About, Services, Book, Contact).
- **API:** Central client in `src/api/client.ts` calling the Django backend.
- **UI:** Responsive layout, healthcare-oriented styling, reusable components (Layout, Header, Footer, ServiceCard).
- **Validation:** Required fields and format checks on the appointment form.

## SEO

- Semantic HTML and heading hierarchy.
- Meta description and keywords in `index.html`.
- Descriptive page titles and section headings.

## Production Build

**Frontend:**

```bash
cd frontend
npm run build
```

Static files are in `frontend/dist/`. Serve them with your web server or point Django to this folder if you serve the SPA from Django.

**Backend:** Set `DEBUG=False`, configure `ALLOWED_HOSTS`, use a production database (e.g. PostgreSQL), and set `DJANGO_SECRET_KEY` and CORS origins as needed.
