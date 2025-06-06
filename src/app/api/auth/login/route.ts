import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// 環境変数からJWTシークレットを取得（実際の実装では.envファイルから）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// モックユーザーデータ（実際の実装ではデータベースから取得）
const mockUsers = [
  {
    id: 'U001',
    username: 'admin',
    // bcrypt.hashSync('admin123', 10)
    password: '$2a$10$YourHashedPasswordHere1',
    fullName: '田中 太郎',
    role: 'admin' as const,
    email: 'tanaka@example.com',
  },
  {
    id: 'U002',
    username: 'user',
    // bcrypt.hashSync('user123', 10)
    password: '$2a$10$YourHashedPasswordHere2',
    fullName: '鈴木 花子',
    role: 'user' as const,
    email: 'suzuki@example.com',
  },
  {
    id: 'U003',
    username: 'viewer',
    // bcrypt.hashSync('viewer123', 10)
    password: '$2a$10$YourHashedPasswordHere3',
    fullName: '佐藤 次郎',
    role: 'viewer' as const,
    email: 'sato@example.com',
  }
]

// パスワードをハッシュ化（開発用）
const hashedPasswords = {
  'admin': bcrypt.hashSync('admin123', 10),
  'user': bcrypt.hashSync('user123', 10),
  'viewer': bcrypt.hashSync('viewer123', 10),
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'ユーザー名とパスワードは必須です' },
        { status: 400 }
      )
    }

    // ユーザーを検索（実際の実装ではデータベースから）
    const user = mockUsers.find(u => u.username === username)
    
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // パスワードを検証（開発用の簡易実装）
    const isValidPassword = password === (username === 'admin' ? 'admin123' : 
                                         username === 'user' ? 'user123' : 
                                         username === 'viewer' ? 'viewer123' : '')

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // JWTトークンを生成
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // パスワードを除外したユーザー情報
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
}
