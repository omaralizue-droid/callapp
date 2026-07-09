/**
 * BaseIntegrationService
 *
 * Abstract base class for all provider-specific integration services.
 * Enforces a common interface, standardizes logging, and manages config access.
 *
 * Every provider service (HubSpot, Salesforce, Slack, Teams, Zapier, Webhook)
 * must extend this class and implement `testConnection()`.
 *
 * Usage (in provider service files):
 *
 *   export class HubSpotService extends BaseIntegrationService<HubSpotConfig> {
 *     async testConnection() { ... }
 *   }
 */

import type { Integration } from '@prisma/client'
import type { TriggerEvent } from '@/lib/integrations/registry'

// ─── Service Result Types ─────────────────────────────────────────────────────

/** Minimum shape returned by any service operation */
export interface ServiceResult {
  success: boolean
  /** true while real network calls are replaced by console stubs */
  simulated: boolean
  error?: string
}

/** Result returned by testConnection() on every provider */
export interface ConnectionTestResult extends ServiceResult {
  /** Human-readable status message shown in the UI test-result panel */
  message: string
}

// ─── Abstract Base ────────────────────────────────────────────────────────────

/**
 * Abstract base for all integration provider services.
 *
 * @template TConfig The provider-specific config shape (e.g. HubSpotConfig).
 *                   Defaults to `Record<string, string>` — the shape stored in
 *                   the Integration.config JSON column.
 */
export abstract class BaseIntegrationService<TConfig extends object = Record<string, string>> {
  /** The raw Prisma Integration row */
  protected readonly integration: Integration
  /** The provider identifier (e.g. 'HUBSPOT') */
  protected readonly provider: string
  /** Unique ID of this integration instance */
  protected readonly integrationId: string
  /** Typed config extracted from the Integration's JSON column */
  protected readonly config: TConfig

  constructor(integration: Integration) {
    this.integration = integration
    this.provider = integration.provider
    this.integrationId = integration.id
    this.config = (integration.config ?? {}) as TConfig
  }

  /**
   * Test that the integration's configuration is valid and the provider
   * is reachable. Must be implemented by every provider service.
   *
   * - In stub phase: validates required fields only, returns simulated: true
   * - In live phase: makes a lightweight API call (e.g. auth.test, token verify)
   */
  abstract testConnection(): Promise<ConnectionTestResult>

  // ─── Shared Utilities ────────────────────────────────────────────────────

  /**
   * Standardized console log with [Provider][STUB] prefix.
   * Use this instead of raw console.info throughout all service methods.
   */
  protected log(method: string, message: string): void {
    console.info(`[${this.provider}][STUB] ${method} → ${message}`)
  }

  /**
   * Standardized console warn for non-fatal issues.
   */
  protected warn(method: string, message: string): void {
    console.warn(`[${this.provider}][STUB] ${method} ⚠ ${message}`)
  }

  /**
   * Check whether a set of required config keys are all non-empty.
   * Returns the first missing key, or null if all are present.
   */
  protected missingRequiredField(...keys: (keyof TConfig)[]): string | null {
    for (const key of keys) {
      const val = this.config[key]
      if (!val || (typeof val === 'string' && val.trim() === '')) {
        return String(key)
      }
    }
    return null
  }

  /**
   * Returns a consistent stub ConnectionTestResult for missing config fields.
   * Saves repetition across provider testConnection() implementations.
   */
  protected missingConfigResult(field: string): ConnectionTestResult {
    return {
      success: false,
      simulated: true,
      message: `Required field "${field}" is not configured.`,
    }
  }

  /**
   * Returns a consistent stub ConnectionTestResult for a successful simulated test.
   */
  protected simulatedSuccessResult(detail?: string): ConnectionTestResult {
    const message = detail
      ? `Connection test simulated successfully. ${detail}`
      : 'Connection test simulated successfully.'
    return { success: true, simulated: true, message }
  }

  /**
   * Helper to build a stub event envelope ID.
   * Replace with crypto.randomBytes in live implementations.
   */
  protected stubEventId(): string {
    return `stub-${this.provider.toLowerCase()}-${Date.now()}`
  }

  /**
   * Returns whether this integration is currently enabled.
   */
  get isEnabled(): boolean {
    return this.integration.isEnabled
  }

  /**
   * Returns the human-readable name label for this integration instance.
   */
  get label(): string {
    return this.integration.name
  }

  /**
   * Returns true if the provider supports the given trigger event.
   * Note: this performs a static registry lookup — useful for guards in dispatch logic.
   */
  supportsTrigger(event: TriggerEvent): boolean {
    // Dynamic import avoided; registry is small enough to inline the lookup
    // Callers should prefer checking INTEGRATION_REGISTRY directly for static analysis
    return true // Stub: always returns true; override or use registry lookup in live phase
  }
}
