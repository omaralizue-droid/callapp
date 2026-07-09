/**
 * Custom Domain — Architecture Stub
 *
 * Provides the contract and stub implementations for custom domain verification.
 * Organizations on Enterprise plans can serve the dashboard from their own domain
 * (e.g. "app.mycompany.com" instead of "app.callpilot.ai").
 *
 * ─── Current Status: Architecture Only ───────────────────────────────────────
 *
 * Real implementation requires one of:
 *  a) Vercel Domains API  — https://vercel.com/docs/rest-api/endpoints/domains
 *  b) Cloudflare for SaaS — https://developers.cloudflare.com/cloudflare-for-platforms/
 *  c) Caddy / Nginx proxy — dynamic VirtualHost management
 *
 * DNS challenge flow (to be implemented):
 *  1. Org admin adds their domain in White Label settings
 *  2. We generate a unique TXT record value (stored in DB)
 *  3. Admin adds it to their DNS
 *  4. This module's verifyCustomDomain() is called (via cron or webhook)
 *  5. If DNS lookup confirms the TXT record, customDomainVerified = true
 *  6. Traffic to that domain is routed to this app
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DomainVerificationResult {
  verified: boolean
  pending: boolean
  domain: string
  /** Human-readable reason for failure, if any */
  reason?: string
  /** ISO 8601 timestamp of the check */
  checkedAt: string
}

export interface DnsChallengeRecord {
  type: 'TXT'
  host: string   // e.g. "_callpilot-verify.mycompany.com"
  value: string  // e.g. "callpilot-verify=abc123xyz"
  ttl: number    // Recommended TTL in seconds (300 = 5 min)
}

// ─── Token Generation ─────────────────────────────────────────────────────────

/**
 * Generates a stable, unique verification token for a given domain + org combination.
 * In production, store this token in the Organization record and compare it during DNS lookup.
 *
 * STUB: Uses a simple deterministic hash of orgId.
 * Future: Use crypto.randomBytes(20).toString('hex') stored in DB.
 */
export function generateDomainVerificationToken(orgId: string): string {
  // Simple stub — replace with secure random token stored in DB
  return `callpilot-verify-${orgId.slice(0, 8).replace(/-/g, '')}`
}

/**
 * Returns the DNS TXT record the organization must add to prove domain ownership.
 */
export function getExpectedDnsRecord(domain: string, orgId: string): DnsChallengeRecord {
  const token = generateDomainVerificationToken(orgId)
  // Strip protocol if present
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

  return {
    type: 'TXT',
    host: `_callpilot-verify.${cleanDomain}`,
    value: token,
    ttl: 300,
  }
}

// ─── Verification (STUB) ──────────────────────────────────────────────────────

/**
 * STUB: Attempts to verify that the organization has added the required DNS record.
 *
 * Future implementation:
 *   const records = await dns.promises.resolveTxt(`_callpilot-verify.${domain}`)
 *   const flat = records.flat()
 *   const expected = generateDomainVerificationToken(orgId)
 *   if (flat.includes(expected)) {
 *     await prisma.organization.update({
 *       where: { id: orgId },
 *       data: { customDomainVerified: true },
 *     })
 *     return { verified: true, pending: false, domain, checkedAt: new Date().toISOString() }
 *   }
 */
export async function verifyCustomDomain(
  domain: string,
  orgId: string,
): Promise<DomainVerificationResult> {
  console.info(`[CustomDomain][STUB] verifyCustomDomain → domain=${domain}, orgId=${orgId}`)

  // Stub: always returns pending (not yet verified)
  return {
    verified: false,
    pending: true,
    domain,
    reason: 'DNS verification is not yet implemented. This is an architecture stub.',
    checkedAt: new Date().toISOString(),
  }
}

// ─── Domain Validation ────────────────────────────────────────────────────────

/**
 * Returns true if the string looks like a valid hostname.
 * Does not require http/https protocol prefix.
 */
export function isValidDomain(domain: string): boolean {
  const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(clean)
}

/**
 * Normalizes a domain string: strips protocol, trailing slashes, and lowercases.
 */
export function normalizeDomain(domain: string): string {
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .toLowerCase()
    .trim()
}
