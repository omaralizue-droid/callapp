/**
 * Integrations Library — Barrel Export
 *
 * Single entry point for all lib-layer integrations types and utilities.
 * Import from '@/lib/integrations' instead of individual files.
 *
 * Usage:
 *   import { INTEGRATION_REGISTRY, CallCompletedPayload, ConfigurationError } from '@/lib/integrations'
 */

// ─── Registry ─────────────────────────────────────────────────────────────────
export {
  INTEGRATION_REGISTRY,
  getIntegrationDef,
  getProvidersByCategory,
  TRIGGER_LABELS,
} from './registry'

export type {
  IntegrationProvider,
  IntegrationStatus,
  TriggerEvent,
  ConfigFieldType,
  ConfigField,
  IntegrationDefinition,
} from './registry'

// ─── Payload Types ────────────────────────────────────────────────────────────
export type {
  IntegrationEventEnvelope,
  CallCompletedPayload,
  QaScoredPayload,
  LowScoreAlertPayload,
  UploadFailedPayload,
  WeeklyReportPayload,
  AgentFlaggedPayload,
  IntegrationPayload,
  TriggerPayloadMap,
} from './payloads'

// ─── Error Classes ────────────────────────────────────────────────────────────
export {
  IntegrationError,
  ConfigurationError,
  AuthenticationError,
  RateLimitError,
  DeliveryError,
  isIntegrationError,
} from './errors'

// ─── Delivery Log Types ───────────────────────────────────────────────────────
export type {
  DeliveryLogEntry,
  IntegrationDeliverySummary,
  DeliveryResult,
} from './delivery-log'
