/**
 * Salesforce Integration Stub
 *
 * Stub implementation — all methods simulate success and log to console.
 * Replace with real Salesforce REST API calls in a future phase.
 * Docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/
 */

import type { Integration } from '@prisma/client'
import { BaseIntegrationService } from './base'
import type { ConnectionTestResult } from './base'
import type { CallCompletedPayload, QaScoredPayload, AgentFlaggedPayload } from '@/lib/integrations/payloads'

// ─── Provider Config ──────────────────────────────────────────────────────────

interface SalesforceConfig {
  instanceUrl?: string
  clientId?: string
  clientSecret?: string
  username?: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class SalesforceService extends BaseIntegrationService<SalesforceConfig> {
  constructor(integration: Integration) {
    super(integration)
  }

  /**
   * STUB: Create a Task in Salesforce linked to a Contact.
   * Future: POST /services/data/vXX.X/sobjects/Task/
   */
  async createTask(
    payload: CallCompletedPayload,
  ): Promise<{ success: boolean; simulated: boolean; taskId?: string }> {
    this.log('createTask', `instanceUrl=${this.config.instanceUrl}, callId=${payload.callId}`)
    return { success: true, simulated: true, taskId: `stub-task-${Date.now()}` }
  }

  /**
   * STUB: Update a Contact record with call outcome data.
   * Future: PATCH /services/data/vXX.X/sobjects/Contact/:id
   */
  async updateContact(
    payload: CallCompletedPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log('updateContact', `callId=${payload.callId}`)
    return { success: true, simulated: true }
  }

  /**
   * STUB: Log a call activity on an Account or Opportunity.
   * Future: POST /services/data/vXX.X/sobjects/ActivityHistory/
   */
  async logActivity(
    payload: QaScoredPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log('logActivity', `callId=${payload.callId}, qaScore=${payload.qaScore}`)
    return { success: true, simulated: true }
  }

  /**
   * STUB: Flag an agent by creating a custom object record in Salesforce.
   * Future: POST /services/data/vXX.X/sobjects/AgentFlag__c/
   */
  async flagAgent(
    payload: AgentFlaggedPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log('flagAgent', `agentId=${payload.agentId}, reason=${payload.reason}`)
    return { success: true, simulated: true }
  }

  /**
   * STUB: Test connection via Salesforce OAuth token endpoint.
   * Future: POST /services/oauth2/token (client_credentials flow)
   */
  async testConnection(): Promise<ConnectionTestResult> {
    this.log('testConnection', `instanceUrl=${this.config.instanceUrl}`)
    const missing = this.missingRequiredField('instanceUrl', 'clientId')
    if (missing) return this.missingConfigResult(missing)
    return this.simulatedSuccessResult()
  }
}
