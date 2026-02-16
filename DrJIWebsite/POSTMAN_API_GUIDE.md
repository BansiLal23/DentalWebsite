# Postman API Guide – Dr. JI Dental Backend

Use this guide to test every API in order.  
**Base URL:** `http://127.0.0.1:8000`  
**Backend must be running:** `python manage.py runserver` (from `DrJIWebsite/backend`).

---

## Sign up in Postman – do this exactly

If you get **400 Bad Request** and the response says "name" and "email" are required, the **body was empty**. Do this:

1. In Postman, set the method to **POST** and the URL to:  
   `http://127.0.0.1:8000/api/auth/signup/`

2. Click the **Body** tab (under the URL).

3. Select **raw** (radio button).

4. In the dropdown on the right of "raw", choose **JSON** (not Text).

5. In the big text box, **paste exactly this** (all four lines; you can change the name/email/password if you want):
   ```json
   {"name": "Test Patient", "email": "patient@example.com", "password": "SecurePass1!", "confirm_password": "SecurePass1!"}
   ```
   Or with line breaks (same thing):
   ```json
   {
     "name": "Test Patient",
     "email": "patient@example.com",
     "password": "SecurePass1!",
     "confirm_password": "SecurePass1!"
   }
   ```

6. Click the **Headers** tab and add one header (if it’s not there):
   - Key: `Content-Type`
   - Value: `application/json`

7. Click **Send**.

You should get **201** and a message like "Verification code sent to your email."

---

## One-time setup in Postman

1. Create an **Environment** (optional): variable `base` = `http://127.0.0.1:8000`.
2. For every request that has a body, set **Header:**  
   `Content-Type` = `application/json`.
3. Use **Body → raw → JSON** for all POST bodies below.

---

## Step 1 – Check backend is running

**Request:**  
**GET** `http://127.0.0.1:8000/`

**Body:** None.

**What to expect:**  
Status **200**, JSON like:
```json
{
  "message": "Dr. JI Dental API is running.",
  "docs": "/api/",
  "admin": "/admin/",
  "auth": "/api/auth/"
}
```

**Why:** Confirms the server is up before testing other APIs.

---

## Step 2 – Customer sign up

**Request:**  
**POST** `http://127.0.0.1:8000/api/auth/signup/`

**Headers:**  
`Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "name": "Test Patient",
  "email": "patient@example.com",
  "password": "SecurePass1!",
  "confirm_password": "SecurePass1!"
}
```

**What to expect:**  
- Status **201**.  
- Response: `{ "detail": "Verification code sent to your email. Please verify within 5 minutes." }`  
- In the **terminal** where `runserver` is running you will see the **6-digit OTP** (if you use console email backend).  
- Copy that OTP for Step 3 (e.g. `123456`).

**Why:** Creates a new customer account (inactive until email is verified) and sends OTP.

---

## Step 3 – Verify email (activate account)

**Request:**  
**POST** `http://127.0.0.1:8000/api/auth/verify-email/`

**Headers:**  
`Content-Type: application/json`

**Body (raw JSON):**  
Replace `123456` with the OTP you got in Step 2 (terminal or email).
```json
{
  "email": "patient@example.com",
  "otp": "123456"
}
```

**What to expect:**  
- Status **200**.  
- Response: `{ "detail": "Email verified. You can now sign in." }`

**Why:** Activates the account so the user can sign in.

---

## Step 4 – Customer sign in (login)

**Request:**  
**POST** `http://127.0.0.1:8000/api/auth/login/`

**Headers:**  
`Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "email": "patient@example.com",
  "password": "SecurePass1!"
}
```

**What to expect:**  
- Status **200**.  
- Response example:
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "patient@example.com"
  }
}
```
- **Copy the `access` value** – this is the JWT you use in Step 8 (optional) and for any future “authenticated” request.

**Why:** Gets tokens so you can call APIs as a logged-in customer (e.g. book appointment while signed in).

---

## Step 5 – Refresh token (optional)

**Request:**  
**POST** `http://127.0.0.1:8000/api/auth/token/refresh/`

**Headers:**  
`Content-Type: application/json`

**Body (raw JSON):**  
Use the `refresh` token from Step 4.
```json
{
  "refresh": "PASTE_REFRESH_TOKEN_FROM_STEP_4"
}
```

**What to expect:**  
- Status **200**.  
- New `access` token in the response. Use it in the same way as in Step 4.

**Why:** Get a new access token when the old one expires, without logging in again.

---

## Step 6 – List dentists (read-only)

**Request:**  
**GET** `http://127.0.0.1:8000/api/dentists/`

**Body:** None.

**What to expect:**  
- Status **200**.  
- JSON array of dentists (may be empty `[]` if none added in admin).

**Why:** Tests the public “dentists” API used by the frontend.

---

## Step 7 – List services (read-only)

**Request:**  
**GET** `http://127.0.0.1:8000/api/services/`

**Body:** None.

**What to expect:**  
- Status **200**.  
- JSON array of active services (may be empty or have seed data).

**Why:** Tests the public “services” API.

---

## Step 8 – Book appointment

**Request:**  
**POST** `http://127.0.0.1:8000/api/appointments/`

**Headers:**  
- `Content-Type: application/json`  
- **Optional (if logged in):** `Authorization: Bearer PASTE_ACCESS_TOKEN_FROM_STEP_4`  
  If you send this, the appointment will be linked to that customer.

**Body (raw JSON) – minimal (required fields only):**
```json
{
  "name": "Test Patient",
  "email": "patient@example.com",
  "phone": "5551234567",
  "service": "general"
}
```

**Body (raw JSON) – full (with optional fields):**
```json
{
  "name": "Test Patient",
  "email": "patient@example.com",
  "phone": "5551234567",
  "service": "cleaning",
  "preferred_date": "2026-03-15",
  "preferred_time": "morning",
  "message": "First visit, need cleaning."
}
```

**Valid `service` values:**  
`general`, `cleaning`, `root_canal`, `extraction`, `implants`, `orthodontics`, `whitening`, `cosmetic`, `pediatric`, `gum_treatment`

**Valid `preferred_time` values:**  
`""` (no preference), `morning`, `afternoon`, `evening`

**What to expect:**  
- Status **201**.  
- JSON of the created appointment (id, name, email, phone, service, preferred_date, preferred_time, message, created_at, customer if you sent the token).

**Why:** This is the main “book appointment” API; it works with or without a logged-in user.

---

## Step 9 – Forgot password (request reset code)

**Request:**  
**POST** `http://127.0.0.1:8000/api/auth/forgot-password/`

**Headers:**  
`Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "email": "patient@example.com"
}
```

**What to expect:**  
- Status **200**.  
- Response: `{ "detail": "Password reset code sent to your email. Valid for 5 minutes." }`  
- OTP again in **terminal** (or email). Copy it for Step 10.

**Why:** Starts the “forgot password” flow; next step is reset with OTP + new password.

---

## Step 10 – Reset password (with OTP)

**Request:**  
**POST** `http://127.0.0.1:8000/api/auth/reset-password/`

**Headers:**  
`Content-Type: application/json`

**Body (raw JSON):**  
Replace `123456` with the OTP from Step 9. New password must match rules (8+ chars, upper, lower, digit, special).
```json
{
  "email": "patient@example.com",
  "otp": "123456",
  "new_password": "NewSecure1!"
}
```

**What to expect:**  
- Status **200**.  
- Response: `{ "detail": "Password reset successfully. You can now sign in." }`  
- You can then **login** (Step 4) with the same email and `NewSecure1!`.

**Why:** Completes the forgot-password flow.

---

## Quick reference – all URLs and methods

| # | What you test          | Method | URL |
|---|------------------------|--------|-----|
| 1 | Backend health         | GET    | `http://127.0.0.1:8000/` |
| 2 | Sign up                | POST   | `http://127.0.0.1:8000/api/auth/signup/` |
| 3 | Verify email           | POST   | `http://127.0.0.1:8000/api/auth/verify-email/` |
| 4 | Login                  | POST   | `http://127.0.0.1:8000/api/auth/login/` |
| 5 | Refresh token          | POST   | `http://127.0.0.1:8000/api/auth/token/refresh/` |
| 6 | List dentists          | GET    | `http://127.0.0.1:8000/api/dentists/` |
| 7 | List services          | GET    | `http://127.0.0.1:8000/api/services/` |
| 8 | Book appointment       | POST   | `http://127.0.0.1:8000/api/appointments/` |
| 9 | Forgot password        | POST   | `http://127.0.0.1:8000/api/auth/forgot-password/` |
|10 | Reset password         | POST   | `http://127.0.0.1:8000/api/auth/reset-password/` |

**Optional:**  
- **GET** `http://127.0.0.1:8000/api/dentists/1/` – one dentist by id  
- **GET** `http://127.0.0.1:8000/api/services/general/` – one service by slug (`general`, `cleaning`, etc.)

---

## Suggested test order (flow)

1. **1** – Confirm server is up.  
2. **2** – Sign up a test customer.  
3. **3** – Verify email with OTP from terminal/email.  
4. **4** – Login and copy `access` token.  
5. **6, 7** – List dentists and services (no auth).  
6. **8** – Book appointment once without `Authorization`, once with `Authorization: Bearer <access>` to see the difference (customer link).  
7. **9, 10** – Test forgot password → reset password, then login again with the new password.

This order matches how a real user would: sign up → verify → login → use the site (and optionally reset password).
