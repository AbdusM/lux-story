'use client'

import { useMemo } from 'react'
import { AnimalType, PALETTES, SPRITES } from '@/content/pixel-sprites'
export type { AnimalType }

interface PixelAvatarProps {
  animal: AnimalType
  size?: number
  className?: string
}

export function PixelAvatar({ animal, size = 64, className = '' }: PixelAvatarProps) {
  const grid = useMemo(() => SPRITES[animal].map(row => row.split('')), [animal])
  const palette = PALETTES[animal]

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
        {grid.map((row, y) =>
          row.map((char, x) => {
            if (char === '.') return null
            const color = palette[char as keyof typeof palette]
            if (!color) return null
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
              />
            )
          })
        )}
      </svg>
    </div>
  )
}
