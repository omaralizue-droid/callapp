'use client'

import React, { createContext, useContext } from 'react'
import type { OrgBranding } from '@/lib/branding'
import {
  effectiveBrandColor,
  effectiveBrandName,
  DEFAULT_BRAND_COLOR,
  DEFAULT_BRAND_COLOR_DARK,
  darkenHexColor,
  sanitizeHex,
} from '@/lib/branding'

// ─── Context ──────────────────────────────────────────────────────────────────

interface BrandingContextValue {
  branding: OrgBranding
  /** Effective primary color (with fallback) */
  primaryColor: string
  /** Effective dark variant (with fallback) */
  darkColor: string
  /** Effective brand display name */
  displayName: string
  /** Whether any custom branding has been set */
  isCustomBranded: boolean
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: {
    brandName:            null,
    brandLogoUrl:         null,
    brandColor:           null,
    brandColorDark:       null,
    emailFromName:        null,
    emailFooterText:      null,
    customDomain:         null,
    customDomainVerified: false,
  },
  primaryColor:    DEFAULT_BRAND_COLOR,
  darkColor:       DEFAULT_BRAND_COLOR_DARK,
  displayName:     'CallPilot.AI',
  isCustomBranded: false,
})

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the current organization's branding from any client component in the dashboard.
 *
 * Usage:
 *   const { primaryColor, displayName, branding } = useBranding()
 */
export function useBranding(): BrandingContextValue {
  return useContext(BrandingContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface BrandingProviderProps {
  children: React.ReactNode
  branding: OrgBranding
}

/**
 * Provides branding context to the dashboard tree.
 * Placed inside DashboardShell so every page and component can call useBranding().
 *
 * CSS variables are injected server-side via an inline <style> tag in the layout.
 * This provider handles the client-side derived values for component logic.
 */
export function BrandingProvider({ children, branding }: BrandingProviderProps) {
  const primaryColor = effectiveBrandColor(branding)
  const darkColor    = sanitizeHex(branding.brandColorDark) ?? darkenHexColor(primaryColor, 20)
  const displayName  = effectiveBrandName(branding)
  const isCustomBranded = !!(
    branding.brandName ||
    branding.brandLogoUrl ||
    branding.brandColor
  )

  const value: BrandingContextValue = {
    branding,
    primaryColor,
    darkColor,
    displayName,
    isCustomBranded,
  }

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  )
}

export default BrandingProvider
