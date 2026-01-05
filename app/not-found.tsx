import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 font-mono">
            <h2 className="text-4xl mb-4">Not Found</h2>
            <p className="mb-8">Could not find requested resource</p>
            <Link href="/" className="px-4 py-2 border border-amber-500 rounded hover:bg-amber-500/10 transition-colors">
                Return Home
            </Link>
        </div>
    )
}
