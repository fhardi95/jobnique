-- ============================================================
-- Jobnique: ATS Jobs table
-- Run this in your Supabase SQL Editor
-- ============================================================

create table if not exists public.ats_jobs (
  -- Composite ID: "{source}-{token}-{externalId}"
  id              text        primary key,

  source          text        not null check (source in ('greenhouse','lever','workday')),
  ats_apply_url   text        not null,

  title           text        not null,
  company         text        not null,
  location        text        not null,
  department      text,
  category        text,

  salary_min      integer,
  salary_max      integer,
  description     text,
  contract_time   text        check (contract_time in ('full_time','part_time')),
  remote          boolean     not null default false,

  posted_at       timestamptz not null default now(),
  synced_at       timestamptz not null default now(),

  -- Soft-delete: set to true when job no longer appears in ATS feed
  expired         boolean     not null default false
);

-- Indexes for the most common query patterns
create index if not exists idx_ats_jobs_source      on public.ats_jobs (source);
create index if not exists idx_ats_jobs_posted_at   on public.ats_jobs (posted_at desc);
create index if not exists idx_ats_jobs_expired      on public.ats_jobs (expired);
create index if not exists idx_ats_jobs_company      on public.ats_jobs (company);
create index if not exists idx_ats_jobs_remote        on public.ats_jobs (remote) where remote = true;

-- Full-text search index
create index if not exists idx_ats_jobs_fts on public.ats_jobs
  using gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(company,'')));

-- Row-level security: public read, no public write
alter table public.ats_jobs enable row level security;

create policy "Public can read active ATS jobs"
  on public.ats_jobs for select
  using (expired = false);

-- Only service role (used by /api/ats-sync) can upsert
-- (Service role bypasses RLS, so no extra policy needed)

comment on table public.ats_jobs is
  'Jobs ingested from employer ATS platforms (Greenhouse, Lever, Workday). Synced hourly via /api/ats-sync.';
