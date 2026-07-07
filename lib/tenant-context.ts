import { AsyncLocalStorage } from 'async_hooks'

export interface TenantStore {
  organizationId: string
  userId: string
  role: string
}

export const tenantStorage = new AsyncLocalStorage<TenantStore>()
