/**
 * Microsoft Teams Integration Stub
 *
 * Stub implementation — all methods simulate success and log to console.
 * Replace with real Teams Incoming Webhook or Graph API calls in a future phase.
 * Docs: https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook
 */

import type { Integration } from '@prisma/client'
import { BaseIntegrationService } from './base'
import type { ConnectionTestResult } from './base'
import type {
  CallCompletedPayload,
  QaScoredPayload,
  LowScoreAlertPayload,
  WeeklyReportPayload,
} from '@/lib/integrations/payloads'

// ─── Provider Config ──────────────────────────────────────────────────────────

interface TeamsConfig {
  incomingWebhookUrl?: string
  tenantId?: string
}

// ─── Internal Card Shape ──────────────────────────────────────────────────────

/**
 * Simplified Adaptive Card payload shape.
 * Future: replace with @microsoft/adaptivecards types.
 */
interface AdaptiveCardPayload {
  title: string
  summary: string
  facts?: { name: string; value: string }[]
  actions?: { type: string; title: string; url: string }[]
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class TeamsService extends BaseIntegrationService<TeamsConfig> {
  constructor(integration: Integration) {
    super(integration)
  }

  /**
   * STUB: Send an Adaptive Card to the configured Teams channel.
   * Future: POST to incomingWebhookUrl with MessageCard/AdaptiveCard payload
   */
  async sendAdaptiveCard(
    payload: AdaptiveCardPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log(
      'sendAdaptiveCard',
      `title="${payload.title}", webhookUrl=${this.config.incomingWebhookUrl?.slice(0, 60)}...`,
    )
    return { success: true, simulated: true }
  }

  /**
   * STUB: Post a QA alert card when a score falls below the threshold.
   * Future: MessageCard with red accent color and action buttons
   */
  async postAlert(
    payload: LowScoreAlertPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log(
      'postAlert',
      `agent=${payload.agentName}, score=${payload.qaScore}, threshold=${payload.threshold}`,
    )
    return { success: true, simulated: true }
  }

  /**
   * STUB: Post a call-completed summary card.
   * Future: AdaptiveCard with call details, summary, and action items list
   */
  async postCallCompleted(
    payload: CallCompletedPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log('postCallCompleted', `callId=${payload.callId}, agent=${payload.agentName}`)
    return { success: true, simulated: true }
  }

  /**
   * STUB: Post a QA scored notification card.
   * Future: AdaptiveCard with score bar, reviewer, and per-section breakdown
   */
  async postQaScored(
    payload: QaScoredPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log('postQaScored', `callId=${payload.callId}, score=${payload.qaScore}/${payload.maxScore}`)
    return { success: true, simulated: true }
  }

  /**
   * STUB: Post a weekly digest summary card.
   * Future: AdaptiveCard with KPI table and leaderboard
   */
  async postWeeklyDigest(
    payload: WeeklyReportPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log(
      'postWeeklyDigest',
      `weekOf=${payload.weekOf}, totalCalls=${payload.totalCalls}`,
    )
    return { success: true, simulated: true }
  }

  /**
   * STUB: Test connection by posting a test card to the webhook.
   * Future: POST minimal AdaptiveCard to incomingWebhookUrl, expect HTTP 200
   */
  async testConnection(): Promise<ConnectionTestResult> {
    this.log('testConnection', `incomingWebhookUrl=${this.config.incomingWebhookUrl?.slice(0, 60)}`)
    const missing = this.missingRequiredField('incomingWebhookUrl')
    if (missing) return this.missingConfigResult(missing)
    return this.simulatedSuccessResult()
  }
}
