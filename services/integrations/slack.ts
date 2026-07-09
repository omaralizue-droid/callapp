/**
 * Slack Integration Stub
 *
 * Stub implementation — all methods simulate success and log to console.
 * Replace with real Slack Web API calls in a future phase.
 * Docs: https://api.slack.com/methods/chat.postMessage
 */

import type { Integration } from '@prisma/client'
import { BaseIntegrationService } from './base'
import type { ConnectionTestResult } from './base'
import type {
  CallCompletedPayload,
  LowScoreAlertPayload,
  WeeklyReportPayload,
  UploadFailedPayload,
} from '@/lib/integrations/payloads'

// ─── Provider Config ──────────────────────────────────────────────────────────

interface SlackConfig {
  botToken?: string
  defaultChannelId?: string
  alertChannelId?: string
}

// ─── Internal Message Shapes ──────────────────────────────────────────────────

interface RawMessagePayload {
  channelId?: string
  text: string
  /** Block Kit blocks array — typed as unknown[] to avoid @slack/types dependency */
  blocks?: unknown[]
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class SlackService extends BaseIntegrationService<SlackConfig> {
  constructor(integration: Integration) {
    super(integration)
  }

  /**
   * STUB: Send a plain or Block Kit message to a Slack channel.
   * Future: POST https://slack.com/api/chat.postMessage
   */
  async sendMessage(
    payload: RawMessagePayload,
  ): Promise<{ success: boolean; simulated: boolean; ts?: string }> {
    const channel = payload.channelId ?? this.config.defaultChannelId
    this.log('sendMessage', `channel=${channel}, text="${payload.text.slice(0, 80)}..."`)
    return { success: true, simulated: true, ts: `${Date.now()}.000100` }
  }

  /**
   * STUB: Post a QA alert when a score falls below the threshold.
   * Future: Uses Block Kit attachment with color-coded severity
   */
  async postQaAlert(
    payload: LowScoreAlertPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    const channel = this.config.alertChannelId ?? this.config.defaultChannelId
    this.log(
      'postQaAlert',
      `channel=${channel}, agent=${payload.agentName}, score=${payload.qaScore}, threshold=${payload.threshold}`,
    )
    return { success: true, simulated: true }
  }

  /**
   * STUB: Post a weekly performance digest with summary stats.
   * Future: Rich Block Kit layout with charts and agent leaderboard
   */
  async postWeeklyDigest(
    payload: WeeklyReportPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log(
      'postWeeklyDigest',
      `weekOf=${payload.weekOf}, totalCalls=${payload.totalCalls}, avgQa=${payload.averageQaScore}`,
    )
    return { success: true, simulated: true }
  }

  /**
   * STUB: Post an upload-failed alert to the alert channel.
   * Future: Block Kit message with filename, reason, and retry CTA
   */
  async postUploadFailedAlert(
    payload: UploadFailedPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    const channel = this.config.alertChannelId ?? this.config.defaultChannelId
    this.log(
      'postUploadFailedAlert',
      `channel=${channel}, file=${payload.filename}, reason=${payload.reason}`,
    )
    return { success: true, simulated: true }
  }

  /**
   * STUB: Post a call-completed notification (configurable channel).
   * Future: Block Kit summary with transcript link and QA score teaser
   */
  async postCallCompleted(
    payload: CallCompletedPayload,
  ): Promise<{ success: boolean; simulated: boolean }> {
    this.log(
      'postCallCompleted',
      `callId=${payload.callId}, agent=${payload.agentName}`,
    )
    return { success: true, simulated: true }
  }

  /**
   * STUB: Test connection by validating the Bot Token.
   * Future: GET https://slack.com/api/auth.test
   */
  async testConnection(): Promise<ConnectionTestResult> {
    this.log('testConnection', `channelId=${this.config.defaultChannelId}`)
    const missing = this.missingRequiredField('botToken', 'defaultChannelId')
    if (missing) return this.missingConfigResult(missing)
    return this.simulatedSuccessResult()
  }
}
