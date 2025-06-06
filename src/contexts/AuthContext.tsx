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
      
      if (token) {
        // APIエンドポイントで認証状態を確認
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } else {
          // トークンが無効な場合
          Cookies.remove('auth-token')
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
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
      // APIエンドポイントにログインリクエストを送信
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'ログインに失敗しました')
      }

      // トークンをCookieに保存
      Cookies.set('auth-token', data.token, { expires: 7 }) // 7日間有効
      
      setAuthState({
        user: data.user,
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
