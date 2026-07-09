/**
 * Integration Event Payload Types
 *
 * Canonical, typed payload shapes for every TriggerEvent defined in the registry.
 * These are the data contracts between the application and provider services.
 *
 * Rules:
 *  - All fields are snake_case-free: use camelCase TypeScript conventions.
 *  - All date/time values are ISO 8601 strings.
 *  - All numeric scores are 0–100.
 *  - Provider services receive these payloads via the dispatcher (services/integrations/index.ts)
 *    and are responsible for transforming them into their own wire format.
 */

import type { TriggerEvent } from './registry'

// ─── Envelope ────────────────────────────────────────────────────────────────

/**
 * Wraps any typed event payload with routing and identity metadata.
 * This is the top-level structure dispatched to every provider.
 */
export interface IntegrationEventEnvelope<T = Record<string, unknown>> {
  /** Globally unique event ID (e.g. crypto.randomBytes(8).toString('hex')) */
  id: string
  /** The trigger event type that caused this dispatch */
  event: TriggerEvent
  /** ISO 8601 timestamp of when the event was emitted */
  timestamp: string
  /** Organization that owns this integration */
  organizationId: string
  /** The typed event data */
  data: T
}

// ─── Per-Event Payload Shapes ─────────────────────────────────────────────────

/**
 * Emitted when a call has been fully processed and analysis is ready.
 * Trigger: 'call_completed'
 */
export interface CallCompletedPayload {
  callId: string
  callTitle?: string
  agentId?: string
  agentName: string
  customerName?: string
  /** Duration in seconds */
  duration: number
  /** AI-generated call summary */
  summary?: string
  /** Extracted action items from the call */
  actionItems?: string[]
  /** Overall sentiment: POSITIVE | NEUTRAL | NEGATIVE */
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  /** Direct URL to the call detail page in the app */
  callUrl?: string
}

/**
 * Emitted when a QA reviewer submits a score for a call.
 * Trigger: 'qa_scored'
 */
export interface QaScoredPayload {
  callId: string
  callTitle?: string
  agentId?: string
  agentName: string
  reviewerId?: string
  reviewerName?: string
  /** QA score 0–100 */
  qaScore: number
  /** Maximum possible score */
  maxScore: number
  /** Per-section breakdown: { sectionName: score } */
  sectionScores?: Record<string, number>
  notes?: string
  callUrl?: string
}

/**
 * Emitted when a QA score falls below the configured alert threshold.
 * Trigger: 'low_score_alert'
 */
export interface LowScoreAlertPayload {
  callId: string
  callTitle?: string
  agentId?: string
  agentName: string
  /** QA score that triggered the alert */
  qaScore: number
  /** The threshold that was breached */
  threshold: number
  /** Number of points below the threshold */
  gap: number
  callUrl?: string
}

/**
 * Emitted when a file upload fails during processing.
 * Trigger: 'upload_failed'
 */
export interface UploadFailedPayload {
  callId: string
  filename: string
  agentId?: string
  agentName?: string
  /** Human-readable failure reason */
  reason: string
  /** Machine-readable error code (optional) */
  errorCode?: string
  /** Number of retry attempts made before giving up */
  attempts: number
}

/**
 * Emitted for periodic weekly digest reports.
 * Trigger: 'weekly_report'
 */
export interface WeeklyReportPayload {
  /** ISO 8601 start of the week period */
  weekOf: string
  /** ISO 8601 end of the week period */
  weekEnd: string
  totalCalls: number
  averageQaScore: number
  /** Number of calls that triggered a low-score alert */
  flaggedCount: number
  topAgent?: string
  /** Agent with the lowest average QA score this week */
  bottomAgent?: string
  /** Report URL in the app */
  reportUrl?: string
}

/**
 * Emitted when a specific agent is flagged for review (e.g. repeated low scores).
 * Trigger: 'agent_flagged'
 */
export interface AgentFlaggedPayload {
  agentId: string
  agentName: string
  /** Reason code: LOW_SCORE_STREAK | COMPLIANCE_BREACH | MANUAL */
  reason: 'LOW_SCORE_STREAK' | 'COMPLIANCE_BREACH' | 'MANUAL'
  reasonDescription?: string
  /** Number of recent calls that led to this flag */
  triggeringCallCount: number
  /** Average score over those calls */
  averageScore: number
  flaggedById?: string
  flaggedByName?: string
}

// ─── Payload Union ────────────────────────────────────────────────────────────

/** Union of all typed event data payloads */
export type IntegrationPayload =
  | CallCompletedPayload
  | QaScoredPayload
  | LowScoreAlertPayload
  | UploadFailedPayload
  | WeeklyReportPayload
  | AgentFlaggedPayload

/** Map from TriggerEvent → its payload type */
export type TriggerPayloadMap = {
  call_completed:  CallCompletedPayload
  qa_scored:       QaScoredPayload
  low_score_alert: LowScoreAlertPayload
  upload_failed:   UploadFailedPayload
  weekly_report:   WeeklyReportPayload
  agent_flagged:   AgentFlaggedPayload
}
