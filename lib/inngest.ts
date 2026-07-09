import { Inngest } from 'inngest'
import { processJob } from './queue'

// Initialize the Inngest client
export const inngest = new Inngest({ id: 'callpilot-ai' })

// Define the serverless background task for call processing
export const callUploadedFunction = inngest.createFunction(
  {
    id: 'process-call-analysis',
    triggers: [{ event: 'call/uploaded' }]
  },
  async ({ event, step }) => {
    const { callId } = event.data

    // Wrap call analysis in a step.run block for serverless check-pointing & retry safety
    await step.run('audit-call-recording', async () => {
      await processJob(callId)
    })

    return { success: true, callId }
  }
)
