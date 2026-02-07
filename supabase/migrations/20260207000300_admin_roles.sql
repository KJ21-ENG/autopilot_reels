-- Migration: Create user_roles table for RBAC
-- Path: supabase/migrations/20260207000300_admin_roles.sql

create table if not exists public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null check (role in ('admin', 'staff', 'user')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint user_roles_user_id_key unique (user_id)
);

-- Function to check if a user is an admin (MUST BE defined before use in policies)
create or replace function public.is_admin()
returns boolean as $$
begin
return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
);
end;
$$ language plpgsql security definer;

-- Enable RLS
alter table public.user_roles enable row level security;

-- Policies
-- Admins can do anything
create policy "Admins can manage all roles"
on public.user_roles
for all
to authenticated
using (public.is_admin());

-- Users can view their own roles
create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);
