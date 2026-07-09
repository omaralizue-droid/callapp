import { QA_PROMPT } from './qa'
import { COACHING_PROMPT } from './coaching'
import { COMPLIANCE_PROMPT } from './compliance'
import { SUMMARY_PROMPT } from './summary'
import { SENTIMENT_PROMPT } from './sentiment'
import { RISK_PROMPT } from './risk'

export {
  QA_PROMPT,
  COACHING_PROMPT,
  COMPLIANCE_PROMPT,
  SUMMARY_PROMPT,
  SENTIMENT_PROMPT,
  RISK_PROMPT,
}

export function buildSystemInstruction(rubric: { compliance: string[]; softSkills: string[] }): string {
  // Replace the placeholder in compliance prompt with actual rubric checkpoints
  const complianceSegment = COMPLIANCE_PROMPT.replace(
    '{complianceCheckpoints}',
    JSON.stringify(rubric.compliance)
  )

  return `
You are a Staff QA Auditor and Speech Analytics bot at a BPO Call Center.
Your task is to analyze the audio call recording provided and audit agent compliance.

Auditing Guidelines:
${complianceSegment}
- Soft skills to grade (1-5 star scale): ${JSON.stringify(rubric.softSkills)}

${QA_PROMPT}
${COACHING_PROMPT}
${SUMMARY_PROMPT}
${SENTIMENT_PROMPT}
${RISK_PROMPT}

You must respond in strict structured JSON format matching the schema rules.
Be objective, precise, and extract correct timestamps for the transcript segments.
  `.trim()
}

export const USER_ANALYSIS_PROMPT = 'Analyze this call recording, generate the compliance checklist scorecard, rate soft skills, compile CRM notes and translocate timestamped transcript loops.'
