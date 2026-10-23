-- ==========================================================================
-- BrightPath CRM — Migration 02: Row Level Security (RLS) & Access Policies
-- Enforces least-privilege role boundaries: Counsellor vs Manager vs Admin
-- ==========================================================================

-- 1. Enable Row Level Security (RLS) on all exposed tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- ==========================================================================
-- SECURITY DEFINER HELPER: Non-recursive Role Lookup
-- Prevents infinite recursion when evaluating policies on public.profiles
-- ==========================================================================
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = user_id;

    RETURN COALESCE(user_role, 'counsellor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper to check if current user is manager or admin
CREATE OR REPLACE FUNCTION public.is_staff_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.get_user_role(auth.uid()) IN ('admin', 'manager');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================================================
-- RLS POLICIES: PROFILES TABLE
-- ==========================================================================

-- Policy: All authenticated staff can read profiles (needed for assigning leads)
DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Users can update their own profile name, but cannot self-promote role
-- Only admins can change the role column
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
        id = auth.uid() OR public.get_user_role(auth.uid()) = 'admin'
    )
    WITH CHECK (
        -- If user is admin, allow any change. If not admin, role must remain unchanged.
        public.get_user_role(auth.uid()) = 'admin'
        OR (
            id = auth.uid() 
            AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
        )
    );

-- ==========================================================================
-- RLS POLICIES: LEADS TABLE
-- ==========================================================================

-- Policy SELECT: Managers and Admins view all leads.
-- Counsellors view leads assigned to them or created by them.
DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
CREATE POLICY "leads_select_policy"
    ON public.leads
    FOR SELECT
    TO authenticated
    USING (
        public.is_staff_manager_or_admin()
        OR assigned_to = auth.uid()
        OR created_by = auth.uid()
    );

-- Policy INSERT: Any authenticated staff member can create a lead
DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
CREATE POLICY "leads_insert_policy"
    ON public.leads
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
    );

-- Policy UPDATE: Managers/Admins can update any lead.
-- Counsellors can only update leads they own/are assigned to.
DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;
CREATE POLICY "leads_update_policy"
    ON public.leads
    FOR UPDATE
    TO authenticated
    USING (
        public.is_staff_manager_or_admin()
        OR assigned_to = auth.uid()
        OR created_by = auth.uid()
    )
    WITH CHECK (
        public.is_staff_manager_or_admin()
        OR assigned_to = auth.uid()
        OR created_by = auth.uid()
    );

-- Policy DELETE: Only Administrator can delete leads (prevents accidental data loss)
DROP POLICY IF EXISTS "leads_delete_admin_only" ON public.leads;
CREATE POLICY "leads_delete_admin_only"
    ON public.leads
    FOR DELETE
    TO authenticated
    USING (
        public.get_user_role(auth.uid()) = 'admin'
    );

-- ==========================================================================
-- RLS POLICIES: FOLLOW_UPS TABLE
-- Follow-up access matches access to the parent lead
-- ==========================================================================

-- Policy SELECT: Follow-ups for accessible leads
DROP POLICY IF EXISTS "followups_select_policy" ON public.follow_ups;
CREATE POLICY "followups_select_policy"
    ON public.follow_ups
    FOR SELECT
    TO authenticated
    USING (
        public.is_staff_manager_or_admin()
        OR assigned_to = auth.uid()
        OR created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.leads l
            WHERE l.id = follow_ups.lead_id
            AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
        )
    );

-- Policy INSERT: Can schedule follow-ups on accessible leads
DROP POLICY IF EXISTS "followups_insert_policy" ON public.follow_ups;
CREATE POLICY "followups_insert_policy"
    ON public.follow_ups
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
            public.is_staff_manager_or_admin()
            OR EXISTS (
                SELECT 1 FROM public.leads l
                WHERE l.id = follow_ups.lead_id
                AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
            )
        )
    );

-- Policy UPDATE: Can complete / reschedule follow-ups on accessible leads
DROP POLICY IF EXISTS "followups_update_policy" ON public.follow_ups;
CREATE POLICY "followups_update_policy"
    ON public.follow_ups
    FOR UPDATE
    TO authenticated
    USING (
        public.is_staff_manager_or_admin()
        OR assigned_to = auth.uid()
        OR created_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.leads l
            WHERE l.id = follow_ups.lead_id
            AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
        )
    );

-- Policy DELETE: Only admin can delete follow-up records
DROP POLICY IF EXISTS "followups_delete_admin_only" ON public.follow_ups;
CREATE POLICY "followups_delete_admin_only"
    ON public.follow_ups
    FOR DELETE
    TO authenticated
    USING (
        public.get_user_role(auth.uid()) = 'admin'
    );

-- ==========================================================================
-- RLS POLICIES: ACTIVITIES TABLE (Append-Only Audit Trail)
-- ==========================================================================

-- Policy SELECT: Read activity history on accessible leads
DROP POLICY IF EXISTS "activities_select_policy" ON public.activities;
CREATE POLICY "activities_select_policy"
    ON public.activities
    FOR SELECT
    TO authenticated
    USING (
        public.is_staff_manager_or_admin()
        OR EXISTS (
            SELECT 1 FROM public.leads l
            WHERE l.id = activities.lead_id
            AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
        )
    );

-- Policy INSERT: Append audit log entry
DROP POLICY IF EXISTS "activities_insert_policy" ON public.activities;
CREATE POLICY "activities_insert_policy"
    ON public.activities
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
    );

-- Notice: No UPDATE or DELETE policies on activities!
-- The activity timeline is an immutable append-only audit trail.
