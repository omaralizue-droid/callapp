import { User } from './index'

export type CallStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface CallRecord {
  id: string;
  title: string | null;
  filename: string;
  fileUrl: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  status: CallStatus;
  customerId: string | null;
  customerName: string | null;
  agentId: string | null;
  teamId: string | null;
  organizationId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  agent?: User | null;
  analysis?: CallAnalysis | null;
  qaReports?: QAReport[];
  crmNote?: CRMNote | null;
}

export interface TranscriptSegment {
  speaker: string;
  text: string;
  start: number; // seconds
  end: number; // seconds
  sentiment: 'positive' | 'neutral' | 'negative';
  emotion?: 'Happy' | 'Neutral' | 'Confused' | 'Angry' | 'Frustrated';
  turningPoint?: boolean;
}

export interface AICoachDetectionDetail {
  type: 'interruption' | 'silence' | 'tone' | 'script' | 'compliance';
  timestamp: string;
  description: string;
  seconds: number;
}

export interface AICoachInsight {
  id: string;
  timestamp: string;
  seconds: number;
  originalTurn: string;
  coachingAdvice: string;
  betterResponse: string;
  rationale: string;
}

export interface AICoachReport {
  detections: {
    interruptionsCount: number;
    longSilencesCount: number;
    wrongToneCount: number;
    missedScriptCount: number;
    missedComplianceCount: number;
    details: AICoachDetectionDetail[];
  };
  insights: AICoachInsight[];
}

export interface CallAnalysis {
  id: string;
  callId: string;
  summary: string;
  transcript: TranscriptSegment[];
  sentimentOverall: Sentiment;
  sentimentScore: number; // -1.0 to 1.0
  coachingTips: string[];
  strengths: string[];
  improvements: string[];
  aiCoachReport?: AICoachReport;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QAComplianceItem {
  id: string;
  criterion: string;
  passed: boolean;
  notes?: string;
}

export interface QASoftSkillItem {
  id: string;
  skill: string;
  score: number; // 0 - 5
  notes?: string;
}

export interface QARubricScore {
  score: number;       // 0 - 100
  explanation: string;
}

export interface QAChecklist {
  greeting: QARubricScore;
  verification: QARubricScore;
  compliance: QARubricScore;
  empathy: QARubricScore;
  listening: QARubricScore;
  problemSolving: QARubricScore;
  closing: QARubricScore;
  professionalism: QARubricScore;
  mistakes: string[];
  improvements: string[];
}

export interface QAReport {
  id: string;
  callId: string;
  reviewerId: string | null;
  score: number; // 0 - 100
  checklist: QAChecklist;
  feedback: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  reviewer?: User | null;
}

export interface CRMNote {
  id: string;
  callId: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  
  // New structured fields
  customerName?: string | null;
  agentName?: string | null;
  callPurpose?: string | null;
  issue?: string | null;
  resolution?: string | null;
  followUp?: string | null;
  productsMentioned?: string[] | null;
  callDuration?: number | null;
  importantNotes?: string | null;

  exported: boolean;
  exportedAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
