'use client'

import { use } from 'react'
import { SharedDashboardLayout } from '@/components/admin/SharedDashboardLayout'
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary'

interface AdminLayoutProps {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}

export default function AdminUserLayout({ children, params }: AdminLayoutProps) {
  const { userId } = use(params)

  return (
    <SharedDashboardLayout userId={userId}>
      <AdminErrorBoundary>
        {children}
      </AdminErrorBoundary>
    </SharedDashboardLayout>
  )
}


