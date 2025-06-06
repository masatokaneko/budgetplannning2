"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials, AuthState } from '@/types/auth'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// モックユーザーデータ（実際の実装ではAPIから取得）
const mockUsers = [
  {
    id: 'U001',
    username: 'admin',
    password: 'admin123', // 実際の実装ではハッシュ化されたパスワード
    fullName: '田中 太郎',
    role: 'admin' as const,
    email: 'tanaka@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'U002',
    username: 'user',
    password: 'user123',
    fullName: '鈴木 花子',
    role: 'user' as const,
    email: 'suzuki@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'U003',
    username: 'viewer',
    password: 'viewer123',
    fullName: '佐藤 次郎',
    role: 'viewer' as const,
    email: 'sato@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  // 初回マウント時に認証状態をチェック
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('auth-token')
      const userStr = Cookies.get('user')
      
      if (token && userStr) {
        const user = JSON.parse(userStr)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: '認証状態の確認に失敗しました'
      })
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // モックログイン処理（実際の実装ではAPIを呼び出す）
      const user = mockUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      )
      
      if (!user) {
        throw new Error('ユーザー名またはパスワードが正しくありません')
      }

      // パスワードを除外したユーザー情報
      const { password, ...userWithoutPassword } = user
      
      // トークンを生成（実際の実装ではサーバーから取得）
      const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }))
      
      // Cookieに保存
      Cookies.set('auth-token', token, { expires: 7 }) // 7日間有効
      Cookies.set('user', JSON.stringify(userWithoutPassword), { expires: 7 })
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
      
      // ダッシュボードにリダイレクト
      router.push('/dashboard')
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'ログインに失敗しました'
      })
    }
  }

  const logout = () => {
    // Cookieをクリア
    Cookies.remove('auth-token')
    Cookies.remove('user')
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
    
    // ログインページにリダイレクト
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
