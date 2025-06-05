"use client"

import React from "react"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Printer,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"

// 仮データ
const monthlyTrendData = [
  { month: "4月", budget: 1200, actual: 1100, lastYear: 1050 },
  { month: "5月", budget: 1300, actual: 1250, lastYear: 1180 },
  { month: "6月", budget: 1400, actual: 1500, lastYear: 1320 },
  { month: "7月", budget: 1500, actual: 1600, lastYear: 1450 },
  { month: "8月", budget: 1600, actual: 1400, lastYear: 1380 },
  { month: "9月", budget: 1700, actual: 1650, lastYear: 1520 },
  { month: "10月", budget: 1800, actual: 1750, lastYear: 1680 },
]

const accountAnalysisData = [
  { account: "人件費", budget: 5000, actual: 4800, difference: -200, rate: -4.0, lastYear: 4600 },
  { account: "広告宣伝費", budget: 2000, actual: 2300, difference: 300, rate: 15.0, lastYear: 2100 },
  { account: "旅費交通費", budget: 800, actual: 650, difference: -150, rate: -18.8, lastYear: 720 },
  { account: "通信費", budget: 500, actual: 520, difference: 20, rate: 4.0, lastYear: 480 },
  { account: "消耗品費", budget: 300, actual: 280, difference: -20, rate: -6.7, lastYear: 290 },
]

const supplierCompositionData = [
  { name: "株式会社A", value: 3500, color: "#3b82f6" },
  { name: "株式会社B", value: 2800, color: "#10b981" },
  { name: "株式会社C", value: 1900, color: "#f59e0b" },
  { name: "株式会社D", value: 1200, color: "#ef4444" },
  { name: "その他", value: 1600, color: "#8b5cf6" },
]

interface AnalysisData {
  account: string
  budget: number
  actual: number
  difference: number
  rate: number
  lastYear: number
  suppliers?: {
    name: string
    budget: number
    actual: number
    difference: number
    rate: number
  }[]
  expanded?: boolean
}

export function AnalysisContent() {
  const [period, setPeriod] = useState("current-month")
  const [customPeriod, setCustomPeriod] = useState({
    startYear: "2024",
    startMonth: "4",
    endYear: "2024",
    endMonth: "10",
  })
  const [displayUnit, setDisplayUnit] = useState("10000") // 万円
  const [accountFilter, setAccountFilter] = useState("all")
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [sortField, setSortField] = useState<"account" | "budget" | "actual" | "difference" | "rate">("difference")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [expandedAccounts, setExpandedAccounts] = useState<string[]>([])

  // 詳細データ（取引先含む）
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([
    {
      account: "人件費",
      budget: 5000,
      actual: 4800,
      difference: -200,
      rate: -4.0,
      lastYear: 4600,
      suppliers: [
        { name: "株式会社A", budget: 3000, actual: 2900, difference: -100, rate: -3.3 },
        { name: "株式会社B", budget: 2000, actual: 1900, difference: -100, rate: -5.0 },
      ],
    },
    {
      account: "広告宣伝費",
      budget: 2000,
      actual: 2300,
      difference: 300,
      rate: 15.0,
      lastYear: 2100,
      suppliers: [
        { name: "株式会社C", budget: 1200, actual: 1400, difference: 200, rate: 16.7 },
        { name: "株式会社D", budget: 800, actual: 900, difference: 100, rate: 12.5 },
      ],
    },
    {
      account: "旅費交通費",
      budget: 800,
      actual: 650,
      difference: -150,
      rate: -18.8,
      lastYear: 720,
      suppliers: [
        { name: "個人E", budget: 400, actual: 320, difference: -80, rate: -20.0 },
        { name: "個人F", budget: 400, actual: 330, difference: -70, rate: -17.5 },
      ],
    },
  ])

  // 表示単位の変換
  const formatAmount = (amount: number) => {
    const unit = Number(displayUnit)
    const converted = amount / unit
    return converted.toLocaleString()
  }

  // 単位表示
  const getUnitLabel = () => {
    switch (displayUnit) {
      case "1":
        return "円"
      case "1000":
        return "千円"
      case "10000":
        return "万円"
      default:
        return "万円"
    }
  }

  // 期間表示ラベルの取得
  const getPeriodLabel = () => {
    switch (period) {
      case "current-month":
        return "2024年10月"
      case "quarter":
        return "2024年Q3"
      case "year":
        return "2024年度"
      case "custom":
        return `${customPeriod.startYear}年${customPeriod.startMonth}月～${customPeriod.endYear}年${customPeriod.endMonth}月`
      default:
        return "2024年10月"
    }
  }

  // ソート処理
  const sortedData = [...analysisData].sort((a, b) => {
    let aValue: number, bValue: number

    switch (sortField) {
      case "budget":
        aValue = a.budget
        bValue = b.budget
        break
      case "actual":
        aValue = a.actual
        bValue = b.actual
        break
      case "difference":
        aValue = Math.abs(a.difference)
        bValue = Math.abs(b.difference)
        break
      case "rate":
        aValue = Math.abs(a.rate)
        bValue = Math.abs(b.rate)
        break
      default:
        return a.account.localeCompare(b.account)
    }

    return sortDirection === "desc" ? bValue - aValue : aValue - bValue
  })

  // 行の展開/折りたたみ
  const toggleExpand = (account: string) => {
    setExpandedAccounts((prev) => (prev.includes(account) ? prev.filter((a) => a !== account) : [...prev, account]))
  }

  // サマリー計算
  const totalBudget = analysisData.reduce((sum, item) => sum + item.budget, 0)
  const totalActual = analysisData.reduce((sum, item) => sum + item.actual, 0)
  const totalDifference = totalActual - totalBudget
  const totalDifferenceRate = totalBudget > 0 ? (totalDifference / totalBudget) * 100 : 0
  const achievementRate = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0

  // エクスポート機能
  const handleExcelExport = () => {
    console.log("Excelエクスポート実行")
  }

  const handlePrintReport = () => {
    console.log("レポート印刷実行")
  }

  const handleDetailedAnalysis = () => {
    console.log("詳細分析画面へ遷移")
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">予実分析</h2>
          <p className="text-sm text-gray-500">予算と実績の対比分析を行います</p>
        </div>
        <Badge variant="outline" className="text-sm">
          最終更新: 2024年10月15日 16:30
        </Badge>
      </div>

      {/* 条件設定エリア */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            分析条件
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>期間選択</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">当月</SelectItem>
                  <SelectItem value="quarter">四半期</SelectItem>
                  <SelectItem value="year">年間</SelectItem>
                  <SelectItem value="custom">期間指定</SelectItem>
                </SelectContent>
              </Select>

              {period === "custom" && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">開始</Label>
                    <div className="flex gap-1">
                      <Select
                        value={customPeriod.startYear}
                        onValueChange={(value) => setCustomPeriod((prev) => ({ ...prev, startYear: value }))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2022">2022年</SelectItem>
                          <SelectItem value="2023">2023年</SelectItem>
                          <SelectItem value="2024">2024年</SelectItem>
                          <SelectItem value="2025">2025年</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={customPeriod.startMonth}
                        onValueChange={(value) => setCustomPeriod((prev) => ({ ...prev, startMonth: value }))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1}月
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">終了</Label>
                    <div className="flex gap-1">
                      <Select
                        value={customPeriod.endYear}
                        onValueChange={(value) => setCustomPeriod((prev) => ({ ...prev, endYear: value }))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2022">2022年</SelectItem>
                          <SelectItem value="2023">2023年</SelectItem>
                          <SelectItem value="2024">2024年</SelectItem>
                          <SelectItem value="2025">2025年</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={customPeriod.endMonth}
                        onValueChange={(value) => setCustomPeriod((prev) => ({ ...prev, endMonth: value }))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1}月
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>表示単位</Label>
              <Select value={displayUnit} onValueChange={setDisplayUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">円</SelectItem>
                  <SelectItem value="1000">千円</SelectItem>
                  <SelectItem value="10000">万円</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>科目フィルター</Label>
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全科目</SelectItem>
                  <SelectItem value="cost-of-sales">売上原価のみ</SelectItem>
                  <SelectItem value="selling-expenses">販管費のみ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>取引先フィルター</Label>
              <div className="flex gap-2">
                <Input placeholder="取引先名で検索" className="flex-1" />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="bg-blue-50 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              総予算額
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              {formatAmount(totalBudget)} {getUnitLabel()}
            </div>
            <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 shadow-sm">
          <CardHeader className="bg-green-50 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              総実績額
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              {formatAmount(totalActual)} {getUnitLabel()}
            </div>
            <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card className={`border-${totalDifference >= 0 ? "green" : "red"}-100 shadow-sm`}>
          <CardHeader className={`bg-${totalDifference >= 0 ? "green" : "red"}-50 pb-2`}>
            <CardTitle
              className={`text-sm font-medium text-${totalDifference >= 0 ? "green" : "red"}-700 flex items-center gap-2`}
            >
              {totalDifference >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              総差異額
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className={`text-2xl font-bold ${totalDifference >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalDifference >= 0 ? "+" : ""}
              {formatAmount(totalDifference)} {getUnitLabel()}
            </div>
            <p className={`text-xs ${totalDifference >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalDifferenceRate >= 0 ? "+" : ""}
              {totalDifferenceRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="bg-purple-50 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              予算達成率
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className={`text-2xl font-bold ${achievementRate >= 100 ? "text-green-600" : "text-amber-600"}`}>
              {achievementRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">{getPeriodLabel()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* メインテーブル */}
        <Card className="col-span-1 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">予実対比詳細</CardTitle>
              <div className="flex items-center gap-2">
                <Label className="text-xs">並び順:</Label>
                <Select value={sortField} onValueChange={(value: any) => setSortField(value)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">科目名</SelectItem>
                    <SelectItem value="budget">予算額</SelectItem>
                    <SelectItem value="actual">実績額</SelectItem>
                    <SelectItem value="difference">差異額</SelectItem>
                    <SelectItem value="rate">差異率</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                >
                  {sortDirection === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">科目/取引先</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">予算額({getUnitLabel()})</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">実績額({getUnitLabel()})</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">差異額({getUnitLabel()})</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">差異率</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">前年同期</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item, index) => (
                    <React.Fragment key={item.account}>
                      {/* 科目行 */}
                      <tr
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          Math.abs(item.rate) > 10 ? "bg-yellow-50" : ""
                        }`}
                        onClick={() => toggleExpand(item.account)}
                      >
                        <td className="py-2 px-3 text-sm font-medium flex items-center gap-2">
                          {item.suppliers &&
                            item.suppliers.length > 0 &&
                            (expandedAccounts.includes(item.account) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            ))}
                          {item.account}
                          {Math.abs(item.rate) > 10 && (
                            <Badge variant="outline" className="text-xs">
                              要注意
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right text-sm">{formatAmount(item.budget)}</td>
                        <td className="py-2 px-3 text-right text-sm">{formatAmount(item.actual)}</td>
                        <td
                          className={`py-2 px-3 text-right text-sm font-medium ${
                            item.difference > 0
                              ? "text-green-600"
                              : item.difference < 0
                                ? "text-red-600"
                                : "text-gray-900"
                          }`}
                        >
                          {item.difference > 0 ? "+" : ""}
                          {formatAmount(item.difference)}
                        </td>
                        <td
                          className={`py-2 px-3 text-right text-sm font-medium ${
                            item.rate > 0 ? "text-green-600" : item.rate < 0 ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {item.rate > 0 ? "+" : ""}
                          {item.rate.toFixed(1)}%
                        </td>
                        <td className="py-2 px-3 text-right text-sm text-gray-600">{formatAmount(item.lastYear)}</td>
                      </tr>

                      {/* 取引先行 */}
                      {expandedAccounts.includes(item.account) &&
                        item.suppliers?.map((supplier, supplierIndex) => (
                          <tr key={`${item.account}-${supplier.name}`} className="border-b border-gray-50 bg-gray-25">
                            <td className="py-2 px-3 pl-8 text-sm text-gray-600">└ {supplier.name}</td>
                            <td className="py-2 px-3 text-right text-sm text-gray-600">
                              {formatAmount(supplier.budget)}
                            </td>
                            <td className="py-2 px-3 text-right text-sm text-gray-600">
                              {formatAmount(supplier.actual)}
                            </td>
                            <td
                              className={`py-2 px-3 text-right text-sm ${
                                supplier.difference > 0
                                  ? "text-green-600"
                                  : supplier.difference < 0
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {supplier.difference > 0 ? "+" : ""}
                              {formatAmount(supplier.difference)}
                            </td>
                            <td
                              className={`py-2 px-3 text-right text-sm ${
                                supplier.rate > 0
                                  ? "text-green-600"
                                  : supplier.rate < 0
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {supplier.rate > 0 ? "+" : ""}
                              {supplier.rate.toFixed(1)}%
                            </td>
                            <td className="py-2 px-3 text-right text-sm text-gray-600">-</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 分析チャート */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">分析チャート</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trend" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trend" className="text-xs">
                  月別推移
                </TabsTrigger>
                <TabsTrigger value="account" className="text-xs">
                  科目別差異
                </TabsTrigger>
                <TabsTrigger value="supplier" className="text-xs">
                  取引先構成
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trend">
                <ChartContainer
                  config={{
                    budget: { label: "予算", color: "hsl(var(--chart-1))" },
                    actual: { label: "実績", color: "hsl(var(--chart-2))" },
                    lastYear: { label: "前年", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="budget" stroke="var(--color-budget)" strokeWidth={2} />
                      <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="lastYear"
                        stroke="var(--color-lastYear)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="account">
                <ChartContainer
                  config={{
                    difference: { label: "差異額", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={accountAnalysisData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="account" type="category" tick={{ fontSize: 10 }} width={60} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="difference" fill="var(--color-difference)">
                        {accountAnalysisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.difference > 0 ? "#10b981" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="supplier">
                <ChartContainer
                  config={{
                    value: { label: "金額", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={supplierCompositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {supplierCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-2 space-y-1">
                  {supplierCompositionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span>{formatAmount(item.value)}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* アクションボタン */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={handleExcelExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Excelエクスポート
            </Button>
            <Button variant="outline" onClick={handlePrintReport} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              レポート印刷
            </Button>
            <Button variant="outline" onClick={handleDetailedAnalysis} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              詳細分析
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
