-- Enable Row Level Security (RLS) for core tables
alter table public.payments enable row level security;
alter table public.user_payment_links enable row level security;
alter table public.events enable row level security;

-- Policies for public.payments
-- Default: Deny all (No policies added, so only service_role/admin can access)
-- This is secure as payments are sensitive Stripe metadata.

-- Policies for public.user_payment_links
-- Allow authenticated users to view their own payment links
create policy "Users can view their own payment links"
on public.user_payment_links
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Policies for public.events
-- Allow anonymous users to insert events (tracking funnel before auth)
create policy "Anyone can insert events"
on public.events
for insert
to public
with check (true);

-- Allow users to view their own events, and restrict other reads to service role
create policy "Users can view their own events"
on public.events
for select
to authenticated
using ((select auth.uid()) = user_id);
