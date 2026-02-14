export interface Dentist {
  id: number;
  name: string;
  title: string;
  bio: string;
  experience_years: number;
  philosophy: string;
  certifications: string;
  image?: string | null;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  benefits: string;
  benefits_list: string[];
  experience_highlight: string;
  icon: string;
  order: number;
}

export interface AppointmentPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
}

export const PREFERRED_TIME_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'No preference' },
  { value: 'morning', label: 'Morning (8 AM – 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM – 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM – 7 PM)' },
];

export const SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: 'general', label: 'General Dentistry' },
  { value: 'cleaning', label: 'Teeth Cleaning & Polishing' },
  { value: 'root_canal', label: 'Root Canal Treatment' },
  { value: 'extraction', label: 'Tooth Extraction' },
  { value: 'implants', label: 'Dental Implants' },
  { value: 'orthodontics', label: 'Braces & Orthodontics' },
  { value: 'whitening', label: 'Teeth Whitening' },
  { value: 'cosmetic', label: 'Cosmetic Dentistry' },
  { value: 'pediatric', label: 'Pediatric Dentistry' },
  { value: 'gum_treatment', label: 'Gum Treatment' },
];
