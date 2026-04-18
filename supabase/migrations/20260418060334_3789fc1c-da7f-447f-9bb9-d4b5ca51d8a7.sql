
-- ============================================
-- STORAGE RLS for user-files bucket
-- ============================================
DROP POLICY IF EXISTS "Users can view their own user-files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their own user-files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own user-files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own user-files" ON storage.objects;

CREATE POLICY "Users can view their own user-files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload to their own user-files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own user-files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own user-files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all storage objects (for admin dashboard)
DROP POLICY IF EXISTS "Admins can view all storage" ON storage.objects;
CREATE POLICY "Admins can view all storage"
ON storage.objects FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- ORDERS: allow users to cancel their own pending orders
-- ============================================
DROP POLICY IF EXISTS "Users can cancel their own pending orders" ON public.orders;
CREATE POLICY "Users can cancel their own pending orders"
ON public.orders FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status IN ('pending','processing'))
WITH CHECK (auth.uid() = user_id AND status IN ('pending','cancelled','processing'));

-- Add columns for shipping/payment snapshot
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_details jsonb,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS gst_amount integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_cost integer DEFAULT 0;

-- ============================================
-- CERTIFICATES: allow users to insert their own
-- (we'll validate course completion client-side AND with a check)
-- ============================================
DROP POLICY IF EXISTS "Users can claim their own certificates" ON public.certificates;
CREATE POLICY "Users can claim their own certificates"
ON public.certificates FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- JOBS system
-- ============================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  salary_range text NOT NULL,
  work_mode text NOT NULL DEFAULT 'office', -- 'remote' | 'office' | 'hybrid'
  location text,
  employment_type text NOT NULL DEFAULT 'full-time',
  is_open boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone authenticated can view open jobs" ON public.jobs;
CREATE POLICY "Anyone authenticated can view open jobs"
ON public.jobs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage jobs" ON public.jobs;
CREATE POLICY "Admins can manage jobs"
ON public.jobs FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cover_letter text,
  resume_url text NOT NULL,
  experience_years integer DEFAULT 0,
  current_company text,
  linkedin_url text,
  status text NOT NULL DEFAULT 'submitted', -- 'submitted' | 'reviewed' | 'accepted' | 'rejected'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own applications" ON public.job_applications;
CREATE POLICY "Users can view their own applications"
ON public.job_applications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can submit applications" ON public.job_applications;
CREATE POLICY "Users can submit applications"
ON public.job_applications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all applications" ON public.job_applications;
CREATE POLICY "Admins can view all applications"
ON public.job_applications FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update applications" ON public.job_applications;
CREATE POLICY "Admins can update applications"
ON public.job_applications FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- USER BANS / SUSPENSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  ban_type text NOT NULL DEFAULT 'suspension', -- 'suspension' | 'ban'
  reason text NOT NULL,
  banned_by uuid NOT NULL,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage bans" ON public.user_bans;
CREATE POLICY "Admins can manage bans"
ON public.user_bans FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own ban" ON public.user_bans;
CREATE POLICY "Users can view their own ban"
ON public.user_bans FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Indices
CREATE INDEX IF NOT EXISTS idx_jobs_open ON public.jobs(is_open);
CREATE INDEX IF NOT EXISTS idx_job_apps_user ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_job ON public.job_applications(job_id);

-- Updated-at triggers
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_apps_updated_at ON public.job_applications;
CREATE TRIGGER update_job_apps_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Seed initial jobs
-- ============================================
INSERT INTO public.jobs (title, department, description, requirements, salary_range, work_mode, location, employment_type) VALUES
('Robotics Mentor', 'Education', 'Guide students through robotics projects, host live workshops, and review submissions. You will work with the Academy team to design new curriculum and answer student questions in The Hive.', 'Strong background in Arduino/ESP32/Raspberry Pi. 2+ years teaching or mentoring experience. Good communication skills.', '₹6,00,000 - ₹12,00,000 per year', 'remote', NULL, 'full-time'),
('Delivery Executive', 'Logistics', 'Deliver electronic components from our Bengaluru warehouse to customers across the city. Manage your own route and ensure on-time delivery.', 'Valid driving license. Two-wheeler. Smartphone. Familiarity with Bengaluru roads.', '₹25,000 - ₹40,000 per month + incentives', 'office', 'Bengaluru — Adarsh Lakefront, Devarabisanahalli', 'full-time'),
('Sales Associate', 'Sales', 'Reach out to schools, colleges, and maker spaces to promote EngiNexus components and courses. Build long-term relationships with customers.', 'Bachelors degree. 1+ year sales experience preferred. Excellent English & Hindi/Kannada communication.', '₹4,50,000 - ₹8,00,000 per year + commission', 'hybrid', 'Bengaluru', 'full-time'),
('Senior IT Engineer', 'Engineering', 'Maintain and scale our backend infrastructure. Ship new features in React, TypeScript, and Postgres. Help debug edge functions and improve performance.', '4+ years building production web apps. Strong in TypeScript/React/SQL. Experience with Supabase or similar BaaS.', '₹15,00,000 - ₹28,00,000 per year', 'remote', NULL, 'full-time'),
('Customer Support Specialist', 'Support', 'Answer customer queries about orders, components, and courses. Manage refunds and escalate technical issues to engineering.', 'Excellent written communication. Patience. Familiarity with electronics is a plus.', '₹3,00,000 - ₹5,00,000 per year', 'remote', NULL, 'full-time'),
('Content Creator — Electronics', 'Marketing', 'Write tutorials, record video lessons, and create engaging social posts about electronics projects. Build the EngiNexus brand.', 'Portfolio of past technical content. Hands-on with Arduino/Pi. Comfortable on camera.', '₹4,00,000 - ₹9,00,000 per year', 'hybrid', 'Bengaluru', 'full-time'),
('Warehouse Manager', 'Logistics', 'Oversee inventory, manage stock levels, and coordinate with delivery executives. Ensure orders are packed accurately and on time.', '3+ years warehouse management. Familiarity with inventory software. Leadership skills.', '₹4,00,000 - ₹7,00,000 per year', 'office', 'Bengaluru — Adarsh Lakefront, Devarabisanahalli', 'full-time')
ON CONFLICT DO NOTHING;
