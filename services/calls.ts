import prisma from '@/lib/db'
import { Role } from '@/types/index'
import { CallRecord, Sentiment, CallStatus, TranscriptSegment, QAChecklist, AICoachReport } from '@/types/calls'

// High-fidelity fallback seed data for demonstration
export const MOCK_CALLS: CallRecord[] = [
  {
    id: 'call-1',
    title: 'Subscription Cancel Dispute',
    filename: 'cancel_dispute_cust_928.wav',
    fileUrl: '/mock-audio/dispute.mp3',
    duration: 182, // 3m 2s
    fileSize: 4500000,
    status: 'COMPLETED',
    customerId: 'CUST-9281',
    customerName: 'Marcus Vance',
    agentId: 'agent-1',
    teamId: 'team-1',
    organizationId: 'org-1',
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 4),
    agent: {
      id: 'agent-1',
      email: 'alex.r@company.com',
      supabaseId: 'sb-1',
      firstName: 'Alex',
      lastName: 'Rodriguez',
      avatarUrl: null,
      role: 'AGENT',
      organizationId: 'org-1',
      teamId: 'team-1',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    analysis: {
      id: 'analysis-1',
      callId: 'call-1',
      summary: 'Customer called demanding immediate cancellation and a full refund for an annual plan, claiming they were unaware of auto-renew. The agent successfully explained the terms, offered a 25% discount, and retained the client with an upgraded support tier.',
      sentimentOverall: 'POSITIVE',
      sentimentScore: 0.65,
      coachingTips: [
        'Great active listening during the customer frustration stage.',
        'Clear, calm tone used when addressing billing terms.',
        'Ensure you explicitly mention that discounts invalidate future refunds.',
      ],
      strengths: ['Customer empathy', 'Retention tactics', 'Calm voice control'],
      improvements: ['Stating terms clearly earlier', 'Confirming billing address'],
      transcript: [
        { speaker: 'Agent', start: 0, end: 4, text: 'Thank you for calling support. My name is Alex. This call may be recorded for quality. How can I help you?', sentiment: 'neutral', emotion: 'Neutral', turningPoint: false },
        { speaker: 'Customer', start: 4, end: 15, text: 'Yeah, hi. I see a charge on my credit card for $499. I did not authorize this renew. I want this canceled and refunded immediately.', sentiment: 'negative', emotion: 'Angry', turningPoint: false },
        { speaker: 'Agent', start: 16, end: 24, text: 'I understand how unexpected charges can be alarming, Marcus. Let me look into this subscription renewal right away. Do not worry, we will resolve this.', sentiment: 'positive', emotion: 'Neutral', turningPoint: false },
        { speaker: 'Customer', start: 24, end: 32, text: 'Well, it should be resolved because I was never notified about it. I want a refund now.', sentiment: 'negative', emotion: 'Frustrated', turningPoint: false },
        { speaker: 'Agent', start: 33, end: 46, text: 'I see that this was an annual contract renewal. However, I want to make sure you are taken care of. I can offer a 25% loyalty discount on this plan, lowering the bill to $374, plus add dedicated BPO support.', sentiment: 'positive', emotion: 'Neutral', turningPoint: true },
        { speaker: 'Customer', start: 46, end: 54, text: 'Hmm. Dedicated support is something we needed. So it will be $374 instead of $499?', sentiment: 'neutral', emotion: 'Confused', turningPoint: false },
        { speaker: 'Agent', start: 54, end: 60, text: 'Correct, and the dedicated manager will help optimize your outbound calls. Shall I apply this discount and adjust the terms?', sentiment: 'positive', emotion: 'Neutral', turningPoint: false },
        { speaker: 'Customer', start: 60, end: 65, text: 'Yes, that works. Thank you for making this adjust.', sentiment: 'positive', emotion: 'Happy', turningPoint: false },
      ],
      aiCoachReport: {
        detections: {
          interruptionsCount: 1,
          longSilencesCount: 1,
          wrongToneCount: 0,
          missedScriptCount: 0,
          missedComplianceCount: 0,
          details: [
            { type: 'interruption', timestamp: '0:16', seconds: 16, description: 'Agent Alex Rodriguez began speaking while customer Marcus was detailing credit card charge details.' },
            { type: 'silence', timestamp: '0:33', seconds: 33, description: 'Silent pause of 4.8 seconds during database contract lookups without status narration.' }
          ]
        },
        insights: [
          {
            id: 'ins-1',
            timestamp: '0:16',
            seconds: 16,
            originalTurn: 'I understand how unexpected charges can be alarming, Marcus. Let me look into this subscription renewal right away...',
            coachingAdvice: 'Wait for the caller to finish speaking their request before offering technical reassurances. Talking over frustrated callers can heighten irritation.',
            betterResponse: 'I understand that an unexpected renewal charge of $499 can be surprising. Let me pull up your account contract terms immediately so we can review the renew date.',
            rationale: 'Active listening requires giving the customer full speaking space, creating trust and calming compliance dispute dialogue.'
          }
        ]
      },
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    qaReports: [
      {
        id: 'qa-1',
        callId: 'call-1',
        reviewerId: 'rev-1',
        score: 94,
        checklist: {
          greeting: { score: 95, explanation: 'Alex Rodriguez introduced himself and stated recording disclosure within first 5 seconds.' },
          verification: { score: 100, explanation: 'Customer Marcus Vance verified full name and PIN code securely.' },
          compliance: { score: 100, explanation: 'Explicit recording disclosure and policy statements followed rules.' },
          empathy: { score: 90, explanation: 'Agent acknowledged initial frustration with auto-renew quickly.' },
          listening: { score: 95, explanation: 'Alex did not interrupt customer, allowing them to explain frustration.' },
          problemSolving: { score: 95, explanation: 'Offered win-win loyalty discount package retaining customer.' },
          closing: { score: 90, explanation: 'Re-stated terms, confirmed refund parameters and closed call politely.' },
          professionalism: { score: 95, explanation: 'Courteous voice control, empathetic demeanor, and helpful stance.' },
          mistakes: [
            'Agent initially forgot to mention that discounts invalidate other refund policies.',
          ],
          improvements: [
            'Include the refund timeline terms disclosure slightly earlier in transaction.',
          ],
        },
        feedback: 'Excellent call resolution. Retention approach was polite and compliant. Keep up the high standard.',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    crmNote: {
      id: 'crm-1',
      callId: 'call-1',
      summary: 'Marcus Vance called regarding annual auto-renewal charge of $499. Requested cancellation and refund. Agent negotiated a 25% discount ($374 final bill) and added priority BPO support. Customer accepted terms and agreed to continue subscription.',
      keyPoints: [
        'Customer disputed $499 renewal charge.',
        'Agent explained subscription annual renewal structure.',
        'Loyalty discount of 25% applied.',
        'Priority support package attached.',
      ],
      actionItems: [
        'Apply $125 credit to invoice billing profile.',
        'Flag account as Priority BPO Tier in Salesforce.',
        'Assign Account Manager.',
      ],
      customerName: 'Marcus Vance',
      agentName: 'Alex Rodriguez',
      callPurpose: 'Billing dispute and cancellation request for annual subscription.',
      issue: 'Annual renewal billing charge of $499 auto-renewed without notice.',
      resolution: 'Applied 25% discount, reduced bill to $374, and upgraded account to Priority support tier.',
      followUp: 'Verify billing ledger credit and confirm Dedicated Manager assignment.',
      productsMentioned: ['Annual Platform subscription Plan', 'Priority Support tier Upgrade'],
      callDuration: 182,
      importantNotes: 'Client accepted loyalty package instead of cancellation. Marked key account flag.',
      exported: false,
      exportedAt: null,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 'call-2',
    title: 'Payment Processing Failure',
    filename: 'billing_failure_988.wav',
    fileUrl: '/mock-audio/billing.mp3',
    duration: 124, // 2m 4s
    fileSize: 3100000,
    status: 'COMPLETED',
    customerId: 'CUST-8742',
    customerName: 'Sarah Jenkins',
    agentId: 'agent-2',
    teamId: 'team-1',
    organizationId: 'org-1',
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 20), // 20 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 20),
    agent: {
      id: 'agent-2',
      email: 'lisa.m@company.com',
      supabaseId: 'sb-2',
      firstName: 'Lisa',
      lastName: 'Miller',
      avatarUrl: null,
      role: 'AGENT',
      organizationId: 'org-1',
      teamId: 'team-1',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    analysis: {
      id: 'analysis-2',
      callId: 'call-2',
      summary: 'Client Sarah Jenkins called because her billing portal returned an error during a invoice settlement. Agent guided client through card verification steps and successfully processed the payment manually.',
      sentimentOverall: 'NEUTRAL',
      sentimentScore: 0.15,
      coachingTips: [
        'Good technical navigation instructions.',
        'Remember to state full fee structures when taking manual cards.',
      ],
      strengths: ['Portal navigation instruction', 'Efficient resolving'],
      improvements: ['Lacks proper billing verification statements'],
      transcript: [
        { speaker: 'Agent', start: 0, end: 5, text: 'Hello, thank you for calling. My name is Lisa. This call is monitored. How may I assist?', sentiment: 'neutral', emotion: 'Neutral', turningPoint: false },
        { speaker: 'Customer', start: 5, end: 12, text: 'Hi, I am trying to pay my monthly BPO invoice online and the portal keeps saying card rejected. Can you process this?', sentiment: 'negative', emotion: 'Frustrated', turningPoint: false },
        { speaker: 'Agent', start: 13, end: 22, text: 'Yes, I can certainly process that manually. Can you confirm your invoice number and the last four digits of the billing card?', sentiment: 'neutral', emotion: 'Neutral', turningPoint: false },
        { speaker: 'Customer', start: 23, end: 28, text: 'Invoice is INV-821 and card ends in 4920.', sentiment: 'neutral', emotion: 'Neutral', turningPoint: false },
        { speaker: 'Agent', start: 29, end: 38, text: 'Excellent. I have run the card and it succeeded. A receipt has been sent to your email.', sentiment: 'positive', emotion: 'Neutral', turningPoint: true },
      ],
      aiCoachReport: {
        detections: {
          interruptionsCount: 0,
          longSilencesCount: 1,
          wrongToneCount: 1,
          missedScriptCount: 1,
          missedComplianceCount: 1,
          details: [
            { type: 'silence', timestamp: '0:13', seconds: 13, description: 'long pause of 6 seconds before confirming manual processor capabilities.' },
            { type: 'tone', timestamp: '0:29', seconds: 29, description: 'Slightly monotone response when checking credit card PIN.' },
            { type: 'compliance', timestamp: '0:29', seconds: 29, description: 'Failed to complete PIN authentication policy checks.' }
          ]
        },
        insights: [
          {
            id: 'ins-2',
            timestamp: '0:29',
            seconds: 29,
            originalTurn: 'Excellent. I have run the card and it succeeded...',
            coachingAdvice: 'Ensure you verify name, postal code, and secondary authentication PINs BEFORE processing manually via financial terminals.',
            betterResponse: 'I would be glad to help process this invoice settlement manually. First, to verify account authority, could you confirm your billing PIN and contract address?',
            rationale: 'Financial safety compliance requires strict verification protocols prior to processing transactions.'
          }
        ]
      },
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    qaReports: [
      {
        id: 'qa-2',
        callId: 'call-2',
        reviewerId: 'rev-1',
        score: 82,
        checklist: {
          greeting: { score: 95, explanation: 'Lisa Miller used the branded greeting within 3 seconds of connection.' },
          verification: { score: 40, explanation: 'Agent failed to complete verification before processing credit card info.' },
          compliance: { score: 66, explanation: 'Standard recording disclosure read, but skipped identity verification policies.' },
          empathy: { score: 90, explanation: 'Active assurance provided during web decline issue.' },
          listening: { score: 90, explanation: 'Agent listened patiently while customer described invoice issues.' },
          problemSolving: { score: 100, explanation: 'Successfully processed invoice manual bypass and cleared card decline.' },
          closing: { score: 95, explanation: 'Cleared wrap up, verified transaction confirmation, and closed call.' },
          professionalism: { score: 95, explanation: 'Maintained polite, supportive conduct despite compliance gap.' },
          mistakes: [
            'Failed to execute security verification questions before entering financial menus.',
          ],
          improvements: [
            'Ensure identity checks are mandatory for all manual ledger transactions.',
          ],
        },
        feedback: 'Good resolution but the agent failed compliance: did not complete full billing identification checks before processing card details.',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    crmNote: {
      id: 'crm-2',
      callId: 'call-2',
      summary: 'Sarah Jenkins called to resolve card processing failure on web portal for INV-821. Agent processed invoice payment manually ending in 4920. Succeeded.',
      keyPoints: [
        'Customer reported billing portal decline.',
        'Manual payment settlement performed by agent.',
      ],
      actionItems: [
        'Close payment ticket for invoice INV-821.',
      ],
      exported: false,
      exportedAt: null,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
]

export class CallsService {
  /**
   * Fetch call records. If database is empty, returns seed data.
   */
  static async getCalls(limit?: number): Promise<CallRecord[]> {
    try {
      const dbCalls = await prisma.call.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          agent: true,
          analysis: true,
          qaReports: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'desc' },
          },
          crmNote: true,
        },
      })

      if (dbCalls.length === 0) {
        // Map mock calls to matching DB interface
        return limit ? MOCK_CALLS.slice(0, limit) : MOCK_CALLS
      }

      // Convert DB models to CallRecord interface
      return dbCalls.map((c) => ({
        id: c.id,
        title: c.title,
        filename: c.filename,
        fileUrl: c.fileUrl,
        duration: c.duration,
        fileSize: c.fileSize,
        status: c.status as CallStatus,
        customerId: c.customerId,
        customerName: c.customerName,
        agentId: c.agentId,
        teamId: c.teamId,
        organizationId: c.organizationId,
        isDeleted: c.isDeleted,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        agent: c.agent ? {
          ...c.agent,
          role: c.agent.role as Role,
        } : undefined,
        analysis: c.analysis ? {
          ...c.analysis,
          sentimentOverall: c.analysis.sentimentOverall as Sentiment,
          transcript: c.analysis.transcript as unknown as TranscriptSegment[],
          coachingTips: c.analysis.coachingTips as unknown as string[],
          strengths: c.analysis.strengths as unknown as string[],
          improvements: c.analysis.improvements as unknown as string[],
          aiCoachReport: c.analysis.aiCoachReport as unknown as AICoachReport | undefined,
        } : undefined,
        qaReports: c.qaReports.map((q) => ({
          ...q,
          checklist: q.checklist as unknown as QAChecklist,
        })),
        crmNote: c.crmNote ? {
          ...c.crmNote,
          keyPoints: c.crmNote.keyPoints as unknown as string[],
          actionItems: c.crmNote.actionItems as unknown as string[],
          productsMentioned: c.crmNote.productsMentioned as unknown as string[] | null | undefined,
        } : undefined,
      }))
    } catch (err) {
      console.error('Database query failed. Returning mock calls:', err)
      return limit ? MOCK_CALLS.slice(0, limit) : MOCK_CALLS
    }
  }

  /**
   * Fetch a call record by its ID.
   */
  static async getCallById(id: string): Promise<CallRecord | null> {
    try {
      const c = await prisma.call.findUnique({
        where: { id },
        include: {
          agent: true,
          analysis: true,
          qaReports: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'desc' },
          },
          crmNote: true,
        },
      })

      // If not found in DB, fall back to mock data
      if (!c) {
        const mockMatch = MOCK_CALLS.find((m) => m.id === id)
        return mockMatch || null
      }

      return {
        id: c.id,
        title: c.title,
        filename: c.filename,
        fileUrl: c.fileUrl,
        duration: c.duration,
        fileSize: c.fileSize,
        status: c.status as CallStatus,
        customerId: c.customerId,
        customerName: c.customerName,
        agentId: c.agentId,
        teamId: c.teamId,
        organizationId: c.organizationId,
        isDeleted: c.isDeleted,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        agent: c.agent ? {
          ...c.agent,
          role: c.agent.role as Role,
        } : undefined,
        analysis: c.analysis ? {
          ...c.analysis,
          sentimentOverall: c.analysis.sentimentOverall as Sentiment,
          transcript: c.analysis.transcript as unknown as TranscriptSegment[],
          coachingTips: c.analysis.coachingTips as unknown as string[],
          strengths: c.analysis.strengths as unknown as string[],
          improvements: c.analysis.improvements as unknown as string[],
          aiCoachReport: c.analysis.aiCoachReport as unknown as AICoachReport | undefined,
        } : undefined,
        qaReports: c.qaReports.map((q) => ({
          ...q,
          checklist: q.checklist as unknown as QAChecklist,
        })),
        crmNote: c.crmNote ? {
          ...c.crmNote,
          keyPoints: c.crmNote.keyPoints as unknown as string[],
          actionItems: c.crmNote.actionItems as unknown as string[],
          productsMentioned: c.crmNote.productsMentioned as unknown as string[] | null | undefined,
        } : undefined,
      }
    } catch (err) {
      console.error(`Database query for call ${id} failed:`, err)
      // On DB failure, try mock data as final fallback
      const mockMatch = MOCK_CALLS.find((m) => m.id === id)
      return mockMatch || null
    }
  }

  /**
   * Get analytics dashboard stats
   */
  static async getAnalytics() {
    // Standard mock metrics for display
    return {
      totalAnalyzed: 1832,
      averageQa: 87.4,
      sentimentStats: {
        positive: 62, // %
        neutral: 26,  // %
        negative: 12, // %
      },
      qaTrend: [
        { week: 'W1', qa: 84 },
        { week: 'W2', qa: 85 },
        { week: 'W3', qa: 86 },
        { week: 'W4', qa: 87.4 },
      ],
      volumeTrend: [
        { name: 'Mon', count: 120 },
        { name: 'Tue', count: 140 },
        { name: 'Wed', count: 180 },
        { name: 'Thu', count: 160 },
        { name: 'Fri', count: 210 },
      ],
    }
  }
}
