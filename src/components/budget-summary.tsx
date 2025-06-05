"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 月の順序を12月から始めるように変更
const months = ["12月", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月"]

interface BudgetItem {
  id: string
  supplier: string
  inputMethod: "direct" | "employee" | "sales"
  baseValue: number
  monthlyValues: number[]
}

interface BudgetSummaryProps {
  costOfSales: { [key: string]: BudgetItem[] }
  sellingExpenses: { [key: string]: BudgetItem[] }
  salesAmount: number[]
}

export function BudgetSummary({ costOfSales, sellingExpenses, salesAmount }: BudgetSummaryProps) {
  // 新しいデータ構造に対応した計算関数
  const calculateCategoryTotal = (data: { [key: string]: BudgetItem[] }) => {
    return Object.values(data).reduce((total, items) => {
      return (
        total +
        items.reduce((itemTotal, item) => {
          return itemTotal + item.monthlyValues.reduce((sum, value) => sum + value, 0)
        }, 0)
      )
    }, 0)
  }

  const calculateMonthlyTotal = (data: { [key: string]: BudgetItem[] }, monthIndex: number) => {
    return Object.values(data).reduce((total, items) => {
      return (
        total +
        items.reduce((itemTotal, item) => {
          return itemTotal + (item.monthlyValues[monthIndex] || 0)
        }, 0)
      )
    }, 0)
  }

  // 勘定科目ごとの月別合計を計算
  const calculateAccountMonthlyTotal = (data: { [key: string]: BudgetItem[] }, account: string, monthIndex: number) => {
    return (
      data[account]?.reduce((total, item) => {
        return total + (item.monthlyValues[monthIndex] || 0)
      }, 0) || 0
    )
  }

  // 各カテゴリの合計計算
  const totalCostOfSales = calculateCategoryTotal(costOfSales)
  const totalSellingExpenses = calculateCategoryTotal(sellingExpenses)
  const totalSales = salesAmount.reduce((sum, amount) => sum + amount, 0)
  const totalExpenses = totalCostOfSales + totalSellingExpenses
  const grossProfit = totalSales - totalCostOfSales
  const operatingProfit = grossProfit - totalSellingExpenses

  // 前年同期比較用のダミーデータ
  const lastYearSales = salesAmount.map((amount) => amount * 0.95)
  const lastYearCostOfSalesMonthly = months.map((_, index) => calculateMonthlyTotal(costOfSales, index) * 0.98)
  const lastYearSellingExpensesMonthly = months.map((_, index) => calculateMonthlyTotal(sellingExpenses, index) * 0.97)

  // 前年同期比較用の明細科目データ（モック）
  const lastYearCostOfSalesDetail: { [key: string]: number[] } = {}
  Object.keys(costOfSales).forEach((account) => {
    lastYearCostOfSalesDetail[account] = months.map(
      (_, index) => calculateAccountMonthlyTotal(costOfSales, account, index) * 0.98,
    )
  })

  const lastYearSellingExpensesDetail: { [key: string]: number[] } = {}
  Object.keys(sellingExpenses).forEach((account) => {
    lastYearSellingExpensesDetail[account] = months.map(
      (_, index) => calculateAccountMonthlyTotal(sellingExpenses, account, index) * 0.97,
    )
  })

  // 予算進捗の計算（仮想的な実績データ）
  const currentProgress = Math.min(75, (totalSales / Math.max(totalSales, 1)) * 100)

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* 月別サマリー */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">月別サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">勘定科目</th>
                  {months.map((month) => (
                    <th key={month} className="py-2 px-3 text-center text-xs font-medium text-gray-600">
                      {month}
                    </th>
                  ))}
                  <th className="py-2 px-3 text-center text-xs font-medium text-gray-600">年間合計</th>
                </tr>
              </thead>
              <tbody>
                {/* 売上高 */}
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm font-medium">売上高</td>
                  {months.map((month, index) => (
                    <td key={month} className="py-2 px-3 text-right text-sm">
                      {(salesAmount[index] || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right text-sm font-medium">
                    {salesAmount.reduce((sum, amount) => sum + amount, 0).toLocaleString()}
                  </td>
                </tr>

                {/* 売上原価 */}
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm font-medium">売上原価</td>
                  {months.map((month, index) => (
                    <td key={month} className="py-2 px-3 text-right text-sm">
                      {calculateMonthlyTotal(costOfSales, index).toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right text-sm font-medium">
                    {calculateCategoryTotal(costOfSales).toLocaleString()}
                  </td>
                </tr>

                {/* 販管費 */}
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm font-medium">販管費</td>
                  {months.map((month, index) => (
                    <td key={month} className="py-2 px-3 text-right text-sm">
                      {calculateMonthlyTotal(sellingExpenses, index).toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right text-sm font-medium">
                    {calculateCategoryTotal(sellingExpenses).toLocaleString()}
                  </td>
                </tr>

                {/* 営業利益 */}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-2 px-3 text-sm font-medium">営業利益</td>
                  {months.map((month, index) => {
                    const monthlyOperatingProfit =
                      (salesAmount[index] || 0) -
                      calculateMonthlyTotal(costOfSales, index) -
                      calculateMonthlyTotal(sellingExpenses, index)
                    return (
                      <td
                        key={month}
                        className={`py-2 px-3 text-right text-sm font-medium ${monthlyOperatingProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {monthlyOperatingProfit.toLocaleString()}
                      </td>
                    )
                  })}
                  <td
                    className={`py-2 px-3 text-right text-sm font-bold ${operatingProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {operatingProfit.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 年間合計・前年比較 */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">年間合計・前年比較</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* 売上高 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">売上高</span>
              <div className="text-right">
                <div className="text-lg font-bold">{totalSales.toLocaleString()} 万円</div>
                <div
                  className={`text-xs ${totalSales - lastYearSales.reduce((sum, val) => sum + val, 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  前年比{" "}
                  {(
                    ((totalSales - lastYearSales.reduce((sum, val) => sum + val, 0)) /
                      Math.max(
                        lastYearSales.reduce((sum, val) => sum + val, 0),
                        1,
                      )) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>

            {/* 売上原価 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">売上原価</span>
              <div className="text-right">
                <div className="text-lg font-bold">{totalCostOfSales.toLocaleString()} 万円</div>
                <div className="text-xs text-gray-500">
                  売上原価率 {totalSales > 0 ? ((totalCostOfSales / totalSales) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            {/* 販管費 */}
            <div className="flex items-center justify-between">
              <span className="text-sm">販管費</span>
              <div className="text-right">
                <div className="text-lg font-bold">{totalSellingExpenses.toLocaleString()} 万円</div>
                <div className="text-xs text-gray-500">
                  販管費率 {totalSales > 0 ? ((totalSellingExpenses / totalSales) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            {/* 営業利益 */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">営業利益</span>
                <div className="text-right">
                  <div className={`text-xl font-bold ${operatingProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {operatingProfit.toLocaleString()} 万円
                  </div>
                  <div className="text-xs text-gray-500">
                    営業利益率 {totalSales > 0 ? ((operatingProfit / totalSales) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 予算進捗と前年実績 */}
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>予算進捗</span>
                <span>{currentProgress.toFixed(0)}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>前年実績: {lastYearSales.reduce((sum, val) => sum + val, 0).toLocaleString()} 万円</div>
              <div>予算達成まで: {Math.max(0, totalSales * 0.25).toLocaleString()} 万円</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 前年同期比較（明細科目別） */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">前年同期比較</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cost-of-sales">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cost-of-sales">売上原価</TabsTrigger>
              <TabsTrigger value="selling-expenses">販管費</TabsTrigger>
              <TabsTrigger value="summary">サマリー</TabsTrigger>
            </TabsList>

            {/* 売上原価の明細科目 */}
            <TabsContent value="cost-of-sales" className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">勘定科目</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">明細科目</th>
                      {months.map((month) => (
                        <th key={month} className="py-2 px-3 text-center text-xs font-medium text-gray-600">
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(costOfSales).map((account) => (
                      <tr key={account} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-sm">売上原価</td>
                        <td className="py-2 px-3 text-sm">{account}</td>
                        {months.map((month, index) => {
                          const currentValue = calculateAccountMonthlyTotal(costOfSales, account, index)
                          const lastYearValue = lastYearCostOfSalesDetail[account]?.[index] || 0
                          const diff = currentValue - lastYearValue
                          const diffRate = lastYearValue !== 0 ? (diff / lastYearValue) * 100 : 0
                          return (
                            <td key={month} className="py-2 px-3 text-right text-xs">
                              <div>{currentValue.toLocaleString()}</div>
                              <div className={`text-xs ${diff >= 0 ? "text-red-600" : "text-green-600"}`}>
                                {diff >= 0 ? "+" : ""}
                                {diff.toLocaleString()} ({diffRate.toFixed(1)}%)
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* 販管費の明細科目 */}
            <TabsContent value="selling-expenses" className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">勘定科目</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">明細科目</th>
                      {months.map((month) => (
                        <th key={month} className="py-2 px-3 text-center text-xs font-medium text-gray-600">
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(sellingExpenses).map((account) => (
                      <tr key={account} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-sm">販管費</td>
                        <td className="py-2 px-3 text-sm">{account}</td>
                        {months.map((month, index) => {
                          const currentValue = calculateAccountMonthlyTotal(sellingExpenses, account, index)
                          const lastYearValue = lastYearSellingExpensesDetail[account]?.[index] || 0
                          const diff = currentValue - lastYearValue
                          const diffRate = lastYearValue !== 0 ? (diff / lastYearValue) * 100 : 0
                          return (
                            <td key={month} className="py-2 px-3 text-right text-xs">
                              <div>{currentValue.toLocaleString()}</div>
                              <div className={`text-xs ${diff >= 0 ? "text-red-600" : "text-green-600"}`}>
                                {diff >= 0 ? "+" : ""}
                                {diff.toLocaleString()} ({diffRate.toFixed(1)}%)
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* サマリー */}
            <TabsContent value="summary" className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">勘定科目</th>
                      {months.map((month) => (
                        <th key={month} className="py-2 px-3 text-center text-xs font-medium text-gray-600">
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 売上高 */}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3 text-sm font-medium">売上高</td>
                      {months.map((month, index) => {
                        const currentValue = salesAmount[index] || 0
                        const lastYearValue = lastYearSales[index] || 0
                        const diff = currentValue - lastYearValue
                        const diffRate = lastYearValue !== 0 ? (diff / lastYearValue) * 100 : 0
                        return (
                          <td key={month} className="py-2 px-3 text-right text-xs">
                            <div>{currentValue.toLocaleString()}</div>
                            <div className={`text-xs ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {diff >= 0 ? "+" : ""}
                              {diff.toLocaleString()} ({diffRate.toFixed(1)}%)
                            </div>
                          </td>
                        )
                      })}
                    </tr>

                    {/* 売上原価 */}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3 text-sm font-medium">売上原価</td>
                      {months.map((month, index) => {
                        const currentValue = calculateMonthlyTotal(costOfSales, index)
                        const lastYearValue = lastYearCostOfSalesMonthly[index] || 0
                        const diff = currentValue - lastYearValue
                        const diffRate = lastYearValue !== 0 ? (diff / lastYearValue) * 100 : 0
                        return (
                          <td key={month} className="py-2 px-3 text-right text-xs">
                            <div>{currentValue.toLocaleString()}</div>
                            <div className={`text-xs ${diff >= 0 ? "text-red-600" : "text-green-600"}`}>
                              {diff >= 0 ? "+" : ""}
                              {diff.toLocaleString()} ({diffRate.toFixed(1)}%)
                            </div>
                          </td>
                        )
                      })}
                    </tr>

                    {/* 販管費 */}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3 text-sm font-medium">販管費</td>
                      {months.map((month, index) => {
                        const currentValue = calculateMonthlyTotal(sellingExpenses, index)
                        const lastYearValue = lastYearSellingExpensesMonthly[index] || 0
                        const diff = currentValue - lastYearValue
                        const diffRate = lastYearValue !== 0 ? (diff / lastYearValue) * 100 : 0
                        return (
                          <td key={month} className="py-2 px-3 text-right text-xs">
                            <div>{currentValue.toLocaleString()}</div>
                            <div className={`text-xs ${diff >= 0 ? "text-red-600" : "text-green-600"}`}>
                              {diff >= 0 ? "+" : ""}
                              {diff.toLocaleString()} ({diffRate.toFixed(1)}%)
                            </div>
                          </td>
                        )
                      })}
                    </tr>

                    {/* 営業利益 */}
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-2 px-3 text-sm font-medium">営業利益</td>
                      {months.map((month, index) => {
                        const currentValue =
                          (salesAmount[index] || 0) -
                          calculateMonthlyTotal(costOfSales, index) -
                          calculateMonthlyTotal(sellingExpenses, index)
                        const lastYearValue =
                          (lastYearSales[index] || 0) -
                          lastYearCostOfSalesMonthly[index] -
                          lastYearSellingExpensesMonthly[index]
                        const diff = currentValue - lastYearValue
                        const diffRate = lastYearValue !== 0 ? (diff / lastYearValue) * 100 : 0
                        return (
                          <td key={month} className="py-2 px-3 text-right text-xs">
                            <div className={currentValue >= 0 ? "text-green-600" : "text-red-600"}>
                              {currentValue.toLocaleString()}
                            </div>
                            <div className={`text-xs ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {diff >= 0 ? "+" : ""}
                              {diff.toLocaleString()} ({diffRate.toFixed(1)}%)
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
