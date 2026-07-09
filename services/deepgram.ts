/**
 * Deepgram Nova-3 Speech-to-Text Service
 * 
 * Transcribes call audio files with speaker diarization, smart formatting,
 * and high accuracy using Deepgram's latest Nova-3 model.
 */

export interface DeepgramParagraphTurn {
  speaker: number
  text: string
  start: number
  end: number
}

export class DeepgramService {
  /**
   * Transcribes call audio buffer using Deepgram Nova-3
   */
  static async transcribeAudio(
    audioBuffer: Buffer,
    mimeType: string
  ): Promise<DeepgramParagraphTurn[]> {
    const apiKey = process.env.DEEPGRAM_API_KEY
    if (!apiKey) {
      console.warn('[Deepgram Service] DEEPGRAM_API_KEY is not defined. Skipping Deepgram transcription.')
      throw new Error('Deepgram API Key is missing.')
    }

    const queryParams = new URLSearchParams({
      model: 'nova-3',
      diarize: 'true',
      smart_format: 'true',
      paragraphs: 'true',
    })

    const url = `https://api.deepgram.com/v1/listen?${queryParams.toString()}`

    console.info(`[Deepgram Service] Sending audio to Deepgram Nova-3... size: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB, mimeType: ${mimeType}`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': mimeType || 'audio/wav',
      },
      body: new Uint8Array(audioBuffer),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Deepgram Service] Deepgram API request failed: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Deepgram API failed: ${response.statusText}. Details: ${errorText}`)
    }

    const data = await response.json()
    
    // Parse paragraphs diarization turns
    const alternatives = data?.results?.channels?.[0]?.alternatives?.[0]
    const paragraphsData = alternatives?.paragraphs?.paragraphs

    if (!paragraphsData || paragraphsData.length === 0) {
      console.warn('[Deepgram Service] No paragraphs structure returned from Deepgram. Falling back to words extraction.')
      // Fallback: extract from words directly
      const words = alternatives?.words || []
      if (words.length === 0) return []

      // Simple word grouping by speaker
      const turns: DeepgramParagraphTurn[] = []
      let currentTurn: DeepgramParagraphTurn | null = null

      for (const w of words) {
        const speaker = w.speaker ?? 0
        if (!currentTurn || currentTurn.speaker !== speaker) {
          if (currentTurn) turns.push(currentTurn)
          currentTurn = {
            speaker,
            text: w.punctuated_word || w.word,
            start: w.start,
            end: w.end,
          }
        } else {
          currentTurn.text += ' ' + (w.punctuated_word || w.word)
          currentTurn.end = w.end
        }
      }
      if (currentTurn) turns.push(currentTurn)
      return turns
    }

    // Map structured paragraphs
    return paragraphsData.map((para: any) => {
      // Gather sentence texts
      const sentences = para.sentences || []
      const text = sentences.map((s: any) => s.text).join(' ')
      return {
        speaker: para.speaker ?? 0,
        text: text || para.transcript || '',
        start: para.start ?? 0,
        end: para.end ?? 0,
      }
    })
  }
}
