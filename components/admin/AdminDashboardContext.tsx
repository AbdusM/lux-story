'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'

interface AdminDashboardContextValue {
  profile: SkillProfile | null
  adminViewMode: 'family' | 'research'
  setAdminViewMode: (mode: 'family' | 'research') => void
  loading: boolean
}

const AdminDashboardContext = createContext<AdminDashboardContextValue | undefined>(undefined)

export function AdminDashboardProvider({
  children,
  value,
}: {
  children: ReactNode
  value: AdminDashboardContextValue
}) {
  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  )
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext)
  if (context === undefined) {
    throw new Error('useAdminDashboard must be used within AdminDashboardProvider')
  }
  return context
}

