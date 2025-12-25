"use client"

/**
 * SVG Filter Definitions for Bleeding-Edge UI Effects
 *
 * These filters are GPU-accelerated and mobile-safe.
 * Inject once at app root, reference by ID throughout.
 */

import * as React from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// GOOEY / METABALL FILTER
// Creates organic blob-merge effect when elements overlap
// ═══════════════════════════════════════════════════════════════════════════════

export const GOOEY_FILTER_ID = "gooey-filter"

interface GooeyFilterProps {
  /** Blur amount - higher = more gooey (default: 12) */
  blur?: number
  /** Contrast threshold - higher = sharper edges (default: 20) */
  contrast?: number
  /** Alpha offset - adjusts edge detection (default: -10) */
  alphaOffset?: number
}

/**
 * SVG Gooey Filter Definition
 *
 * How it works:
 * 1. Gaussian blur spreads color outward
 * 2. Color matrix with high contrast snaps edges back
 * 3. Result: shapes "merge" where they overlap
 *
 * Usage:
 * 1. Render <GooeyFilterDef /> once in your layout
 * 2. Apply filter: style={{ filter: `url(#${GOOEY_FILTER_ID})` }}
 */
export function GooeyFilterDef({
  blur = 12,
  contrast = 20,
  alphaOffset = -10
}: GooeyFilterProps = {}) {
  return React.createElement(
    'svg',
    {
      width: 0,
      height: 0,
      style: { position: 'absolute', pointerEvents: 'none' },
      'aria-hidden': true,
    },
    React.createElement(
      'defs',
      null,
      React.createElement(
        'filter',
        { id: GOOEY_FILTER_ID },
        // Step 1: Blur the source graphics
        React.createElement('feGaussianBlur', {
          in: 'SourceGraphic',
          stdDeviation: blur,
          result: 'blur',
        }),
        // Step 2: High contrast color matrix to sharpen edges
        // Matrix: identity RGB, alpha channel gets contrast boost
        React.createElement('feColorMatrix', {
          in: 'blur',
          type: 'matrix',
          values: `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${contrast} ${alphaOffset}`,
          result: 'gooey',
        }),
        // Step 3: Composite original on top for crisp centers
        React.createElement('feComposite', {
          in: 'SourceGraphic',
          in2: 'gooey',
          operator: 'atop',
        })
      )
    )
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOW FILTER
// Adds soft outer glow to elements
// ═══════════════════════════════════════════════════════════════════════════════

export const GLOW_FILTER_ID = "glow-filter"

interface GlowFilterProps {
  /** Glow blur radius (default: 8) */
  blur?: number
  /** Glow color in CSS format (default: white) */
  color?: string
}

export function GlowFilterDef({ blur = 8, color = "white" }: GlowFilterProps = {}) {
  return React.createElement(
    'svg',
    {
      width: 0,
      height: 0,
      style: { position: 'absolute', pointerEvents: 'none' },
      'aria-hidden': true,
    },
    React.createElement(
      'defs',
      null,
      React.createElement(
        'filter',
        { id: GLOW_FILTER_ID },
        React.createElement('feGaussianBlur', {
          in: 'SourceGraphic',
          stdDeviation: blur,
          result: 'blur',
        }),
        React.createElement('feFlood', {
          floodColor: color,
          floodOpacity: 0.5,
          result: 'color',
        }),
        React.createElement('feComposite', {
          in: 'color',
          in2: 'blur',
          operator: 'in',
          result: 'glow',
        }),
        React.createElement(
          'feMerge',
          null,
          React.createElement('feMergeNode', { in: 'glow' }),
          React.createElement('feMergeNode', { in: 'SourceGraphic' })
        )
      )
    )
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED FILTER PROVIDER
// Injects all filter definitions at once
// ═══════════════════════════════════════════════════════════════════════════════

export function SVGFilterProvider() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(GooeyFilterDef),
    React.createElement(GlowFilterDef)
  )
}
