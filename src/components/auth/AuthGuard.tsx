"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: Array<'admin' | 'user' | 'viewer'>
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 未認証の場合はログインページにリダイレクト
      router.push('/login')
    } else if (!isLoading && isAuthenticated && allowedRoles && user) {
      // 権限チェック
      if (!allowedRoles.includes(user.role)) {
        // 権限がない場合はダッシュボードにリダイレクト
        router.push('/dashboard')
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router])

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 未認証
  if (!isAuthenticated) {
    return null
  }

  // 権限チェック
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">アクセス権限がありません</h2>
          <p className="mt-2 text-sm text-gray-600">このページを表示する権限がありません。</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
