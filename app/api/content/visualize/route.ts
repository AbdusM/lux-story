import { NextResponse } from 'next/server'
import { VisualStoryFlowAnalyzer } from '@/scripts/visual-story-flow-analyzer'
import path from 'path'

export async function POST() {
  try {
    const analyzer = new VisualStoryFlowAnalyzer()
    const outputPath = path.join(process.cwd(), 'public', 'analysis', `story-flow-${Date.now()}.svg`)

    await analyzer.visualizeConnections(outputPath)

    return NextResponse.json({
      success: true,
      outputPath: outputPath.replace(path.join(process.cwd(), 'public'), '')
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Visual analysis failed: ${error.message}`
    }, { status: 500 })
  }
}