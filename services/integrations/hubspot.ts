/**
 * HubSpot Integration Stub
 *
 * Stub implementation — all methods simulate success and log to console.
 * Replace with real HubSpot API calls in a future phase.
 * Docs: https://developers.hubspot.com/docs
 */

import type { Integration } from '@prisma/client'
import { BaseIntegrationService } from './base'
import type { ConnectionTestResult } from './base'
import type { CallCompletedPayload, QaScoredPayload } from '@/lib/integrations/payloads'

// ─── Provider Config ──────────────────────────────────────────────────────────

interface HubSpotConfig {
  privateAppToken?: string
  portalId?: string
  defaultOwnerId?: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class HubSpotService extends BaseIntegrationService<HubSpotConfig> {
  constructor(integration: Integration) {
    super(integration)
  }

  /**
   * STUB: Sync a contact note with call summary to HubSpot.
   * Future: POST /crm/v3/objects/notes
   */
  async syncContact(
    payload: CallCompletedPayload,
  ): Promise<{ success: boolean; simulated: boolean; noteId?: string }> {
    this.log('syncContact', `portalId=${this.config.portalId}, callId=${payload.callId}`)
    // TODO: Implement with HubSpot Private App Token auth
    // const response = await fetch('https://api.hubapi.com/crm/v3/objects/notes', { ... })
    return { success: true, simulated: true, noteId: `stub-note-${Date.now()}` }
  }

  /**
   * STUB: Create a CRM note with QA scoring details.
   * Future: POST /crm/v3/objects/notes with associations
   */
  async createNote(
    payload: QaScoredPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log('createNote', `callId=${payload.callId}, qaScore=${payload.qaScore}`)
    return { success: true, simulated: true }
  }

  /**
   * STUB: Push a full call analysis summary to a contact timeline.
   * Future: POST /crm/v3/objects/notes + associate to contact
   */
  async pushCallSummary(
    payload: CallCompletedPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log('pushCallSummary', `callId=${payload.callId}`)
    return { success: true, simulated: true }
  }

  /**
   * STUB: Test connection by validating the Private App Token.
   * Future: GET /oauth/v1/access-tokens/:token
   */
  async testConnection(): Promise<ConnectionTestResult> {
    this.log('testConnection', `portalId=${this.config.portalId}`)
    const missing = this.missingRequiredField('privateAppToken')
    if (missing) return this.missingConfigResult(missing)
    return this.simulatedSuccessResult()
  }
}
