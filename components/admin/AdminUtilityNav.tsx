'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ActivitySquare, Compass, LayoutDashboard, Users } from 'lucide-react'

import { cn } from '@/lib/utils'

interface AdminUtilityNavProps {
  userId?: string
  tone?: 'light' | 'dark'
  className?: string
}

const BASE_ITEMS = [
  {
    href: '/admin',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/diagnostics',
    label: 'Diagnostics',
    icon: ActivitySquare,
  },
  {
    href: '/admin/preview',
    label: 'Preview',
    icon: Compass,
  },
] as const

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminUtilityNav({
  userId,
  tone = 'light',
  className,
}: AdminUtilityNavProps) {
  const pathname = usePathname() ?? ''

  const items = [
    ...BASE_ITEMS,
    ...(userId
      ? [
          {
            href: `/admin/${encodeURIComponent(userId)}`,
            label: 'Journey',
            icon: Compass,
          },
        ]
      : []),
  ]

  const shellClasses =
    tone === 'dark'
      ? 'border-slate-800 bg-slate-900/70 text-slate-200'
      : 'border-slate-200 bg-white/80 text-slate-700 shadow-sm'
  const linkClasses =
    tone === 'dark'
      ? 'border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 hover:text-white'
      : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-slate-900'
  const activeClasses =
    tone === 'dark'
      ? 'border-amber-500/60 bg-slate-800 text-white'
      : 'border-blue-300 bg-blue-50 text-slate-900'

  return (
    <nav
      aria-label="Admin utilities"
      className={cn('rounded-2xl border p-2', shellClasses, className)}
    >
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = isActivePath(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                linkClasses,
                isActive && activeClasses,
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
