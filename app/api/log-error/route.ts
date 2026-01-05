import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { message, context, stack } = body

        // Print to server terminal with distinct formatting
        console.error('\n\x1b[31m[CLIENT ERROR REPORT]\x1b[0m')
        console.error('Message:', message)
        if (context) console.error('Context:', JSON.stringify(context, null, 2))
        if (stack) console.error('Stack:', stack)
        console.error('\x1b[31m[END REPORT]\x1b[0m\n')

        return NextResponse.json({ success: true })
    } catch (_error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
