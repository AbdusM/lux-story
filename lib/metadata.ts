/**
 * SEO Metadata Utilities
 *
 * Shared metadata configuration for all pages.
 * Uses Next.js Metadata API patterns.
 */

import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lux-story.com'

/**
 * Base metadata shared across all pages
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Grand Central Terminus',
    default: 'Grand Central Terminus',
  },
  description: 'A magical realist career exploration game where a mysterious train station appears between who you were and who you\'re becoming.',
  keywords: ['career exploration', 'game', 'Birmingham', 'youth', 'interactive story'],
  authors: [{ name: 'Lux Story' }],
  openGraph: {
    type: 'website',
    siteName: 'Grand Central Terminus',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Create page-specific metadata
 *
 * @param title - Page title (will be appended with " | Grand Central Terminus")
 * @param description - Page description (optional, defaults to base description)
 * @param options - Additional metadata options to merge
 * @returns Metadata object for the page
 *
 * @example
 * export const metadata = createPageMetadata('Welcome', 'Begin your journey')
 */
export function createPageMetadata(
  title: string,
  description?: string,
  options?: Partial<Metadata>
): Metadata {
  return {
    title,
    description: description || baseMetadata.description,
    openGraph: {
      title: `${title} | Grand Central Terminus`,
      description: description || baseMetadata.description as string,
      ...options?.openGraph,
    },
    ...options,
  }
}

/**
 * Create metadata for admin pages (noindex)
 *
 * @param title - Page title
 * @returns Metadata object with robots: noindex
 */
export function createAdminMetadata(title: string): Metadata {
  return {
    title: `${title} | Admin`,
    robots: {
      index: false,
      follow: false,
    },
  }
}

/**
 * Create metadata for dynamic routes
 *
 * @param getTitle - Function that receives params and returns title
 * @param getDescription - Optional function that receives params and returns description
 * @returns Async generateMetadata function
 *
 * @example
 * export const generateMetadata = createDynamicMetadata(
 *   (params) => `Student ${params.userId}`,
 *   (params) => `Profile for student ${params.userId}`
 * )
 */
export function createDynamicMetadata<T extends Record<string, string>>(
  getTitle: (params: T) => string,
  getDescription?: (params: T) => string
) {
  return async function generateMetadata({ params }: { params: Promise<T> }): Promise<Metadata> {
    const resolvedParams = await params
    const title = getTitle(resolvedParams)
    const description = getDescription?.(resolvedParams)

    return createPageMetadata(title, description)
  }
}
