import type { Dentist, Service, AppointmentPayload, TimeSlot } from '@/types';

// In production (e.g. Vercel), set VITE_API_URL to your backend API base (e.g. https://your-backend.com/api)
const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

const AUTH_TOKEN_KEY = 'drji_access_token';
const AUTH_USER_KEY = 'drji_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredUser(): { id: number; email: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: { id: number; email: string }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = getStoredToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const msg = err.message || err.detail;
    const fallback = res.status === 404 ? 'Service unavailable. Connect a backend or check VITE_API_URL.' : res.statusText;
    throw new Error((typeof msg === 'string' && msg.trim()) ? msg : fallback);
  }

  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (json && json.success === true && 'data' in json) return json.data as T;
  return json as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  auth: {
    signup: (data: { name: string; email: string; password: string; confirm_password: string }) =>
      api.post<{ detail: string }>('/auth/signup/', data),
    verifyEmail: (email: string, otp: string) =>
      api.post<{ detail: string }>('/auth/verify-email/', { email, otp }),
    login: (email: string, password: string) =>
      api.post<{ access: string; refresh: string; user: { id: number; email: string } }>('/auth/login/', { email, password }),
    forgotPassword: (email: string) =>
      api.post<{ detail: string }>('/auth/forgot-password/', { email }),
    resetPassword: (email: string, otp: string, new_password: string) =>
      api.post<{ detail: string }>('/auth/reset-password/', { email, otp, new_password }),
  },

  dentists: {
    list: () => api.get<Dentist[]>('/dentists/'),
    get: (id: number) => api.get<Dentist>(`/dentists/${id}/`),
  },

  services: {
    list: () => api.get<Service[]>('/services/'),
    get: (slug: string) => api.get<Service>(`/services/${slug}/`),
  },

  appointments: {
    getAvailableSlots: (date: string) =>
      api.get<TimeSlot[]>(`/appointments/available-slots/?date=${encodeURIComponent(date)}`),
    create: (data: AppointmentPayload) =>
      api.post<AppointmentPayload>('/appointments/', data),
  },
};
