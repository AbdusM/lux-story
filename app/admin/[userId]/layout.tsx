'use client'

import { use } from 'react'
import { SharedDashboardLayout } from '@/components/admin/SharedDashboardLayout'

interface AdminLayoutProps {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}

export default function AdminUserLayout({ children, params }: AdminLayoutProps) {
  const { userId } = use(params)
  
  return (
    <SharedDashboardLayout userId={userId}>
      {children}
    </SharedDashboardLayout>
  )
}


