import { notFound } from 'next/navigation'
import { CallsService } from '@/services/calls'
import CallDetailPanel from '@/components/dashboard/CallDetailPanel'

export const revalidate = 0

interface CallDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CallDetailPage({ params }: CallDetailPageProps) {
  const { id } = await params
  const call = await CallsService.getCallById(id)

  if (!call) {
    notFound()
  }

  return <CallDetailPanel call={call} />
}
