-- ==========================================================================
-- BrightPath CRM — Migration 01: Core Relational Schema & Triggers
-- Tables: profiles, leads, follow_ups, activities
-- ==========================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================================
-- TABLE 1: PROFILES (Extends Supabase auth.users)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'counsellor' CHECK (role IN ('admin', 'manager', 'counsellor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role lookups and team lists
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==========================================================================
-- TABLE 2: LEADS (Student Inquiries)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    course_interest TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('Website', 'Walk-in', 'Referral', 'Social Media', 'Phone Inquiry', 'Other')),
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes for search and multi-filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON public.leads(created_by);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);

-- ==========================================================================
-- TABLE 3: FOLLOW_UPS (Scheduled Tasks & Deadlines)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_at TIMESTAMPTZ NOT NULL,
    note TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for overdue task computation and task queue views
CREATE INDEX IF NOT EXISTS idx_followups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_followups_assigned_to ON public.follow_ups(assigned_to);
CREATE INDEX IF NOT EXISTS idx_followups_due_at ON public.follow_ups(due_at);
CREATE INDEX IF NOT EXISTS idx_followups_status ON public.follow_ups(status);
-- Composite index for fast overdue queries (status = 'pending' AND due_at < NOW())
CREATE INDEX IF NOT EXISTS idx_followups_overdue ON public.follow_ups(status, due_at) WHERE status = 'pending';

-- ==========================================================================
-- TABLE 4: ACTIVITIES (Immutable Audit History Timeline)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for chronological lead activity timeline
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.activities(lead_id, created_at DESC);

-- ==========================================================================
-- AUTOMATED TRIGGERS
-- ==========================================================================

-- Trigger Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles and leads
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_leads_updated_at ON public.leads;
CREATE TRIGGER set_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger Function: Auto-create a profile on user sign up in auth.users
-- Defaults to least-privileged role 'counsellor'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    extracted_name TEXT;
BEGIN
    -- Extract full name from auth metadata or fallback to email prefix
    extracted_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1),
        'Staff Member'
    );

    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (NEW.id, extracted_name, 'counsellor', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
