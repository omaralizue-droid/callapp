-- Migration: Add extended CRM note fields and ai_coach_report column
-- These columns were added to the schema after the initial migration

-- Add extended CRM note fields
ALTER TABLE "crm_notes"
  ADD COLUMN IF NOT EXISTS "customerName"   TEXT,
  ADD COLUMN IF NOT EXISTS "agentName"      TEXT,
  ADD COLUMN IF NOT EXISTS "callPurpose"    TEXT,
  ADD COLUMN IF NOT EXISTS "issue"          TEXT,
  ADD COLUMN IF NOT EXISTS "resolution"     TEXT,
  ADD COLUMN IF NOT EXISTS "followUp"       TEXT,
  ADD COLUMN IF NOT EXISTS "productsMentioned" JSONB,
  ADD COLUMN IF NOT EXISTS "callDuration"   DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "importantNotes" TEXT;

-- Add ai_coach_report column to call_analyses
ALTER TABLE "call_analyses"
  ADD COLUMN IF NOT EXISTS "ai_coach_report" JSONB;
