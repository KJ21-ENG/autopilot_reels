-- Story 1.5: Core tables for payments, user_payment_links, and events
-- References: docs/tech-spec-epic-1.md#Data-Models-and-Contracts

create extension if not exists "pgcrypto";

-- Payments capture Stripe checkout metadata for payment-first funnel.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null,
  stripe_customer_id text,
  email text,
  price_id text not null,
  amount integer not null,
  currency text not null,
  status text not null,
  created_at timestamptz not null default now(),
  constraint payments_stripe_session_id_unique unique (stripe_session_id)
);

-- User-payment linkage for post-payment auth workflows.
create table if not exists public.user_payment_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  payment_id uuid not null,
  linked_at timestamptz not null default now(),
  constraint user_payment_links_user_id_fkey
    foreign key (user_id) references auth.users (id),
  constraint user_payment_links_payment_id_fkey
    foreign key (payment_id) references public.payments (id)
);

-- Analytics events for baseline funnel tracking.
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid,
  session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Optional helpful indexes for lookups. Keep minimal for MVP.
create index if not exists events_event_name_idx on public.events (event_name);
create index if not exists user_payment_links_user_id_idx on public.user_payment_links (user_id);
create index if not exists user_payment_links_payment_id_idx on public.user_payment_links (payment_id);
