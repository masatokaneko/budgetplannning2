import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// モックユーザーデータ（実際の実装ではデータベースから取得）
const mockUsers = [
  {
    id: 'U001',
    username: 'admin',
    fullName: '田中 太郎',
    role: 'admin' as const,
    email: 'tanaka@example.com',
  },
  {
    id: 'U002',
    username: 'user',
    fullName: '鈴木 花子',
    role: 'user' as const,
    email: 'suzuki@example.com',
  },
  {
    id: 'U003',
    username: 'viewer',
    fullName: '佐藤 次郎',
    role: 'viewer' as const,
    email: 'sato@example.com',
  }
]

export async function GET(request: NextRequest) {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // "Bearer "を除去

    try {
      // トークンを検証
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string
        username: string
        role: string
      }

      // ユーザー情報を取得（実際の実装ではデータベースから）
      const user = mockUsers.find(u => u.id === decoded.userId)

      if (!user) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        )
      }

      return NextResponse.json({ user })

    } catch (jwtError) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: '認証確認中にエラーが発生しました' },
      { status: 500 }
    )
  }
}
