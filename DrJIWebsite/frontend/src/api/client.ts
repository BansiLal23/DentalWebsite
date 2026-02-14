import type { Dentist, Service, AppointmentPayload } from '@/types';

// In production (e.g. Vercel), set VITE_API_URL to your backend API base (e.g. https://your-backend.com/api)
const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || err.message || JSON.stringify(err) || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  dentists: {
    list: () => api.get<Dentist[]>('/dentists/'),
    get: (id: number) => api.get<Dentist>(`/dentists/${id}/`),
  },

  services: {
    list: () => api.get<Service[]>('/services/'),
    get: (slug: string) => api.get<Service>(`/services/${slug}/`),
  },

  appointments: {
    create: (data: AppointmentPayload) =>
      api.post<AppointmentPayload>('/appointments/', data),
  },
};
