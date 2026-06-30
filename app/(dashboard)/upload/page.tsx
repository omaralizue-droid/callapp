import { assertRole } from '@/lib/rbac'
import UploadForm from '@/components/dashboard/UploadForm'

export default async function UploadPage() {
  // Guard route - only ADMIN or MANAGER can upload call audio
  await assertRole(['ADMIN', 'MANAGER'])

  return <UploadForm />
}
