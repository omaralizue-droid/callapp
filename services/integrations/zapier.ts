/**
 * Zapier Integration Stub
 *
 * Stub implementation — triggerZap simulates an HTTP POST to a Zapier Catch Hook.
 * Replace with real fetch() call in a future phase.
 * Docs: https://zapier.com/apps/webhook/integrations
 */

import type { Integration } from '@prisma/client'
import crypto from 'crypto'
import { BaseIntegrationService } from './base'
import type { ConnectionTestResult } from './base'
import type { IntegrationEventEnvelope, IntegrationPayload } from '@/lib/integrations/payloads'

// ─── Provider Config ──────────────────────────────────────────────────────────

interface ZapierConfig {
  catchHookUrl?: string
  secretKey?: string
}

// ─── Zapier-specific Envelope ─────────────────────────────────────────────────

/**
 * The exact JSON payload shape sent to a Zapier Catch Hook.
 * Zapier expects a flat or nested JSON object — we wrap our canonical envelope.
 */
export type ZapierEventPayload = IntegrationEventEnvelope<IntegrationPayload>

// ─── Service ──────────────────────────────────────────────────────────────────

export class ZapierService extends BaseIntegrationService<ZapierConfig> {
  constructor(integration: Integration) {
    super(integration)
  }

  /**
   * Computes an HMAC-SHA256 signature over the raw JSON body string.
   * Future: include as `X-Signature-SHA256: <hex>` header on each request.
   */
  private signPayload(body: string): string | undefined {
    if (!this.config.secretKey) return undefined
    return crypto
      .createHmac('sha256', this.config.secretKey)
      .update(body)
      .digest('hex')
  }

  /**
   * STUB: Trigger a Zap by posting an event payload to the Catch Hook URL.
   *
   * In a real implementation:
   *   const body = JSON.stringify(payload)
   *   const signature = this.signPayload(body)
   *   const response = await fetch(this.config.catchHookUrl!, {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'X-Signature-SHA256': signature ?? '',
   *     },
   *     body,
   *   })
   *   if (!response.ok) throw new DeliveryError('ZAPIER', response.status, await response.text())
   */
  async triggerZap(
    payload: ZapierEventPayload,
  ): Promise<{ success: boolean; simulated: boolean; requestId?: string }> {
    const requestId = crypto.randomBytes(8).toString('hex')
    const body = JSON.stringify(payload)
    const signature = this.signPayload(body)

    this.log(
      'triggerZap',
      `event="${payload.event}", hookUrl=${this.config.catchHookUrl?.slice(0, 60)}...`,
    )
    if (signature) {
      this.log('triggerZap', `X-Signature-SHA256: ${signature}`)
    }

    return { success: true, simulated: true, requestId }
  }

  /**
   * STUB: Test connection by sending a test event to the Catch Hook.
   * Future: POST a minimal ping payload and check for HTTP 200
   */
  async testConnection(): Promise<ConnectionTestResult> {
    this.log('testConnection', `hookUrl=${this.config.catchHookUrl?.slice(0, 60)}`)
    const missing = this.missingRequiredField('catchHookUrl')
    if (missing) return this.missingConfigResult(missing)
    return this.simulatedSuccessResult('Test Zap triggered (simulated).')
  }
}
