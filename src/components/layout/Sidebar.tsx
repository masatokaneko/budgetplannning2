import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'ダッシュボード', href: '/' },
  { name: '予算策定', href: '/budget' },
  { name: '実績データ', href: '/actuals' },
  { name: '予実分析', href: '/analysis' },
  { name: 'マスタ管理', href: '/masters' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 