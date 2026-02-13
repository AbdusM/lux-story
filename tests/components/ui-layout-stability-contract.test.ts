import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'
import { CHOICE_CONTAINER_HEIGHT } from '@/lib/ui-constants'

describe('UI layout stability contracts', () => {
  it('choice container height config includes minimum-height guards', () => {
    expect(CHOICE_CONTAINER_HEIGHT.mobileSm).toContain('min-h-')
    expect(CHOICE_CONTAINER_HEIGHT.mobile).toContain('min-h-')
    expect(CHOICE_CONTAINER_HEIGHT.tablet).toContain('min-h-')
  })

  it('marquee borders are limited to high-salience choices', () => {
    const filePath = path.join(process.cwd(), 'components/GameChoices.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')

    expect(content).toContain("(choice.pivotal || choice.feedback === 'glow') && 'marquee-border'")
  })

  it('main runtime container does not stack an extra full-frame border/shadow', () => {
    const filePath = path.join(process.cwd(), 'components/StatefulGameInterface.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')

    expect(content).toContain('className="relative z-10 flex flex-col min-h-[100dvh] w-full max-w-xl mx-auto bg-black/10"')
    expect(content).not.toContain('max-w-xl mx-auto shadow-2xl border-x border-white/5 bg-black/10')
  })
})
