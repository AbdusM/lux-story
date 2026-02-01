import Link from 'next/link'

export default function AdminUserLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { userId: string }
}) {
  const { userId } = params

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Admin</p>
            <h1 className="text-xl font-semibold text-slate-100">User {userId}</h1>
          </div>
          <Link
            href="/admin/users"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Back to users
          </Link>
        </header>
        {children}
      </div>
    </div>
  )
}
