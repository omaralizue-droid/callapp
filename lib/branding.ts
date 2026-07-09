/**
 * Branding Utilities
 *
 * Defines the OrgBranding type, default values, CSS variable generation,
 * and color utilities for the white-label system.
 *
 * Design contract:
 *  - All brand values are optional — defaults fall back to CallPilot's palette
 *  - CSS vars are injected at the dashboard layout level as an inline <style> block
 *  - Client components read brand values via useBranding() from BrandingProvider
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrgBranding {
  /** Custom name shown in the sidebar (replaces "CallPilot.AI") */
  brandName: string | null
  /** URL of the org's logo image shown in the sidebar */
  brandLogoUrl: string | null
  /** Primary brand hex color e.g. "#4f46e5" */
  brandColor: string | null
  /** Darker variant for gradients e.g. "#3730a3" — auto-derived if null */
  brandColorDark: string | null
  /** "From" name used in notification emails e.g. "Acme Support" */
  emailFromName: string | null
  /** Custom footer appended to all notification emails */
  emailFooterText: string | null
  /** Custom domain e.g. "app.mycompany.com" (arch only — not yet enforced) */
  customDomain: string | null
  /** Whether the custom domain DNS challenge has been verified */
  customDomainVerified: boolean
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_BRAND_COLOR      = '#4f46e5'
export const DEFAULT_BRAND_COLOR_DARK = '#3730a3'
export const DEFAULT_BRAND_NAME       = 'CallPilot.AI'
export const DEFAULT_EMAIL_FROM_NAME  = 'CallPilot Support'

export const BRANDING_DEFAULTS: OrgBranding = {
  brandName:             null,
  brandLogoUrl:          null,
  brandColor:            null,
  brandColorDark:        null,
  emailFromName:         null,
  emailFooterText:       null,
  customDomain:          null,
  customDomainVerified:  false,
}

// ─── Resolver ─────────────────────────────────────────────────────────────────

/**
 * Maps a raw DB Organization record's branding fields to an OrgBranding object.
 * Safe to call with a partial record — any missing field returns null.
 */
export function resolveBranding(org: {
  brandName?: string | null
  brandLogoUrl?: string | null
  brandColor?: string | null
  brandColorDark?: string | null
  emailFromName?: string | null
  emailFooterText?: string | null
  customDomain?: string | null
  customDomainVerified?: boolean
} | null): OrgBranding {
  if (!org) return BRANDING_DEFAULTS
  return {
    brandName:            org.brandName            ?? null,
    brandLogoUrl:         org.brandLogoUrl         ?? null,
    brandColor:           org.brandColor           ?? null,
    brandColorDark:       org.brandColorDark       ?? null,
    emailFromName:        org.emailFromName        ?? null,
    emailFooterText:      org.emailFooterText      ?? null,
    customDomain:         org.customDomain         ?? null,
    customDomainVerified: org.customDomainVerified ?? false,
  }
}

// ─── CSS Variable Builder ─────────────────────────────────────────────────────

/**
 * Generates a CSS :root block that overrides the default brand variables.
 * Injected as an inline <style> tag in the dashboard layout.
 *
 * Usage in layout:
 *   <style dangerouslySetInnerHTML={{ __html: buildBrandCssVars(branding) }} />
 *
 * CSS variables produced:
 *   --brand-primary      : primary hex color
 *   --brand-dark         : darker gradient variant
 *   --brand-primary-rgb  : R, G, B values (for rgba() usage)
 *   --brand-glow         : rgba glow at 35% opacity
 *   --brand-glow-soft    : rgba glow at 15% opacity
 *   --brand-glow-faint   : rgba glow at 8% opacity
 */
export function buildBrandCssVars(branding: OrgBranding): string {
  const primary  = sanitizeHex(branding.brandColor)  ?? DEFAULT_BRAND_COLOR
  const dark     = sanitizeHex(branding.brandColorDark) ?? darkenHexColor(primary, 20)
  const rgb      = hexToRgb(primary)
  const rgbStr   = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '79, 70, 229'

  return `:root {
  --brand-primary:     ${primary};
  --brand-dark:        ${dark};
  --brand-primary-rgb: ${rgbStr};
  --brand-glow:        rgba(${rgbStr}, 0.35);
  --brand-glow-soft:   rgba(${rgbStr}, 0.15);
  --brand-glow-faint:  rgba(${rgbStr}, 0.08);

  /* Override the default indigo vars used throughout the dashboard */
  --indigo:       ${primary};
  --indigo-light: ${lightenHexColor(primary, 10)};
  --glow-indigo:  rgba(${rgbStr}, 0.35);
}`
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

/**
 * Returns true if str is a valid 3 or 6-digit hex color (with or without #).
 */
export function isValidHexColor(str: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str.trim())
}

/**
 * Normalizes a hex color to lowercase 7-char form (#rrggbb).
 * Returns null if invalid.
 */
export function sanitizeHex(hex: string | null | undefined): string | null {
  if (!hex) return null
  const trimmed = hex.trim()
  if (!isValidHexColor(trimmed)) return null
  const clean = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  // Expand 3-char shorthand
  if (clean.length === 4) {
    const [, r, g, b] = clean
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return clean.toLowerCase()
}

/**
 * Converts a hex string to { r, g, b } integers.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = sanitizeHex(hex)
  if (!clean) return null
  const num = parseInt(clean.slice(1), 16)
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8)  & 0xff,
    b: num & 0xff,
  }
}

/**
 * Darkens a hex color by the given amount (0–255).
 */
export function darkenHexColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return DEFAULT_BRAND_COLOR_DARK
  const clamp = (n: number) => Math.max(0, Math.min(255, n))
  const r = clamp(rgb.r - amount).toString(16).padStart(2, '0')
  const g = clamp(rgb.g - amount).toString(16).padStart(2, '0')
  const b = clamp(rgb.b - amount).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

/**
 * Lightens a hex color by the given amount (0–255).
 */
export function lightenHexColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return DEFAULT_BRAND_COLOR
  const clamp = (n: number) => Math.max(0, Math.min(255, n))
  const r = clamp(rgb.r + amount).toString(16).padStart(2, '0')
  const g = clamp(rgb.g + amount).toString(16).padStart(2, '0')
  const b = clamp(rgb.b + amount).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

// ─── Effective Values (with defaults) ────────────────────────────────────────

/** Returns the effective brand name (with CallPilot fallback) */
export function effectiveBrandName(branding: OrgBranding): string {
  return branding.brandName?.trim() || DEFAULT_BRAND_NAME
}

/** Returns the effective primary color (with indigo fallback) */
export function effectiveBrandColor(branding: OrgBranding): string {
  return sanitizeHex(branding.brandColor) ?? DEFAULT_BRAND_COLOR
}

/** Returns the effective email from-name */
export function effectiveEmailFromName(branding: OrgBranding): string {
  return branding.emailFromName?.trim() || DEFAULT_EMAIL_FROM_NAME
}
