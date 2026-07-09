import dotenv from 'dotenv'
import path from 'path'
import { triggerProcessing } from '../lib/queue'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

console.log('\n🔄 Triggering local background queue processing cycle...\n')
triggerProcessing()

// Keep the Node process active to allow async processing promises to finalize
const runTimeMs = 95000
console.log(`⏱️  Running worker cycle for ${runTimeMs / 1000} seconds to process pending jobs in the database...\n`)

setTimeout(() => {
  console.log('\n✅ Trigger worker cycle complete.\n')
  process.exit(0)
}, runTimeMs)
