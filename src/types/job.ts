export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  location: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  requirements: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  company_name: string | null;
  company_logo: string | null;
  company_description: string | null;
  created_at: string;
  updated_at: string;
}
