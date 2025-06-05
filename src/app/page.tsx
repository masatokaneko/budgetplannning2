"use client"
import { BarChart3, Calculator, Home, LogOut, Settings, Upload, User, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BudgetActualChart from '@/components/charts/BudgetActualChart'

const navigationItems = [
  {
    title: "ダッシュボード",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "予算策定",
    url: "/budget-planning",
    icon: Calculator,
  },
  {
    title: "実績取込",
    url: "/actual-import",
    icon: Upload,
  },
  {
    title: "予実分析",
    url: "/analysis",
    icon: BarChart3,
  },
  {
    title: "マスタ管理",
    url: "/master",
    icon: Settings,
  },
]

// サンプルデータ
const sampleData = [
  { month: '1月', budget: 1000000, actual: 950000 },
  { month: '2月', budget: 1100000, actual: 1050000 },
  { month: '3月', budget: 1200000, actual: 1150000 },
  { month: '4月', budget: 1300000, actual: 1250000 },
  { month: '5月', budget: 1400000, actual: 1350000 },
  { month: '6月', budget: 1500000, actual: 1450000 },
]

export default function Component() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">費用予算策定・実績把握</span>
                <span className="text-xs text-gray-500">システム</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                      >
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold text-gray-900">費用予算策定・実績把握システム</h1>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">田中 太郎</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>アカウント</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    プロフィール
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
                <a href="/" className="hover:text-gray-700">
                  ホーム
                </a>
                <span>/</span>
                <span className="text-gray-900">ダッシュボード</span>
              </nav>

              {/* Page Content */}
              <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900">ダッシュボード</h1>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Card
                    title="総予算"
                    value="¥15,000,000"
                    change={5}
                    changeLabel="前年比"
                  />
                  <Card
                    title="総実績"
                    value="¥14,500,000"
                    change={3}
                    changeLabel="前年比"
                  />
                  <Card
                    title="予算消化率"
                    value="96.7%"
                    change={-1.2}
                    changeLabel="前月比"
                  />
                  <Card
                    title="予算差異"
                    value="¥500,000"
                    change={-2.5}
                    changeLabel="前月比"
                  />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">予算実績推移</h2>
                  <BudgetActualChart data={sampleData} />
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
