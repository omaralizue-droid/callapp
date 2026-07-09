/**
 * Generic Webhook Integration Stub
 *
 * Dispatches typed event payloads to any user-configured HTTPS endpoint.
 * Supports HMAC-SHA256 request signing via X-CallPilot-Signature header.
 * Replace the stub dispatch with real fetch() in a future phase.
 * Docs: https://docs.callpilot.ai/webhooks
 */

import type { Integration } from '@prisma/client'
import crypto from 'crypto'
import { BaseIntegrationService } from './base'
import type { ConnectionTestResult } from './base'
import type { IntegrationEventEnvelope, IntegrationPayload } from '@/lib/integrations/payloads'

// ─── Provider Config ──────────────────────────────────────────────────────────

interface WebhookConfig {
  url?: string
  signingSecret?: string
  events?: string
}

// ─── Webhook-specific Envelope ────────────────────────────────────────────────

/**
 * The exact JSON body dispatched to the customer's endpoint.
 * Wraps any typed event payload in the canonical envelope.
 */
export type WebhookEventPayload = IntegrationEventEnvelope<IntegrationPayload | Record<string, unknown>>

// ─── Service ──────────────────────────────────────────────────────────────────

export class WebhookService extends BaseIntegrationService<WebhookConfig> {
  constructor(integration: Integration) {
    super(integration)
  }

  /**
   * Signs a payload with HMAC-SHA256 using the configured signing secret.
   * Future: Include as `X-CallPilot-Signature: sha256=<digest>` header.
   */
  private signPayload(body: string): string | undefined {
    if (!this.config.signingSecret) return undefined
    return 'sha256=' + crypto
      .createHmac('sha256', this.config.signingSecret)
      .update(body)
      .digest('hex')
  }

  /**
   * STUB: Dispatch a typed event payload to the configured endpoint.
   *
   * In a real implementation:
   *   const body = JSON.stringify(payload)
   *   const signature = this.signPayload(body)
   *   const response = await fetch(this.config.url!, {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'X-CallPilot-Event': payload.event,
   *       'X-CallPilot-Signature': signature ?? '',
   *       'X-CallPilot-Delivery': payload.id,
   *     },
   *     body,
   *     signal: AbortSignal.timeout(10_000),  // 10-second deadline
   *   })
   *   if (!response.ok) throw new DeliveryError('WEBHOOK', response.status, await response.text())
   */
  async dispatch(
    payload: WebhookEventPayload,
  ): Promise<{ success: boolean; simulated: boolean; eventId: string; signature?: string }> {
    const body = JSON.stringify(payload)
    const signature = this.signPayload(body)

    this.log('dispatch', `url=${this.config.url}, event="${payload.event}", id=${payload.id}`)
    if (signature) {
      this.log('dispatch', `X-CallPilot-Signature: ${signature}`)
    }

    return { success: true, simulated: true, eventId: payload.id, signature }
  }

  /**
   * STUB: Verify an incoming webhook signature.
   * Useful when CallPilot receives responses from the endpoint.
   * Uses timing-safe comparison to prevent timing attacks.
   */
  verifySignature(body: string, receivedSignature: string): boolean {
    const expected = this.signPayload(body)
    if (!expected) return true // No secret configured — skip verification
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(receivedSignature),
      )
    } catch {
      return false
    }
  }

  /**
   * STUB: Test connection by dispatching a ping event to the endpoint.
   * Future: POST minimal ping payload and expect HTTP 2xx within 10s
   */
  async testConnection(): Promise<ConnectionTestResult> {
    this.log('testConnection', `url=${this.config.url}`)
    const missing = this.missingRequiredField('url')
    if (missing) return this.missingConfigResult(missing)

    const pingPayload: WebhookEventPayload = {
      id: crypto.randomBytes(8).toString('hex'),
      event: 'call_completed', // Use a valid TriggerEvent for the ping
      timestamp: new Date().toISOString(),
      organizationId: this.integration.organizationId,
      data: { message: 'CallPilot webhook connection test' } as unknown as IntegrationPayload,
    }

    const result = await this.dispatch(pingPayload)
    return {
      success: result.success,
      simulated: result.simulated,
      message: 'Ping event dispatched successfully (simulated).',
    }
  }
}
