import { assertRole } from '@/lib/rbac'
import SettingsForm from '@/components/dashboard/SettingsForm'

export default async function SettingsPage() {
  // Guard route - only ADMIN or MANAGER can access settings
  await assertRole(['ADMIN', 'MANAGER'])

  return <SettingsForm />
}
