"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Cell } from "recharts"
import { ArrowDown, ArrowRight, ArrowUp, BarChart3, Calculator, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// 仮データ
const monthlyData = [
  { month: "4月", budget: 1200, actual: 1100 },
  { month: "5月", budget: 1300, actual: 1250 },
  { month: "6月", budget: 1400, actual: 1500 },
  { month: "7月", budget: 1500, actual: 1600 },
  { month: "8月", budget: 1600, actual: 1400 },
  { month: "9月", budget: 1700, actual: 1650 },
  { month: "10月", budget: 1800, actual: 1750 },
  { month: "11月", budget: 1900, actual: 0 },
  { month: "12月", budget: 2000, actual: 0 },
  { month: "1月", budget: 1800, actual: 0 },
  { month: "2月", budget: 1700, actual: 0 },
  { month: "3月", budget: 1600, actual: 0 },
]

const currentMonth = "10月"
const currentMonthData = monthlyData.find((item) => item.month === currentMonth) || { budget: 0, actual: 0 }
const difference = currentMonthData.actual - currentMonthData.budget
const achievementRate =
  currentMonthData.budget > 0 ? Math.round((currentMonthData.actual / currentMonthData.budget) * 100) : 0

const totalBudget = monthlyData.reduce((sum, item) => sum + item.budget, 0)
const totalActual = monthlyData.reduce((sum, item) => sum + item.actual, 0)
const progressPercentage = Math.round((totalActual / totalBudget) * 100)

const categoryDifferences = [
  { category: "人件費", difference: -120, budget: 1000, actual: 880 },
  { category: "広告宣伝費", difference: 80, budget: 500, actual: 580 },
  { category: "旅費交通費", difference: -50, budget: 300, actual: 250 },
  { category: "通信費", difference: 30, budget: 200, actual: 230 },
  { category: "消耗品費", difference: -20, budget: 150, actual: 130 },
]

export function DashboardContent() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">ダッシュボード</h2>
        <div className="text-sm text-gray-500">最終更新: 2024年10月15日 09:30</div>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="bg-blue-50 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">当月予算額</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{currentMonthData.budget.toLocaleString()} 万円</div>
            <p className="text-xs text-gray-500">{currentMonth}</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 shadow-sm">
          <CardHeader className="bg-green-50 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">当月実績額</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{currentMonthData.actual.toLocaleString()} 万円</div>
            <p className="text-xs text-gray-500">{currentMonth}</p>
          </CardContent>
        </Card>

        <Card className={`border-${difference >= 0 ? "green" : "red"}-100 shadow-sm`}>
          <CardHeader className={`bg-${difference >= 0 ? "green" : "red"}-50 pb-2`}>
            <CardTitle className={`text-sm font-medium text-${difference >= 0 ? "green" : "red"}-700`}>
              当月差異額
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              {difference > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : difference < 0 ? (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={`text-2xl font-bold ${difference > 0 ? "text-green-600" : difference < 0 ? "text-red-600" : "text-gray-900"}`}
              >
                {Math.abs(difference).toLocaleString()} 万円
              </span>
            </div>
            <p className="text-xs text-gray-500">{currentMonth}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="bg-purple-50 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">予算達成率</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${achievementRate >= 100 ? "text-green-600" : "text-amber-600"}`}>
                {achievementRate}%
              </span>
            </div>
            <p className="text-xs text-gray-500">{currentMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* メインチャート */}
        <Card className="col-span-1 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">月別予実対比</CardTitle>
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-sm bg-blue-500"></div>
                <span>予算</span>
              </div>
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-sm bg-green-500"></div>
                <span>実績</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                budget: {
                  label: "予算",
                  color: "hsl(var(--chart-1))",
                },
                actual: {
                  label: "実績",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barGap={0}
                  barCategoryGap={10}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}`}
                    label={{ value: "万円", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="budget"
                    fill="var(--color-budget)"
                    name="予算"
                    radius={[4, 4, 0, 0]}
                    onClick={(data) => setSelectedMonth(data.month)}
                  />
                  <Bar
                    dataKey="actual"
                    fill="var(--color-actual)"
                    name="実績"
                    radius={[4, 4, 0, 0]}
                    onClick={(data) => setSelectedMonth(data.month)}
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.month === selectedMonth ? "#ffc658" : "var(--color-actual)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 右サイドパネル */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">年間予算進捗</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>進捗率</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>実績: {totalActual.toLocaleString()} 万円</span>
                <span>予算: {totalBudget.toLocaleString()} 万円</span>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium">主要科目別差異ランキング</h4>
              <div className="space-y-3">
                {categoryDifferences.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <div
                      className={`flex items-center text-sm ${item.difference > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.difference > 0 ? (
                        <ArrowUp className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(item.difference).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-1 text-sm font-medium">最新の実績取込</h4>
              <p className="text-xs text-gray-500">2024年10月15日 08:45</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* アクションボタン */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Calculator className="h-4 w-4" />
          予算を策定する
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        <Button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
          <Upload className="h-4 w-4" />
          実績を取り込む
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        <Button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700">
          <BarChart3 className="h-4 w-4" />
          詳細分析を見る
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
