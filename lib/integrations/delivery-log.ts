/**
 * Integration Delivery Log Types
 *
 * Defines the data shape for a delivery log entry — one record per event dispatch
 * attempt to a specific integration. This type is the contract for a future
 * IntegrationDeliveryLog Prisma model and/or an in-memory ring buffer.
 *
 * When the integrations module moves from stubs to live API calls, each
 * dispatchIntegrationEvent() call should produce one DeliveryLogEntry.
 *
 * Future Prisma model sketch:
 *
 *   model IntegrationDeliveryLog {
 *     id             String      @id @default(uuid())
 *     integrationId  String      @map("integration_id")
 *     integration    Integration @relation(fields: [integrationId], references: [id], onDelete: Cascade)
 *     event          String      // TriggerEvent value
 *     success        Boolean
 *     simulated      Boolean
 *     httpStatus     Int?        @map("http_status")
 *     durationMs     Int?        @map("duration_ms")
 *     errorType      String?     @map("error_type")   // ConfigurationError | AuthenticationError | ...
 *     errorMessage   String?     @map("error_message")
 *     payloadJson    Json?       @map("payload_json")
 *     createdAt      DateTime    @default(now()) @map("created_at")
 *
 *     @@index([integrationId])
 *     @@index([event])
 *     @@index([success])
 *     @@map("integration_delivery_logs")
 *   }
 */

import type { TriggerEvent } from './registry'

// ─── Delivery Log Entry ───────────────────────────────────────────────────────

/**
 * One delivery attempt record per dispatchIntegrationEvent() call.
 */
export interface DeliveryLogEntry {
  /** Unique log entry ID (uuid or random hex) */
  id: string

  /** The integration instance this delivery was made for */
  integrationId: string

  /** Provider identifier (matches IntegrationProvider) */
  provider: string

  /** The event that triggered this dispatch */
  event: TriggerEvent

  /** Whether the delivery completed without an error */
  success: boolean

  /**
   * Whether the delivery was simulated (stub) rather than a real network call.
   * Always true until the stubs are replaced with live implementations.
   */
  simulated: boolean

  /**
   * HTTP status code returned by the provider endpoint.
   * Undefined for simulated deliveries or non-HTTP failures.
   */
  httpStatus?: number

  /**
   * Round-trip time in milliseconds from dispatch to response.
   * Undefined for simulated deliveries.
   */
  durationMs?: number

  /**
   * The error class name if the delivery failed.
   * e.g. 'ConfigurationError', 'AuthenticationError', 'RateLimitError', 'DeliveryError'
   */
  errorType?: string

  /**
   * Human-readable error message if the delivery failed.
   */
  errorMessage?: string

  /**
   * The payload that was sent (or would have been sent).
   * Store as unknown to avoid coupling the log type to specific payload shapes.
   */
  payload: unknown

  /** ISO 8601 timestamp of the delivery attempt */
  timestamp: string
}

// ─── Delivery Summary ─────────────────────────────────────────────────────────

/**
 * Aggregated delivery statistics for a single integration over a time window.
 * Used for health dashboards and status badges.
 */
export interface IntegrationDeliverySummary {
  integrationId: string
  provider: string
  /** Total delivery attempts in the window */
  totalAttempts: number
  /** Number of successful deliveries */
  successCount: number
  /** Number of failed deliveries */
  failureCount: number
  /** Number of simulated deliveries (stubs) */
  simulatedCount: number
  /** Success rate 0.0–1.0 */
  successRate: number
  /** Average duration in milliseconds (excludes simulated) */
  averageDurationMs?: number
  /** Breakdown by event type */
  byEvent: Record<TriggerEvent, { attempts: number; successes: number }>
  /** Most recent delivery timestamp */
  lastAttemptAt?: string
  /** Most recent successful delivery timestamp */
  lastSuccessAt?: string
}

// ─── Delivery Result ──────────────────────────────────────────────────────────

/**
 * Returned by dispatchIntegrationEvent() — used to write the DeliveryLogEntry.
 * Matches the existing DispatchResult shape in services/integrations/index.ts
 * but adds the timing field needed for logging.
 */
export interface DeliveryResult {
  integrationId: string
  provider: string
  event: TriggerEvent
  success: boolean
  simulated: boolean
  durationMs?: number
  httpStatus?: number
  error?: string
}
