import { NextResponse } from 'next/server'
import { StoryStreamliner } from '@/scripts/story-streamliner'

export async function POST(request: Request) {
  try {
    const { dryRun = true } = await request.json()

    const streamliner = new StoryStreamliner()

    // Create a readable stream for progress updates
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    // Start streamlining in background
    streamliner.streamlineStory({
      dryRun,
      verbose: true,
      onProgress: (update) => {
        writer.write(JSON.stringify(update) + '\n')
      }
    }).then(result => {
      writer.write(JSON.stringify({
        stage: 'completed',
        progress: 100,
        results: result
      }) + '\n')
      writer.close()
    }).catch(error => {
      writer.write(JSON.stringify({
        stage: 'error',
        progress: 0,
        error: error.message
      }) + '\n')
      writer.close()
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: `Streamlining failed: ${error.message}` }, { status: 500 })
  }
}