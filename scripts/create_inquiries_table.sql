-- Supabase Schema for The Vedic School Contact Inquiries
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text,
  whatsapp_country text,
  whatsapp_country_code text,
  grade text,
  inquiry_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.inquiries enable row level security;

-- Drop policy if it exists to allow clean re-runs
drop policy if exists "Allow public anonymous inquiry insert" on public.inquiries;

-- Allow anonymous visitors to submit an inquiry
create policy "Allow public anonymous inquiry insert"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- Explicitly grant insert privilege to anon role
grant insert on public.inquiries to anon;

-- Note: No SELECT, UPDATE, or DELETE policies exist for anon.
-- Website visitors cannot view, list, or alter inquiries.
