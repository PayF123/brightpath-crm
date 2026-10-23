export type UserRole = 'admin' | 'manager' | 'counsellor'

export type LeadSource =
  | 'Website'
  | 'Walk-in'
  | 'Referral'
  | 'Social Media'
  | 'Phone Inquiry'
  | 'Other'

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Converted'
  | 'Lost'

export type FollowUpStatus = 'pending' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  full_name: string
  email: string | null
  phone: string
  course_interest: string
  source: LeadSource
  status: LeadStatus
  assigned_to: string | null
  created_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface FollowUp {
  id: string
  lead_id: string
  assigned_to: string | null
  due_at: string
  note: string
  status: FollowUpStatus
  completed_at: string | null
  created_by: string | null
  created_at: string
}

export interface Activity {
  id: string
  lead_id: string
  actor_id: string | null
  activity_type: string
  description: string
  metadata: Record<string, unknown>
  created_at: string
}

/**
 * Supabase Generic Database Schema Mapping
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>> & {
          id: string
          full_name: string
        }
        Update: Partial<Profile>
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Lead>
      }
      follow_ups: {
        Row: FollowUp
        Insert: Omit<FollowUp, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<FollowUp>
      }
      activities: {
        Row: Activity
        Insert: Omit<Activity, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Activity>
      }
    }
  }
}
