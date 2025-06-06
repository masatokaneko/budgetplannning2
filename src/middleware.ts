import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 認証が不要なパス
const publicPaths = ['/login', '/api/auth/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 公開パスの場合は認証チェックをスキップ
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 通常のページアクセスの場合
  const token = request.cookies.get('auth-token')

  if (!token && !pathname.startsWith('/login')) {
    // 未認証の場合はログインページにリダイレクト
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
