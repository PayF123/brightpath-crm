-- ==========================================================================
-- BrightPath CRM — Migration 03: Idempotent Demo Seed Data (Optional)
-- Fictional coaching institute sample leads for workshop testing
-- ==========================================================================

DO $$
DECLARE
    first_profile_id UUID;
    lead_aarav_id UUID;
    lead_priya_id UUID;
    lead_rohan_id UUID;
    lead_ananya_id UUID;
    lead_vikram_id UUID;
BEGIN
    -- Look for any registered profile to associate sample leads with
    SELECT id INTO first_profile_id FROM public.profiles LIMIT 1;

    -- 1. Insert Fictional Student Inquiries (if not already present)
    IF NOT EXISTS (SELECT 1 FROM public.leads WHERE email = 'aarav.demo@brightpath.test') THEN
        INSERT INTO public.leads (
            full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes, created_at
        ) VALUES (
            'Aarav Sharma',
            'aarav.demo@brightpath.test',
            '+91 98765 43210',
            'Full Stack Web Development',
            'Website',
            'New',
            first_profile_id,
            first_profile_id,
            'Inquired through website form. Interested in weekend batch timings and scholarship criteria.',
            NOW() - INTERVAL '3 hours'
        ) RETURNING id INTO lead_aarav_id;

        -- Create activity log
        INSERT INTO public.activities (lead_id, actor_id, activity_type, description, created_at)
        VALUES (lead_aarav_id, first_profile_id, 'LEAD_CREATED', 'Enquiry received via Website Contact Form', NOW() - INTERVAL '3 hours');

        -- Create Overdue Follow-up task (due 1 hour ago)
        INSERT INTO public.follow_ups (lead_id, assigned_to, due_at, note, status, created_by, created_at)
        VALUES (
            lead_aarav_id,
            first_profile_id,
            NOW() - INTERVAL '1 hour',
            'Initial discovery call: verify eligibility and share curriculum PDF',
            'pending',
            first_profile_id,
            NOW() - INTERVAL '3 hours'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.leads WHERE email = 'priya.demo@brightpath.test') THEN
        INSERT INTO public.leads (
            full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes, created_at
        ) VALUES (
            'Priya Patel',
            'priya.demo@brightpath.test',
            '+91 98123 45678',
            'Data Science & AI',
            'Walk-in',
            'Contacted',
            first_profile_id,
            first_profile_id,
            'Visited campus reception. Wants demo session for Python for Data Analysis.',
            NOW() - INTERVAL '1 day'
        ) RETURNING id INTO lead_priya_id;

        INSERT INTO public.activities (lead_id, actor_id, activity_type, description, created_at)
        VALUES (lead_priya_id, first_profile_id, 'LEAD_CREATED', 'Enquiry recorded from Walk-in Desk', NOW() - INTERVAL '1 day');

        INSERT INTO public.activities (lead_id, actor_id, activity_type, description, created_at)
        VALUES (lead_priya_id, first_profile_id, 'STATUS_CHANGED', 'Status transitioned from New to Contacted', NOW() - INTERVAL '6 hours');

        -- Upcoming Follow-up task (due tomorrow at 11:00 AM)
        INSERT INTO public.follow_ups (lead_id, assigned_to, due_at, note, status, created_by, created_at)
        VALUES (
            lead_priya_id,
            first_profile_id,
            NOW() + INTERVAL '1 day',
            'Follow up after Saturday demo class to discuss admission fee',
            'pending',
            first_profile_id,
            NOW() - INTERVAL '6 hours'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.leads WHERE email = 'rohan.demo@brightpath.test') THEN
        INSERT INTO public.leads (
            full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes, created_at
        ) VALUES (
            'Rohan Verma',
            'rohan.demo@brightpath.test',
            '+91 97654 32109',
            'Cloud Computing & DevOps',
            'Referral',
            'Qualified',
            first_profile_id,
            first_profile_id,
            'Referred by alumni Rahul M. Has 1 year basic IT experience, ready for advanced certification.',
            NOW() - INTERVAL '2 days'
        ) RETURNING id INTO lead_rohan_id;

        INSERT INTO public.activities (lead_id, actor_id, activity_type, description, created_at)
        VALUES (lead_rohan_id, first_profile_id, 'LEAD_CREATED', 'Referral enquiry logged', NOW() - INTERVAL '2 days');

        -- Completed follow-up
        INSERT INTO public.follow_ups (lead_id, assigned_to, due_at, note, status, completed_at, created_by, created_at)
        VALUES (
            lead_rohan_id,
            first_profile_id,
            NOW() - INTERVAL '1 day',
            'Technical background screening call with senior counsellor',
            'completed',
            NOW() - INTERVAL '1 day',
            first_profile_id,
            NOW() - INTERVAL '2 days'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.leads WHERE email = 'ananya.demo@brightpath.test') THEN
        INSERT INTO public.leads (
            full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes, created_at
        ) VALUES (
            'Ananya Gupta',
            'ananya.demo@brightpath.test',
            '+91 99887 76655',
            'AI Engineering',
            'Social Media',
            'Converted',
            first_profile_id,
            first_profile_id,
            'Admission confirmed! Payment completed for November Cohort.',
            NOW() - INTERVAL '5 days'
        ) RETURNING id INTO lead_ananya_id;

        INSERT INTO public.activities (lead_id, actor_id, activity_type, description, created_at)
        VALUES (lead_ananya_id, first_profile_id, 'STATUS_CHANGED', 'Status transitioned to Converted (Enrolled)', NOW() - INTERVAL '1 day');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.leads WHERE email = 'vikram.demo@brightpath.test') THEN
        INSERT INTO public.leads (
            full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes, created_at
        ) VALUES (
            'Vikram Singh',
            'vikram.demo@brightpath.test',
            '+91 91234 56789',
            'Full Stack Web Development',
            'Phone Inquiry',
            'Lost',
            first_profile_id,
            first_profile_id,
            'Lost reason: Fee too high. Requested installment options not currently supported.',
            NOW() - INTERVAL '4 days'
        ) RETURNING id INTO lead_vikram_id;

        INSERT INTO public.activities (lead_id, actor_id, activity_type, description, metadata, created_at)
        VALUES (
            lead_vikram_id,
            first_profile_id,
            'STATUS_CHANGED',
            'Status transitioned to Lost (Reason: Fee too high)',
            '{"reason": "Fee too high"}'::jsonb,
            NOW() - INTERVAL '3 days'
        );
    END IF;
END $$;
