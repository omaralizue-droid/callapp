import dotenv from 'dotenv'
import path from 'path'
import { DeepgramService } from '../services/deepgram'

// Load environment variables from the project root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function test() {
  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    console.error('\n❌ ERROR: DEEPGRAM_API_KEY is not defined in your .env file.')
    console.log('Please add DEEPGRAM_API_KEY="your_api_key_here" to your .env file before running this test.\n')
    process.exit(1)
  }

  console.log('\n🎙️ Testing Deepgram Nova-3 integration...')
  console.log(`🔑 Key prefix: ${apiKey.substring(0, 12)}...`)

  // Public sample wav URL containing speech (Deepgram Spacewalk sample)
  const sampleAudioUrl = 'https://dpgr.am/spacewalk.wav'
  console.log(`📥 Downloading sample audio file from: ${sampleAudioUrl}`)

  try {
    const response = await fetch(sampleAudioUrl)
    if (!response.ok) {
      throw new Error(`Failed to download sample audio: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    console.log(`📦 Download complete. Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`)

    console.log('⚡ Sending audio request to Deepgram Nova-3 (diarize=true)...')
    const startTime = Date.now()
    const turns = await DeepgramService.transcribeAudio(buffer, 'audio/wav')
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('\n📝 --- TRANSCRIPTION RESULTS (Deepgram Nova-3) ---')
    console.log(`⏱️ Duration: ${duration}s`)
    console.log(`💬 Total turns: ${turns.length}`)
    
    // Print the first 5 turns
    turns.slice(0, 5).forEach((t, i) => {
      console.log(`   [Turn ${i + 1}] Speaker ${t.speaker} (${t.start.toFixed(2)}s - ${t.end.toFixed(2)}s): ${t.text}`)
    })

    if (turns.length > 5) {
      console.log(`   ... and ${turns.length - 5} more turns.`)
    }
    
    console.log('--------------------------------------------------')
    console.log('✅ SUCCESS: Deepgram Nova-3 transcription is working perfectly!\n')

  } catch (err) {
    console.error('\n❌ ERROR: Deepgram integration check failed:', err)
  }
}

test()
