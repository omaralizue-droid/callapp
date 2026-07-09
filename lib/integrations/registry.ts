/**
 * Integration Registry
 *
 * Centralized definitions for all supported integration providers.
 * Each entry describes display metadata, required config fields,
 * supported trigger events, and available actions.
 *
 * This registry drives the UI dynamically — no hardcoded forms per provider.
 */

export type IntegrationProvider =
  | 'HUBSPOT'
  | 'SALESFORCE'
  | 'SLACK'
  | 'TEAMS'
  | 'ZAPIER'
  | 'WEBHOOK'

export type IntegrationStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'ERROR'
  | 'PENDING'

export type TriggerEvent =
  | 'call_completed'
  | 'qa_scored'
  | 'low_score_alert'
  | 'upload_failed'
  | 'weekly_report'
  | 'agent_flagged'

export type ConfigFieldType = 'text' | 'password' | 'url' | 'email' | 'select' | 'toggle'

export interface ConfigField {
  key: string
  label: string
  type: ConfigFieldType
  placeholder?: string
  required: boolean
  hint?: string
  options?: { value: string; label: string }[] // for 'select' type
}

export interface IntegrationDefinition {
  provider: IntegrationProvider
  name: string
  description: string
  longDescription: string
  category: 'CRM' | 'MESSAGING' | 'AUTOMATION' | 'WEBHOOK'
  iconName: string               // Lucide icon name or custom identifier
  iconBg: string                 // Tailwind gradient classes
  docsUrl: string
  configFields: ConfigField[]    // Fields shown in the config drawer
  supportedTriggers: TriggerEvent[]
  badge?: string                 // e.g. "Popular", "Beta"
}

// ─── Provider Definitions ────────────────────────────────────────────────────

export const INTEGRATION_REGISTRY: IntegrationDefinition[] = [
  {
    provider: 'HUBSPOT',
    name: 'HubSpot',
    description: 'Sync call summaries and QA results to HubSpot contacts and deals.',
    longDescription:
      'Automatically push call notes, QA scores, and coaching summaries to HubSpot CRM. Create notes on contact timelines, update deal stages, and trigger HubSpot workflows based on call outcomes.',
    category: 'CRM',
    iconName: 'hubspot',
    iconBg: 'from-orange-500 to-amber-500',
    docsUrl: 'https://developers.hubspot.com/docs',
    badge: 'Popular',
    configFields: [
      {
        key: 'privateAppToken',
        label: 'Private App Token',
        type: 'password',
        placeholder: 'pat-na1-xxxx-xxxx-xxxx',
        required: true,
        hint: 'Create a Private App in HubSpot Settings → Integrations → Private Apps',
      },
      {
        key: 'portalId',
        label: 'Portal ID',
        type: 'text',
        placeholder: '12345678',
        required: true,
        hint: 'Found in HubSpot Settings → Account Setup → Account Info',
      },
      {
        key: 'defaultOwnerId',
        label: 'Default Owner ID (optional)',
        type: 'text',
        placeholder: '9876543',
        required: false,
        hint: 'HubSpot User ID to assign as note owner if no match found',
      },
    ],
    supportedTriggers: ['call_completed', 'qa_scored', 'low_score_alert'],
  },

  {
    provider: 'SALESFORCE',
    name: 'Salesforce',
    description: 'Log call activities and QA reports directly into Salesforce records.',
    longDescription:
      'Push call analysis, action items, and QA scores to Salesforce as Activities, Tasks, or custom objects. Update Contact and Account records automatically after every call.',
    category: 'CRM',
    iconName: 'salesforce',
    iconBg: 'from-blue-500 to-sky-600',
    docsUrl: 'https://developer.salesforce.com/docs',
    badge: 'Popular',
    configFields: [
      {
        key: 'instanceUrl',
        label: 'Salesforce Instance URL',
        type: 'url',
        placeholder: 'https://yourorg.my.salesforce.com',
        required: true,
        hint: 'Your Salesforce org login URL',
      },
      {
        key: 'clientId',
        label: 'Connected App Client ID',
        type: 'text',
        placeholder: '3MVG9...',
        required: true,
        hint: 'From your Connected App settings in Salesforce Setup',
      },
      {
        key: 'clientSecret',
        label: 'Connected App Client Secret',
        type: 'password',
        placeholder: 'Your client secret',
        required: true,
      },
      {
        key: 'username',
        label: 'API Username',
        type: 'email',
        placeholder: 'api-user@yourorg.com',
        required: true,
      },
    ],
    supportedTriggers: ['call_completed', 'qa_scored', 'low_score_alert', 'agent_flagged'],
  },

  {
    provider: 'SLACK',
    name: 'Slack',
    description: 'Send QA alerts, coaching tips, and weekly digests to Slack channels.',
    longDescription:
      'Post real-time QA alerts when scores drop below thresholds, send coaching summaries to manager channels, and deliver weekly performance digests directly to Slack.',
    category: 'MESSAGING',
    iconName: 'slack',
    iconBg: 'from-violet-500 to-purple-600',
    docsUrl: 'https://api.slack.com/',
    badge: 'Popular',
    configFields: [
      {
        key: 'botToken',
        label: 'Bot OAuth Token',
        type: 'password',
        placeholder: 'xoxb-xxxx-xxxx-xxxx',
        required: true,
        hint: 'Create a Slack App and install it to your workspace to get a Bot Token',
      },
      {
        key: 'defaultChannelId',
        label: 'Default Channel ID',
        type: 'text',
        placeholder: 'C0XXXXXXXXX',
        required: true,
        hint: 'Right-click any channel → View channel details → Channel ID at the bottom',
      },
      {
        key: 'alertChannelId',
        label: 'Alert Channel ID (optional)',
        type: 'text',
        placeholder: 'C0XXXXXXXXX',
        required: false,
        hint: 'Separate channel for low-score and compliance alerts',
      },
    ],
    supportedTriggers: ['call_completed', 'qa_scored', 'low_score_alert', 'upload_failed', 'weekly_report'],
  },

  {
    provider: 'TEAMS',
    name: 'Microsoft Teams',
    description: 'Post call insights and QA summaries to Teams channels via Adaptive Cards.',
    longDescription:
      'Send rich Adaptive Card notifications to Microsoft Teams channels when calls complete, QA scores are submitted, or compliance alerts fire. Supports Incoming Webhooks and Bot Framework.',
    category: 'MESSAGING',
    iconName: 'teams',
    iconBg: 'from-indigo-500 to-blue-600',
    docsUrl: 'https://docs.microsoft.com/en-us/microsoftteams/platform/',
    configFields: [
      {
        key: 'incomingWebhookUrl',
        label: 'Incoming Webhook URL',
        type: 'url',
        placeholder: 'https://yourorg.webhook.office.com/webhookb2/...',
        required: true,
        hint: 'Create an Incoming Webhook connector in the target Teams channel',
      },
      {
        key: 'tenantId',
        label: 'Azure Tenant ID (optional)',
        type: 'text',
        placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        required: false,
        hint: 'Required only if using Bot Framework authentication',
      },
    ],
    supportedTriggers: ['call_completed', 'qa_scored', 'low_score_alert', 'weekly_report'],
  },

  {
    provider: 'ZAPIER',
    name: 'Zapier',
    description: 'Trigger Zaps from call events and connect to 7,000+ apps via Zapier.',
    longDescription:
      'Emit structured webhook payloads to Zapier Catch Hooks when calls complete, QA scores are submitted, or alerts fire. Use Zapier to route data to any of 7,000+ connected apps without code.',
    category: 'AUTOMATION',
    iconName: 'zapier',
    iconBg: 'from-orange-500 to-red-500',
    docsUrl: 'https://zapier.com/apps/webhook/integrations',
    configFields: [
      {
        key: 'catchHookUrl',
        label: 'Zapier Catch Hook URL',
        type: 'url',
        placeholder: 'https://hooks.zapier.com/hooks/catch/xxxxxxx/xxxxxxx/',
        required: true,
        hint: 'Create a "Webhooks by Zapier" trigger in your Zap and paste the Catch Hook URL here',
      },
      {
        key: 'secretKey',
        label: 'Shared Secret (optional)',
        type: 'password',
        placeholder: 'Used to sign payloads for verification',
        required: false,
        hint: 'If set, each payload will include an X-Signature-SHA256 header',
      },
    ],
    supportedTriggers: ['call_completed', 'qa_scored', 'low_score_alert', 'upload_failed', 'weekly_report', 'agent_flagged'],
  },

  {
    provider: 'WEBHOOK',
    name: 'Custom Webhook',
    description: 'Send structured JSON payloads to any HTTP endpoint on call events.',
    longDescription:
      'Configure a custom HTTPS endpoint to receive real-time event payloads from CallPilot. All payloads are signed with HMAC-SHA256 for verification. Supports retry logic with exponential backoff.',
    category: 'WEBHOOK',
    iconName: 'webhook',
    iconBg: 'from-cyan-500 to-teal-500',
    docsUrl: 'https://docs.callpilot.ai/webhooks',
    configFields: [
      {
        key: 'url',
        label: 'Endpoint URL',
        type: 'url',
        placeholder: 'https://api.yourapp.com/webhooks/callpilot',
        required: true,
        hint: 'Must be HTTPS. Endpoint should return HTTP 2xx within 10 seconds',
      },
      {
        key: 'signingSecret',
        label: 'Signing Secret',
        type: 'password',
        placeholder: 'whsec_xxxxxxxxxxxxxxxx',
        required: false,
        hint: 'Used to generate X-CallPilot-Signature header on every request',
      },
      {
        key: 'events',
        label: 'Subscribed Events',
        type: 'select',
        required: false,
        options: [
          { value: 'all', label: 'All Events' },
          { value: 'call_completed', label: 'Call Completed' },
          { value: 'qa_scored', label: 'QA Scored' },
          { value: 'low_score_alert', label: 'Low Score Alert' },
          { value: 'weekly_report', label: 'Weekly Report' },
        ],
      },
    ],
    supportedTriggers: ['call_completed', 'qa_scored', 'low_score_alert', 'upload_failed', 'weekly_report', 'agent_flagged'],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getIntegrationDef(provider: IntegrationProvider): IntegrationDefinition {
  const def = INTEGRATION_REGISTRY.find(d => d.provider === provider)
  if (!def) throw new Error(`Unknown integration provider: ${provider}`)
  return def
}

export function getProvidersByCategory(category: IntegrationDefinition['category']): IntegrationDefinition[] {
  return INTEGRATION_REGISTRY.filter(d => d.category === category)
}

export const TRIGGER_LABELS: Record<TriggerEvent, string> = {
  call_completed:  'Call Completed',
  qa_scored:       'QA Score Submitted',
  low_score_alert: 'Low QA Score Alert',
  upload_failed:   'Upload Failed',
  weekly_report:   'Weekly Report',
  agent_flagged:   'Agent Flagged',
}
