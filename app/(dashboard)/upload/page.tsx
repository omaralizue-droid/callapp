import { assertRole } from '@/lib/rbac'
import UploadForm from '@/components/dashboard/UploadForm'
import { getUsageStatus } from '@/services/usage'

export default async function UploadPage() {
  // Guard route - only ADMIN or MANAGER can upload call audio
  const profile = await assertRole(['ADMIN', 'MANAGER'])

  let usage = undefined
  if (profile.organizationId) {
    usage = await getUsageStatus(profile.organizationId)
  }

  return <UploadForm usage={usage} />
}
