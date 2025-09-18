import { NextResponse } from 'next/server'
import { StoryValidator } from '@/scripts/story-validator'
import { LuxStoryContext } from '@/scripts/lux-story-context'

export async function POST() {
  try {
    const context = LuxStoryContext.getInstance()
    await context.initialize()

    const validator = new StoryValidator()
    const result = await validator.validateStory()

    return NextResponse.json({
      valid: result.isValid,
      totalScenes: result.stats?.totalScenes || 0,
      brokenConnections: result.errors.filter(e => e.includes('connection')).length,
      birminghamReferences: result.stats?.birminghamReferences || 0,
      errors: result.errors,
      warnings: result.warnings
    })
  } catch (error: any) {
    return NextResponse.json({
      error: `Validation failed: ${error.message}`,
      valid: false,
      totalScenes: 0,
      brokenConnections: 0,
      birminghamReferences: 0,
      errors: [error.message],
      warnings: []
    }, { status: 500 })
  }
}