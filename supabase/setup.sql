-- ==========================================
-- CALLPILOT AI - SUPABASE POSTGRESQL SCHEMA
-- ==========================================

-- Enable standard uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS "public";

-- Create Enums
CREATE TYPE public."Role" AS ENUM ('ADMIN', 'MANAGER', 'QA', 'AGENT');
CREATE TYPE public."CallStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE public."Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');
CREATE TYPE public."NotificationType" AS ENUM ('CALL_PROCESSED', 'QA_COMPLETED', 'SYSTEM_ALERT');

-- --------------------------------------------------
-- Table: organizations
-- --------------------------------------------------
CREATE TABLE public."organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "organizations_slug_key" ON public."organizations"("slug");
CREATE INDEX "organizations_slug_idx" ON public."organizations"("slug");

-- --------------------------------------------------
-- Table: teams
-- --------------------------------------------------
CREATE TABLE public."teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "teams_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "teams_organizationId_idx" ON public."teams"("organizationId");

-- --------------------------------------------------
-- Table: users
-- --------------------------------------------------
CREATE TABLE public."users" (
    "id" UUID NOT NULL, -- Matched to Supabase auth.users.id
    "email" TEXT NOT NULL,
    "supabaseId" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "role" public."Role" NOT NULL DEFAULT 'AGENT',
    "organizationId" UUID,
    "teamId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "users_email_key" ON public."users"("email");
CREATE UNIQUE INDEX "users_supabaseId_key" ON public."users"("supabaseId");
CREATE INDEX "users_organizationId_idx" ON public."users"("organizationId");
CREATE INDEX "users_teamId_idx" ON public."users"("teamId");
CREATE INDEX "users_email_idx" ON public."users"("email");

-- --------------------------------------------------
-- Table: calls
-- --------------------------------------------------
CREATE TABLE public."calls" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "status" public."CallStatus" NOT NULL DEFAULT 'PENDING',
    "customer_id" TEXT,
    "customer_name" TEXT,
    "agentId" UUID,
    "teamId" UUID,
    "organizationId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "calls_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES public."users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "calls_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "calls_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "calls_organizationId_idx" ON public."calls"("organizationId");
CREATE INDEX "calls_agentId_idx" ON public."calls"("agentId");
CREATE INDEX "calls_teamId_idx" ON public."calls"("teamId");
CREATE INDEX "calls_status_idx" ON public."calls"("status");

-- --------------------------------------------------
-- Table: call_analyses
-- --------------------------------------------------
CREATE TABLE public."call_analyses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "call_id" UUID NOT NULL,
    "summary" TEXT NOT NULL,
    "transcript" JSONB NOT NULL,
    "sentiment_overall" public."Sentiment" NOT NULL DEFAULT 'NEUTRAL',
    "sentiment_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "coachingTips" JSONB NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_analyses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "call_analyses_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES public."calls"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "call_analyses_call_id_key" ON public."call_analyses"("call_id");

-- --------------------------------------------------
-- Table: qa_reports
-- --------------------------------------------------
CREATE TABLE public."qa_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "call_id" UUID NOT NULL,
    "reviewer_id" UUID,
    "score" INTEGER NOT NULL DEFAULT 0,
    "checklist" JSONB NOT NULL,
    "feedback" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qa_reports_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "qa_reports_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES public."calls"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "qa_reports_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES public."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "qa_reports_call_id_idx" ON public."qa_reports"("call_id");
CREATE INDEX "qa_reports_reviewer_id_idx" ON public."qa_reports"("reviewer_id");

-- --------------------------------------------------
-- Table: crm_notes
-- --------------------------------------------------
CREATE TABLE public."crm_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "call_id" UUID NOT NULL,
    "summary" TEXT NOT NULL,
    "keyPoints" JSONB NOT NULL,
    "actionItems" JSONB NOT NULL,
    "exported" BOOLEAN NOT NULL DEFAULT false,
    "exported_at" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_notes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "crm_notes_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES public."calls"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "crm_notes_call_id_key" ON public."crm_notes"("call_id");

-- --------------------------------------------------
-- Table: notifications
-- --------------------------------------------------
CREATE TABLE public."notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" public."NotificationType" NOT NULL DEFAULT 'SYSTEM_ALERT',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES public."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "notifications_user_id_idx" ON public."notifications"("user_id");
CREATE INDEX "notifications_is_read_idx" ON public."notifications"("is_read");

-- --------------------------------------------------
-- Table: activity_logs
-- --------------------------------------------------
CREATE TABLE public."activity_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES public."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "activity_logs_user_id_idx" ON public."activity_logs"("user_id");

-- --------------------------------------------------
-- Table: settings
-- --------------------------------------------------
CREATE TABLE public."settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "qaRubric" JSONB NOT NULL,
    "crmIntegrationSettings" JSONB,
    "notificationsConfig" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES public."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "settings_organization_id_key" ON public."settings"("organization_id");

-- --------------------------------------------------
-- Supabase User Sync Function and Trigger
-- --------------------------------------------------
-- Automatically writes new Supabase Auth users to our public "users" table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, "supabaseId", role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    new.id::text,
    'AGENT'::public."Role",
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the sync function on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------
-- Row Level Security (RLS) Policies (Base scaffolding)
-- --------------------------------------------------
-- Enable RLS across tenant-sensitive tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 1. Users Policies: Users can view profiles in their own organization.
CREATE POLICY "Users can view workspace team members"
    ON public.users FOR SELECT
    USING (organizationId = (SELECT organizationId FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profiles"
    ON public.users FOR UPDATE
    USING (id = auth.uid());

-- 2. Call Record Policies: Users can access calls within their organization
CREATE POLICY "Users can read calls from their own organization"
    ON public.calls FOR SELECT
    USING (organizationId = (SELECT organizationId FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Managers/Owners can upload/insert calls"
    ON public.calls FOR INSERT
    WITH CHECK (
        organizationId = (SELECT organizationId FROM public.users WHERE id = auth.uid())
        AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('ADMIN', 'MANAGER')
    );

CREATE POLICY "Owners/Managers can edit calls"
    ON public.calls FOR UPDATE
    USING (
        organizationId = (SELECT organizationId FROM public.users WHERE id = auth.uid())
        AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('ADMIN', 'MANAGER')
    );

-- --------------------------------------------------
-- Supabase Storage Bucket Initialization
-- --------------------------------------------------
-- Create the public "calls" bucket for recording audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('calls', 'calls', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to uploaded audio recordings
CREATE POLICY "Public Read Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'calls');

-- Allow authenticated users to upload call recordings
CREATE POLICY "Authenticated Insert Access"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'calls');

-- Allow owner/managers to delete recording files
CREATE POLICY "Authorized Delete Access"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'calls'
        AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('ADMIN', 'MANAGER')
    );

