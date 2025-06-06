"use client"

import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { AuthGuard } from '@/components/auth/AuthGuard'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
  allowedRoles?: Array<'admin' | 'user' | 'viewer'>
}

export function AuthenticatedLayout({ children, allowedRoles }: AuthenticatedLayoutProps) {
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
