-- Story 1.5 sanity checks for core tables and constraints.
-- Expected results:
-- - Three rows in information_schema.tables for payments, user_payment_links, events.
-- - payments.stripe_session_id unique constraint present.
-- - user_payment_links foreign keys to auth.users and public.payments present.

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('payments', 'user_payment_links', 'events')
order by table_name;

select tc.table_name, tc.constraint_name, tc.constraint_type
from information_schema.table_constraints tc
where tc.table_schema = 'public'
  and tc.table_name in ('payments', 'user_payment_links')
order by tc.table_name, tc.constraint_type, tc.constraint_name;

select
  kcu.table_name,
  kcu.column_name,
  ccu.table_schema as foreign_table_schema,
  ccu.table_name as foreign_table_name,
  ccu.column_name as foreign_column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
  and ccu.table_schema = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.table_name = 'user_payment_links'
order by kcu.column_name;
