-- ============================================================
-- Jobnique: Direct Jobs table (employer posted jobs)
-- Run this in your Supabase SQL Editor
-- ============================================================

create table if not exists public.direct_jobs (
  id              uuid        primary key default gen_random_uuid(),

  job_title       text        not null,
  category        text        not null,
  location        text        not null,
  job_type        text        not null,
  description     text        not null,
  requirements    text,
  benefits        text,
  salary_min      integer,
  salary_max      integer,

  company_name    text        not null,
  company_website text,

  contact_name    text        not null,
  contact_email   text        not null,
  contact_phone   text,

  plan            text,       -- e.g., 'Pay-Per-Application', 'Featured Listing', 'Resume Search'
  status          text        not null default 'pending', -- pending, approved, rejected, expired
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Soft delete or expiration
  expired         boolean     not null default false
);

-- Indexes for common queries
create index if not exists idx_direct_jobs_status      on public.direct_jobs (status);
create index if not exists idx_direct_jobs_created_at  on public.direct_jobs (created_at desc);
create index if not exists idx_direct_jobs_company     on public.direct_jobs (company_name);
create index if not exists idx_direct_jobs_location    on public.direct_jobs (location);
create index if not exists idx_direct_jobs_category    on public.direct_jobs (category);
create index if not exists idx_direct_jobs_expired     on public.direct_jobs (expired);

-- Full-text search
create index if not exists idx_direct_jobs_fts on public.direct_jobs
  using gin (to_tsvector('english', coalesce(job_title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(company_name,'')));

-- Row-level security: public can read approved and non-expired jobs
alter table public.direct_jobs enable row level security;

create policy "Public can read approved direct jobs"
  on public.direct_jobs for select
  using (status = 'approved' AND expired = false);

-- Only service role (or authenticated employer via API) can insert/update
-- We rely on the API layer for authentication/authorization.

comment on table public.direct_jobs is
  'Jobs posted directly by employers via the /post-a-job form. These are separate from ATS-ingested jobs.';