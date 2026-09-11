import { createClient } from '@supabase/supabase-js';

// Safe environment variable accessor supporting Vite (import.meta.env) and Node/testing (process.env)
const getEnv = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return String(import.meta.env[key]);
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]);
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabasePublishableKey =
  getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

if (!isSupabaseConfigured && typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
  console.warn(
    '[The Vedic School] Supabase credentials not configured in environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.'
  );
}

// Client initialized strictly with public publishable key. Never uses service role or secrets.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export interface DemoRegistrationPayload {
  registration_type: 'demo';
  parent_name: string;
  child_name: string;
  whatsapp: string;
  whatsapp_country: string;
  whatsapp_country_code: string;
  grade: string;
  email: string;
  whatsapp_consent: true;
}

export interface AssessmentRegistrationPayload {
  registration_type: 'assessment';
  parent_name: string;
  child_name: string;
  whatsapp: string;
  whatsapp_country: string;
  whatsapp_country_code: string;
  grade: string;
  board: string;
  support_needed: string;
  email: string;
  whatsapp_consent: true;
}

export type RegistrationPayload = DemoRegistrationPayload | AssessmentRegistrationPayload;

export async function submitRegistration(
  data: RegistrationPayload
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Registration service is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.',
    };
  }

  try {
    const { error } = await supabase.from('registrations').insert([data]);

    if (error) {
      console.error('[Supabase Registration Error]', error);
      return {
        success: false,
        error: error.message || 'Unable to submit your registration. Please try again.',
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase Unexpected Error]', err);
    return {
      success: false,
      error: err?.message || 'A network error occurred. Please check your connection and try again.',
    };
  }
}

export interface InquiryPayload {
  name: string;
  email: string;
  whatsapp?: string | null;
  whatsapp_country?: string | null;
  whatsapp_country_code?: string | null;
  grade?: string | null;
  inquiry_type: string;
  message: string;
}

export async function submitInquiry(
  data: InquiryPayload
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Inquiry service is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.',
    };
  }

  try {
    const { error } = await supabase.from('inquiries').insert([data]);

    if (error) {
      console.error('[Supabase Inquiry Error]', error);
      return {
        success: false,
        error: error.message || 'Unable to submit your inquiry. Please try again.',
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase Unexpected Error]', err);
    return {
      success: false,
      error: err?.message || 'A network error occurred. Please check your connection and try again.',
    };
  }
}

