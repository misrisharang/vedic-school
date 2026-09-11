-- Supabase Schema for The Vedic School Registrations
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_type text not null check (registration_type in ('demo', 'assessment')),
  parent_name text not null,
  child_name text not null,
  whatsapp text not null,
  grade text not null,
  email text not null,
  board text,
  support_needed text,
  whatsapp_consent boolean not null default true,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.registrations enable row level security;

-- Drop policy if it exists to allow clean re-runs
drop policy if exists "Allow public anonymous registration insert" on public.registrations;

-- Allow anonymous visitors to submit their registration
create policy "Allow public anonymous registration insert"
  on public.registrations
  for insert
  to anon
  with check (true);

-- Note: No SELECT, UPDATE or DELETE policies exist for anon/public.
-- Website visitors cannot view, list or alter database contents.
