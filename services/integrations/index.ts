/**
 * Integration Dispatcher — Index
 *
 * Routes incoming events to the correct provider service.
 * This is the single entry point for all integration event dispatching.
 *
 * Usage:
 *   import { dispatchIntegrationEvent } from '@/services/integrations'
 *   await dispatchIntegrationEvent(integration, 'call_completed', { callId, agentName, ... })
 */

import type { Integration } from '@prisma/client'
import type { TriggerEvent } from '@/lib/integrations/registry'
import type {
  CallCompletedPayload,
  QaScoredPayload,
  LowScoreAlertPayload,
  WeeklyReportPayload,
  AgentFlaggedPayload,
  IntegrationEventEnvelope,
  IntegrationPayload,
} from '@/lib/integrations/payloads'

import { HubSpotService } from './hubspot'
import { SalesforceService } from './salesforce'
import { SlackService } from './slack'
import { TeamsService } from './teams'
import { ZapierService } from './zapier'
import { WebhookService } from './webhook'
import crypto from 'crypto'

// Re-export all services for direct use
export { HubSpotService } from './hubspot'
export { SalesforceService } from './salesforce'
export { SlackService } from './slack'
export { TeamsService } from './teams'
export { ZapierService } from './zapier'
export { WebhookService } from './webhook'

/**
 * Loose event data bag accepted by dispatchIntegrationEvent().
 * Maps to the typed payload shapes in @/lib/integrations/payloads.
 * Keeping this as a superset of all payload fields avoids breaking
 * existing call sites while the typed payload adoption proceeds.
 */
export interface EventData {
  callId?: string
  agentName?: string
  agentId?: string
  customerName?: string
  qaScore?: number
  maxScore?: number
  threshold?: number
  gap?: number
  summary?: string
  actionItems?: string[]
  duration?: number
  callTitle?: string
  callUrl?: string
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  weekOf?: string
  weekEnd?: string
  totalCalls?: number
  averageQa?: number
  averageQaScore?: number
  topAgent?: string
  flaggedCount?: number
  reason?: 'LOW_SCORE_STREAK' | 'COMPLIANCE_BREACH' | 'MANUAL'
  reasonDescription?: string
  triggeringCallCount?: number
  averageScore?: number
  flaggedById?: string
  flaggedByName?: string
  filename?: string
  attempts?: number
  errorCode?: string
  reviewerId?: string
  reviewerName?: string
  organizationId: string
}

export interface DispatchResult {
  integrationId: string
  provider: string
  event: TriggerEvent
  success: boolean
  simulated: boolean
  error?: string
}

/**
 * Dispatch an event to a specific integration's provider service.
 * Automatically selects the right service class based on integration.provider.
 */
export async function dispatchIntegrationEvent(
  integration: Integration,
  event: TriggerEvent,
  data: EventData,
): Promise<DispatchResult> {
  const base: Omit<DispatchResult, 'success' | 'simulated' | 'error'> = {
    integrationId: integration.id,
    provider: integration.provider,
    event,
  }

  try {
    switch (integration.provider) {
      case 'HUBSPOT': {
        const svc = new HubSpotService(integration)
        const callPayload: CallCompletedPayload = {
          callId: data.callId ?? '',
          agentName: data.agentName ?? 'Unknown',
          agentId: data.agentId,
          customerName: data.customerName,
          duration: data.duration ?? 0,
          summary: data.summary,
          actionItems: data.actionItems,
          sentiment: data.sentiment,
          callUrl: data.callUrl,
        }
        const qaPayload: QaScoredPayload = {
          callId: data.callId ?? '',
          agentName: data.agentName ?? 'Unknown',
          qaScore: data.qaScore ?? 0,
          maxScore: data.maxScore ?? 100,
          reviewerId: data.reviewerId,
          reviewerName: data.reviewerName,
        }
        if (event === 'call_completed') await svc.syncContact(callPayload)
        else if (event === 'qa_scored') await svc.createNote(qaPayload)
        else await svc.pushCallSummary(callPayload)
        return { ...base, success: true, simulated: true }
      }

      case 'SALESFORCE': {
        const svc = new SalesforceService(integration)
        const callPayload: CallCompletedPayload = {
          callId: data.callId ?? '',
          agentName: data.agentName ?? 'Unknown',
          agentId: data.agentId,
          customerName: data.customerName,
          duration: data.duration ?? 0,
          summary: data.summary,
          actionItems: data.actionItems,
        }
        const qaPayload: QaScoredPayload = {
          callId: data.callId ?? '',
          agentName: data.agentName ?? 'Unknown',
          qaScore: data.qaScore ?? 0,
          maxScore: data.maxScore ?? 100,
        }
        const agentPayload: AgentFlaggedPayload = {
          agentId: data.agentId ?? '',
          agentName: data.agentName ?? 'Unknown',
          reason: data.reason ?? 'MANUAL',
          reasonDescription: data.reasonDescription,
          triggeringCallCount: data.triggeringCallCount ?? 1,
          averageScore: data.averageScore ?? 0,
          flaggedById: data.flaggedById,
          flaggedByName: data.flaggedByName,
        }
        if (event === 'call_completed') await svc.createTask(callPayload)
        else if (event === 'qa_scored') await svc.logActivity(qaPayload)
        else if (event === 'agent_flagged') await svc.flagAgent(agentPayload)
        else await svc.updateContact(callPayload)
        return { ...base, success: true, simulated: true }
      }

      case 'SLACK': {
        const svc = new SlackService(integration)
        if (event === 'low_score_alert') {
          const alertPayload: LowScoreAlertPayload = {
            callId: data.callId ?? '',
            agentName: data.agentName ?? 'Unknown',
            agentId: data.agentId,
            qaScore: data.qaScore ?? 0,
            threshold: data.threshold ?? 70,
            gap: data.gap ?? Math.max(0, (data.threshold ?? 70) - (data.qaScore ?? 0)),
            callUrl: data.callUrl,
          }
          await svc.postQaAlert(alertPayload)
        } else if (event === 'weekly_report') {
          const weeklyPayload: WeeklyReportPayload = {
            weekOf: data.weekOf ?? new Date().toISOString(),
            weekEnd: data.weekEnd ?? new Date().toISOString(),
            totalCalls: data.totalCalls ?? 0,
            averageQaScore: data.averageQa ?? data.averageQaScore ?? 0,
            topAgent: data.topAgent,
            flaggedCount: data.flaggedCount ?? 0,
          }
          await svc.postWeeklyDigest(weeklyPayload)
        } else if (event === 'call_completed') {
          const callPayload: CallCompletedPayload = {
            callId: data.callId ?? '',
            agentName: data.agentName ?? 'Unknown',
            duration: data.duration ?? 0,
          }
          await svc.postCallCompleted(callPayload)
        } else {
          await svc.sendMessage({ text: `Event: ${event} for call ${data.callId}` })
        }
        return { ...base, success: true, simulated: true }
      }

      case 'TEAMS': {
        const svc = new TeamsService(integration)
        if (event === 'low_score_alert') {
          const alertPayload: LowScoreAlertPayload = {
            callId: data.callId ?? '',
            agentName: data.agentName ?? 'Unknown',
            agentId: data.agentId,
            qaScore: data.qaScore ?? 0,
            threshold: data.threshold ?? 70,
            gap: data.gap ?? Math.max(0, (data.threshold ?? 70) - (data.qaScore ?? 0)),
          }
          await svc.postAlert(alertPayload)
        } else if (event === 'call_completed') {
          const callPayload: CallCompletedPayload = {
            callId: data.callId ?? '',
            agentName: data.agentName ?? 'Unknown',
            duration: data.duration ?? 0,
          }
          await svc.postCallCompleted(callPayload)
        } else if (event === 'qa_scored') {
          const qaPayload: QaScoredPayload = {
            callId: data.callId ?? '',
            agentName: data.agentName ?? 'Unknown',
            qaScore: data.qaScore ?? 0,
            maxScore: data.maxScore ?? 100,
          }
          await svc.postQaScored(qaPayload)
        } else if (event === 'weekly_report') {
          const weeklyPayload: WeeklyReportPayload = {
            weekOf: data.weekOf ?? new Date().toISOString(),
            weekEnd: data.weekEnd ?? new Date().toISOString(),
            totalCalls: data.totalCalls ?? 0,
            averageQaScore: data.averageQa ?? data.averageQaScore ?? 0,
            flaggedCount: data.flaggedCount ?? 0,
          }
          await svc.postWeeklyDigest(weeklyPayload)
        } else {
          await svc.sendAdaptiveCard({
            title: `CallPilot: ${event}`,
            summary: data.summary ?? `Event ${event} triggered for call ${data.callId}`,
          })
        }
        return { ...base, success: true, simulated: true }
      }

      case 'ZAPIER': {
        const svc = new ZapierService(integration)
        // Zapier receives the full canonical envelope — it decides how to map fields
        const zapPayload: IntegrationEventEnvelope<IntegrationPayload> = {
          id: crypto.randomBytes(8).toString('hex'),
          event,
          timestamp: new Date().toISOString(),
          organizationId: data.organizationId,
          data: {
            callId: data.callId ?? '',
            agentName: data.agentName ?? 'Unknown',
            agentId: data.agentId,
            customerName: data.customerName,
            qaScore: data.qaScore,
            maxScore: data.maxScore ?? 100,
            summary: data.summary,
            duration: data.duration ?? 0,
          } as unknown as IntegrationPayload,
        }
        await svc.triggerZap(zapPayload)
        return { ...base, success: true, simulated: true }
      }

      case 'WEBHOOK': {
        const svc = new WebhookService(integration)
        const webhookPayload: IntegrationEventEnvelope<Record<string, unknown>> = {
          id: crypto.randomBytes(8).toString('hex'),
          event,
          timestamp: new Date().toISOString(),
          organizationId: data.organizationId,
          // Spread full event data into the payload — webhook consumers get everything
          data: data as unknown as Record<string, unknown>,
        }
        await svc.dispatch(webhookPayload as unknown as Parameters<typeof svc.dispatch>[0])
        return { ...base, success: true, simulated: true }
      }

      default:
        return { ...base, success: false, simulated: false, error: `Unknown provider: ${integration.provider}` }
    }
  } catch (err) {
    return {
      ...base,
      success: false,
      simulated: false,
      error: (err as Error).message || 'Dispatch error',
    }
  }
}

/**
 * Test a single integration's connection using its service's testConnection() method.
 */
export async function testIntegrationConnection(
  integration: Integration,
): Promise<{ success: boolean; simulated: boolean; message: string }> {
  switch (integration.provider) {
    case 'HUBSPOT':     return new HubSpotService(integration).testConnection()
    case 'SALESFORCE':  return new SalesforceService(integration).testConnection()
    case 'SLACK':       return new SlackService(integration).testConnection()
    case 'TEAMS':       return new TeamsService(integration).testConnection()
    case 'ZAPIER':      return new ZapierService(integration).testConnection()
    case 'WEBHOOK':     return new WebhookService(integration).testConnection()
    default:            return { success: false, simulated: false, message: `Unknown provider: ${integration.provider}` }
  }
}
