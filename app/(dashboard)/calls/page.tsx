import { CallsService } from '@/services/calls'
import CallsHistoryClient from '@/components/dashboard/CallsHistoryClient'

export const revalidate = 0

export default async function CallsHistoryPage() {
  const calls = await CallsService.getCalls()

  return <CallsHistoryClient calls={calls} />
}
