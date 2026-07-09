import { GoogleGenAI, Type, Schema } from '@google/genai'
import { buildSystemInstruction, USER_ANALYSIS_PROMPT } from '@/lib/prompts'
import { DeepgramService } from './deepgram'


/**
 * Type-safe output interface representing the expected JSON response from Gemini
 */
export interface GeminiAnalysisOutput {
  summary: string
  sentimentOverall: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  sentimentScore: number // -1.0 to 1.0
  coachingTips: string[]
  strengths: string[]
  improvements: string[]
  qaScorecard: {
    greeting: { score: number; explanation: string }
    verification: { score: number; explanation: string }
    compliance: { score: number; explanation: string }
    empathy: { score: number; explanation: string }
    listening: { score: number; explanation: string }
    problemSolving: { score: number; explanation: string }
    closing: { score: number; explanation: string }
    professionalism: { score: number; explanation: string }
    mistakes: string[]
    improvements: string[]
  }
  crmNotes: {
    summary: string
    keyPoints: string[]
    actionItems: string[]
    customerName: string
    agentName: string
    callPurpose: string
    issue: string
    resolution: string
    followUp: string
    productsMentioned: string[]
    callDuration: number
    importantNotes: string
  }
  transcript: {
    speaker: 'Agent' | 'Customer'
    text: string
    start: number // seconds
    end: number // seconds
    sentiment: 'positive' | 'neutral' | 'negative'
    emotion: 'Happy' | 'Neutral' | 'Confused' | 'Angry' | 'Frustrated'
    turningPoint: boolean
  }[]
  aiCoachReport: {
    detections: {
      interruptionsCount: number
      longSilencesCount: number
      wrongToneCount: number
      missedScriptCount: number
      missedComplianceCount: number
      details: {
        type: 'interruption' | 'silence' | 'tone' | 'script' | 'compliance'
        timestamp: string
        description: string
        seconds: number
      }[]
    }
    insights: {
      id: string
      timestamp: string
      seconds: number
      originalTurn: string
      coachingAdvice: string
      betterResponse: string
      rationale: string
    }[]
  }
}

export class GeminiService {
  /**
   * Helper to retrieve initialized GoogleGenAI SDK client
   */
  private static getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('Warning: GEMINI_API_KEY is not defined in environment variables.')
    }
    return new GoogleGenAI({ apiKey: apiKey || 'dummy-key' })
  }

  /**
   * Defines the structured JSON Schema for Gemini response validation
   */
  private static getAnalysisSchema(): Schema {
    return {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: 'A detailed executive summary paragraph of the call.',
        },
        sentimentOverall: {
          type: Type.STRING,
          enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'],
          description: 'Overall sentiment of the caller during the call.',
        },
        sentimentScore: {
          type: Type.NUMBER,
          description: 'Average sentiment score from -1.0 (frustrated) to 1.0 (highly satisfied).',
        },
        coachingTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Actionable feedback checkpoints for agent coaching.',
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Top 3 agent strengths displayed.',
        },
        improvements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Areas where the agent could improve soft skills.',
        },
        qaScorecard: {
          type: Type.OBJECT,
          properties: {
            greeting: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            verification: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            compliance: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            empathy: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            listening: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            problemSolving: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            closing: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            professionalism: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['score', 'explanation'],
            },
            mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'greeting',
            'verification',
            'compliance',
            'empathy',
            'listening',
            'problemSolving',
            'closing',
            'professionalism',
            'mistakes',
            'improvements',
          ],
        },
        crmNotes: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            customerName: { type: Type.STRING },
            agentName: { type: Type.STRING },
            callPurpose: { type: Type.STRING },
            issue: { type: Type.STRING },
            resolution: { type: Type.STRING },
            followUp: { type: Type.STRING },
            productsMentioned: { type: Type.ARRAY, items: { type: Type.STRING } },
            callDuration: { type: Type.NUMBER },
            importantNotes: { type: Type.STRING },
          },
          required: [
            'summary',
            'keyPoints',
            'actionItems',
            'customerName',
            'agentName',
            'callPurpose',
            'issue',
            'resolution',
            'followUp',
            'productsMentioned',
            'callDuration',
            'importantNotes',
          ],
        },
        transcript: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              speaker: { type: Type.STRING, enum: ['Agent', 'Customer'] },
              text: { type: Type.STRING },
              start: { type: Type.NUMBER },
              end: { type: Type.NUMBER },
              sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
              emotion: { type: Type.STRING, enum: ['Happy', 'Neutral', 'Confused', 'Angry', 'Frustrated'] },
              turningPoint: { type: Type.BOOLEAN },
            },
            required: ['speaker', 'text', 'start', 'end', 'sentiment', 'emotion', 'turningPoint'],
          },
          description: 'Detailed time-stamped speaker-separated conversation transcription.',
        },
        aiCoachReport: {
          type: Type.OBJECT,
          properties: {
            detections: {
              type: Type.OBJECT,
              properties: {
                interruptionsCount: { type: Type.INTEGER },
                longSilencesCount: { type: Type.INTEGER },
                wrongToneCount: { type: Type.INTEGER },
                missedScriptCount: { type: Type.INTEGER },
                missedComplianceCount: { type: Type.INTEGER },
                details: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['interruption', 'silence', 'tone', 'script', 'compliance'] },
                      timestamp: { type: Type.STRING },
                      description: { type: Type.STRING },
                      seconds: { type: Type.NUMBER },
                    },
                    required: ['type', 'timestamp', 'description', 'seconds'],
                  },
                },
              },
              required: [
                'interruptionsCount',
                'longSilencesCount',
                'wrongToneCount',
                'missedScriptCount',
                'missedComplianceCount',
                'details',
              ],
            },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  seconds: { type: Type.NUMBER },
                  originalTurn: { type: Type.STRING },
                  coachingAdvice: { type: Type.STRING },
                  betterResponse: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                },
                required: ['id', 'timestamp', 'seconds', 'originalTurn', 'coachingAdvice', 'betterResponse', 'rationale'],
              },
            },
          },
          required: ['detections', 'insights'],
        },
      },
      required: [
        'summary',
        'sentimentOverall',
        'sentimentScore',
        'coachingTips',
        'strengths',
        'improvements',
        'qaScorecard',
        'crmNotes',
        'transcript',
        'aiCoachReport',
      ],
    }
  }

  /**
   * Helper retry wrapper implementing exponential backoff for transient issues
   */
  private static async withRetries<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 2000
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      if (retries <= 0) throw error
      console.warn(`Gemini API request failed. Retrying in ${delay}ms... (Attempts remaining: ${retries}). Error:`, error)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return this.withRetries(fn, retries - 1, delay * 2)
    }
  }

  /**
   * Timeout wrapper ensuring API requests do not hang indefinitely
   */
  private static withTimeout<T>(
    promise: Promise<T>,
    timeoutMs = 90000
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini API connection timed out after ${timeoutMs}ms.`)), timeoutMs)
      ),
    ])
  }

  /**
   * Fetches raw audio buffer from public Supabase storage url
   */
  static async downloadAudio(fileUrl: string): Promise<Buffer> {
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch call audio file from storage: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Analyzes call recording using Gemini 2.5 Pro Multimodal capabilities
   * Accepts raw audio data, mimeType, and evaluation guidelines.
   */
  static async analyzeCall(
    audioBuffer: Buffer,
    mimeType: string,
    rubric: { compliance: string[]; softSkills: string[] }
  ): Promise<GeminiAnalysisOutput> {
    const apiCall = async () => {
      // 1. Attempt transcription via Deepgram Nova-3 if API Key is configured
      const deepgramTranscript = await (async () => {
        try {
          if (process.env.DEEPGRAM_API_KEY) {
            return await DeepgramService.transcribeAudio(audioBuffer, mimeType)
          }
        } catch (e) {
          console.error('[Gemini Service] Deepgram transcription failed. Falling back to native Gemini processing:', e)
        }
        return null
      })()

      const ai = this.getClient()
      const base64Audio = audioBuffer.toString('base64')
      
      const systemInstruction = buildSystemInstruction(rubric)

      // Enhance prompt with Deepgram high-accuracy transcript if available
      let userPrompt = USER_ANALYSIS_PROMPT
      if (deepgramTranscript && deepgramTranscript.length > 0) {
        userPrompt += `\n\nUse the following high-fidelity pre-recorded diarized transcription from our Speech-to-Text provider (Deepgram Nova-3) to populate the final timestamped dialogue loops and map numeric speaker IDs to 'Agent' or 'Customer' based on contextual cues:\n${JSON.stringify(deepgramTranscript)}`
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Audio,
                  mimeType: mimeType,
                },
              },
              {
                text: userPrompt,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: this.getAnalysisSchema(),
          temperature: 0.1, // low temperature ensures objective QA grading
        },
      })

      const textResult = response.text
      if (!textResult) {
        throw new Error('Empty response received from Gemini API.')
      }

      return JSON.parse(textResult) as GeminiAnalysisOutput
    }

    // Wrap the request in both a 3-stage retry and a 90-second timeout block
    return this.withTimeout(
      this.withRetries(apiCall, 3, 2000),
      90000
    )
  }
}
