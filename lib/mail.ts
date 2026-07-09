import type { OrgBranding } from '@/lib/branding'
import { effectiveBrandName, effectiveEmailFromName } from '@/lib/branding'

/**
 * Sends a branded notification email.
 *
 * Accepts optional OrgBranding to replace CallPilot defaults with the
 * organization's custom brand name, from-name, and footer text.
 *
 * STUB: logs to console. Replace with Resend / Nodemailer / SendGrid in production.
 */
export function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  branding?: OrgBranding | null,
) {
  const fromName   = branding ? effectiveEmailFromName(branding) : 'CallPilot Support'
  const brandName  = branding ? effectiveBrandName(branding)     : 'CallPilot.AI'
  const footerText = branding?.emailFooterText?.trim()
    ? branding.emailFooterText.trim()
    : `Thanks,\n${fromName}`

  console.info(`
=========================================
[SMTP Mailer] SENDING NOTIFICATION EMAIL
To:      ${to}
From:    ${fromName}
Subject: ${brandName} Notification - ${title}
Body:
Dear User,

You have received a new notification on ${brandName}:
${message}

${footerText}
=========================================
  `.trim())
}
