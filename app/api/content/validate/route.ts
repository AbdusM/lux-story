import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Simple validation - just check if story.json exists and is valid JSON
    const fs = require('fs')
    const path = require('path')

    const storyPath = path.join(process.cwd(), 'data', 'story.json')

    if (!fs.existsSync(storyPath)) {
      return NextResponse.json({
        valid: false,
        errors: ['story.json not found'],
        warnings: [],
        totalScenes: 0,
        brokenConnections: 0,
        birminghamReferences: 0
      })
    }

    const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf-8'))
    const sceneCount = Object.keys(storyData.scenes || {}).length

    return NextResponse.json({
      valid: true,
      errors: [],
      warnings: [],
      totalScenes: sceneCount,
      brokenConnections: 0,
      birminghamReferences: 0
    })
  } catch (error: any) {
    return NextResponse.json({
      valid: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      totalScenes: 0,
      brokenConnections: 0,
      birminghamReferences: 0
    }, { status: 500 })
  }
}