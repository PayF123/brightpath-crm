# Supabase Database Migrations & Setup Guide

This folder contains the complete, repeatable SQL migrations for **BrightPath CRM**.

---

## Migration Files Overview

1. [`20261023000001_initial_schema.sql`](file:///d:/Be10X/BUILD_SIDE_INCOME_USING_AI/project/brightpath-crm/supabase/migrations/20261023000001_initial_schema.sql):
   - Creates `profiles`, `leads`, `follow_ups`, and `activities` tables.
   - Sets up foreign keys, composite indexes, and `updated_at` triggers.
   - Sets up `on_auth_user_created` trigger (automatically assigns role `counsellor`).
2. [`20261023000002_rls_policies.sql`](file:///d:/Be10X/BUILD_SIDE_INCOME_USING_AI/project/brightpath-crm/supabase/migrations/20261023000002_rls_policies.sql):
   - Enables Row Level Security (RLS) on all 4 tables.
   - Configures non-recursive security policies separating Counsellor vs Manager vs Admin.
   - Protects against user self-promotion to `admin` or `manager`.
3. [`20261023000003_demo_seed.sql`](file:///d:/Be10X/BUILD_SIDE_INCOME_USING_AI/project/brightpath-crm/supabase/migrations/20261023000003_demo_seed.sql):
   - Inserts fictional student leads, sample follow-ups, and activity history for testing.

---

## How to Apply Migrations (Quickest Method via Web UI)

1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Paste the migration files in order (or run them together):
   - First run `20261023000001_initial_schema.sql`
   - Then run `20261023000002_rls_policies.sql`
   - (Optional) Run `20261023000003_demo_seed.sql`
5. Click **Run** (green button).

---

## Verification Queries

After clicking **Run**, execute this query in the SQL Editor to confirm your tables and RLS are active:

```sql
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'leads', 'follow_ups', 'activities');
```

Expected result:
```
table_name   | rls_enabled
-------------+------------
profiles     | true
leads        | true
follow_ups   | true
activities   | true
```

---

## Admin Bootstrap Procedure

Whenever a staff member signs up via the app, they receive the least-privileged `counsellor` role. 

To safely elevate your user account to **Admin**:
1. Run this query in the **Supabase SQL Editor**:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```
