"use client"

import { useState } from "react"
import { XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Calendar,
  Download,
  Edit3,
  FileText,
  Printer,
  Save,
  User,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"

// 仮データ
const reportData = {
  period: "2024年4月～2024年10月",
  createdAt: "2024年10月15日 16:45",
  createdBy: "田中 太郎",
  summary: {
    totalBudget: 11000,
    totalActual: 10750,
    totalDifference: -250,
    totalDifferenceRate: -2.3,
  },
  topVariances: [
    { account: "旅費交通費", difference: -150, rate: -18.8, impact: "high" },
    { account: "広告宣伝費", difference: 300, rate: 15.0, impact: "high" },
    { account: "人件費", difference: -200, rate: -4.0, impact: "medium" },
    { account: "通信費", difference: 20, rate: 4.0, impact: "low" },
    { account: "消耗品費", difference: -20, rate: -6.7, impact: "low" },
  ],
  accountDetails: [
    {
      account: "人件費",
      budget: 5000,
      actual: 4800,
      difference: -200,
      rate: -4.0,
      suppliers: [
        { name: "株式会社A", budget: 3000, actual: 2900, difference: -100, rate: -3.3 },
        { name: "株式会社B", budget: 2000, actual: 1900, difference: -100, rate: -5.0 },
      ],
      monthlyData: [
        { month: "4月", budget: 714, actual: 686 },
        { month: "5月", budget: 714, actual: 686 },
        { month: "6月", budget: 714, actual: 686 },
        { month: "7月", budget: 714, actual: 686 },
        { month: "8月", budget: 714, actual: 686 },
        { month: "9月", budget: 714, actual: 686 },
        { month: "10月", budget: 716, actual: 684 },
      ],
    },
    {
      account: "広告宣伝費",
      budget: 2000,
      actual: 2300,
      difference: 300,
      rate: 15.0,
      suppliers: [
        { name: "株式会社C", budget: 1200, actual: 1400, difference: 200, rate: 16.7 },
        { name: "株式会社D", budget: 800, actual: 900, difference: 100, rate: 12.5 },
      ],
      monthlyData: [
        { month: "4月", budget: 286, actual: 329 },
        { month: "5月", budget: 286, actual: 329 },
        { month: "6月", budget: 286, actual: 329 },
        { month: "7月", budget: 286, actual: 329 },
        { month: "8月", budget: 286, actual: 329 },
        { month: "9月", budget: 286, actual: 329 },
        { month: "10月", budget: 284, actual: 327 },
      ],
    },
    {
      account: "旅費交通費",
      budget: 800,
      actual: 650,
      difference: -150,
      rate: -18.8,
      suppliers: [
        { name: "個人E", budget: 400, actual: 320, difference: -80, rate: -20.0 },
        { name: "個人F", budget: 400, actual: 330, difference: -70, rate: -17.5 },
      ],
      monthlyData: [
        { month: "4月", budget: 114, actual: 93 },
        { month: "5月", budget: 114, actual: 93 },
        { month: "6月", budget: 114, actual: 93 },
        { month: "7月", budget: 114, actual: 93 },
        { month: "8月", budget: 114, actual: 93 },
        { month: "9月", budget: 114, actual: 93 },
        { month: "10月", budget: 116, actual: 92 },
      ],
    },
  ],
}

interface CommentData {
  [key: string]: {
    analysis: string
    action: string
  }
}

export function DetailedReportContent() {
  const [comments, setComments] = useState<CommentData>({
    人件費: {
      analysis: "採用計画の遅れにより、予定していた人員増強が実現できなかった。",
      action: "来月より積極的な採用活動を実施し、年度末までに計画人員を確保する。",
    },
    広告宣伝費: {
      analysis: "新商品のプロモーション強化により、当初予算を上回る投資を実施。",
      action: "効果測定を行い、ROIの高い施策に予算を集中させる。",
    },
    旅費交通費: {
      analysis: "リモートワークの浸透により、出張頻度が大幅に減少。",
      action: "削減分を他の成長投資に振り向けることを検討する。",
    },
  })

  const [isEditing, setIsEditing] = useState(false)

  // コメント更新
  const updateComment = (account: string, field: "analysis" | "action", value: string) => {
    setComments((prev) => ({
      ...prev,
      [account]: {
        ...prev[account],
        [field]: value,
      },
    }))
  }

  // 印刷機能
  const handlePrint = () => {
    window.print()
  }

  // PDF出力
  const handlePdfExport = () => {
    console.log("PDF出力実行")
    // 実際の実装では、html2pdf.jsやjsPDFなどを使用
  }

  // Excel出力
  const handleExcelExport = () => {
    console.log("Excel出力実行")
    // 実際の実装では、SheetJSなどを使用
  }

  // コメント保存
  const handleSaveComments = () => {
    console.log("コメント保存:", comments)
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col space-y-6 print:space-y-4">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">詳細レポート</h2>
          <p className="text-sm text-gray-500">予実対比の詳細分析レポートです</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit3 className="h-4 w-4 mr-2" />
            {isEditing ? "編集終了" : "コメント編集"}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveComments}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          )}
        </div>
      </div>

      {/* レポートヘッダー */}
      <Card className="shadow-sm print:shadow-none print:border-0">
        <CardHeader className="text-center border-b print:border-gray-300">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">予実対比詳細レポート</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>対象期間: {reportData.period}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                <span>出力日時: {reportData.createdAt}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span>作成者: {reportData.createdBy}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* サマリーセクション */}
      <Card className="shadow-sm print:shadow-none print:border print:border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg font-medium">1. 全体概況</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg print:bg-gray-50">
              <div className="text-2xl font-bold text-blue-600 print:text-gray-900">
                {reportData.summary.totalBudget.toLocaleString()}万円
              </div>
              <div className="text-sm text-gray-600">総予算額</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg print:bg-gray-50">
              <div className="text-2xl font-bold text-green-600 print:text-gray-900">
                {reportData.summary.totalActual.toLocaleString()}万円
              </div>
              <div className="text-sm text-gray-600">総実績額</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg print:bg-gray-50">
              <div className="text-2xl font-bold text-red-600 print:text-gray-900">
                {reportData.summary.totalDifference.toLocaleString()}万円
              </div>
              <div className="text-sm text-gray-600">総差異額</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg print:bg-gray-50">
              <div className="text-2xl font-bold text-purple-600 print:text-gray-900">
                {reportData.summary.totalDifferenceRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">差異率</div>
            </div>
          </div>

          <Separator className="print:border-gray-300" />

          <div>
            <h3 className="text-base font-medium mb-3">主要差異項目（TOP5）</h3>
            <div className="space-y-2">
              {reportData.topVariances.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-full text-xs font-medium print:bg-gray-100">
                      {index + 1}
                    </span>
                    <span className="font-medium">{item.account}</span>
                    {item.impact === "high" && (
                      <Badge variant="destructive" className="print:bg-gray-200 print:text-gray-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        要注意
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-1 ${item.difference > 0 ? "text-green-600" : "text-red-600"} print:text-gray-900`}
                    >
                      {item.difference > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-medium">
                        {item.difference > 0 ? "+" : ""}
                        {item.difference.toLocaleString()}万円
                      </span>
                    </div>
                    <div
                      className={`text-sm ${item.difference > 0 ? "text-green-600" : "text-red-600"} print:text-gray-600`}
                    >
                      ({item.rate > 0 ? "+" : ""}
                      {item.rate.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 科目別詳細セクション */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">2. 科目別詳細分析</h2>

        {reportData.accountDetails.map((account, index) => (
          <Card
            key={account.account}
            className="shadow-sm print:shadow-none print:border print:border-gray-300 print:break-inside-avoid"
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>
                  2.{index + 1} {account.account}
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={account.difference > 0 ? "default" : "destructive"}
                    className="print:bg-gray-200 print:text-gray-800"
                  >
                    {account.difference > 0 ? "+" : ""}
                    {account.difference.toLocaleString()}万円
                  </Badge>
                  <Badge variant="outline" className="print:border-gray-400">
                    {account.rate > 0 ? "+" : ""}
                    {account.rate.toFixed(1)}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 予実対比表 */}
              <div>
                <h4 className="text-sm font-medium mb-3">予実対比</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-200 print:border-gray-400">
                    <thead>
                      <tr className="bg-gray-50 print:bg-gray-100">
                        <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-600 print:border-gray-400">
                          項目
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-right text-xs font-medium text-gray-600 print:border-gray-400">
                          予算額(万円)
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-right text-xs font-medium text-gray-600 print:border-gray-400">
                          実績額(万円)
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-right text-xs font-medium text-gray-600 print:border-gray-400">
                          差異額(万円)
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-right text-xs font-medium text-gray-600 print:border-gray-400">
                          差異率
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-medium">
                        <td className="border border-gray-200 px-3 py-2 text-sm print:border-gray-400">
                          {account.account} 合計
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-right text-sm print:border-gray-400">
                          {account.budget.toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-right text-sm print:border-gray-400">
                          {account.actual.toLocaleString()}
                        </td>
                        <td
                          className={`border border-gray-200 px-3 py-2 text-right text-sm print:border-gray-400 ${account.difference > 0 ? "text-green-600" : "text-red-600"} print:text-gray-900`}
                        >
                          {account.difference > 0 ? "+" : ""}
                          {account.difference.toLocaleString()}
                        </td>
                        <td
                          className={`border border-gray-200 px-3 py-2 text-right text-sm print:border-gray-400 ${account.rate > 0 ? "text-green-600" : "text-red-600"} print:text-gray-900`}
                        >
                          {account.rate > 0 ? "+" : ""}
                          {account.rate.toFixed(1)}%
                        </td>
                      </tr>
                      {account.suppliers.map((supplier, supplierIndex) => (
                        <tr key={supplierIndex}>
                          <td className="border border-gray-200 px-3 py-2 pl-6 text-sm text-gray-600 print:border-gray-400">
                            └ {supplier.name}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right text-sm text-gray-600 print:border-gray-400">
                            {supplier.budget.toLocaleString()}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right text-sm text-gray-600 print:border-gray-400">
                            {supplier.actual.toLocaleString()}
                          </td>
                          <td
                            className={`border border-gray-200 px-3 py-2 text-right text-sm print:border-gray-400 ${supplier.difference > 0 ? "text-green-600" : "text-red-600"} print:text-gray-600`}
                          >
                            {supplier.difference > 0 ? "+" : ""}
                            {supplier.difference.toLocaleString()}
                          </td>
                          <td
                            className={`border border-gray-200 px-3 py-2 text-right text-sm print:border-gray-400 ${supplier.rate > 0 ? "text-green-600" : "text-red-600"} print:text-gray-600`}
                          >
                            {supplier.rate > 0 ? "+" : ""}
                            {supplier.rate.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 月別推移グラフ */}
              <div className="print:hidden">
                <h4 className="text-sm font-medium mb-3">月別推移</h4>
                <ChartContainer
                  config={{
                    budget: { label: "予算", color: "hsl(var(--chart-1))" },
                    actual: { label: "実績", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={account.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="budget" stroke="var(--color-budget)" strokeWidth={2} />
                      <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* 分析コメントエリア */}
              <div className="space-y-4 print:break-inside-avoid">
                <h4 className="text-sm font-medium">分析コメント</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700">差異要因分析</Label>
                    {isEditing ? (
                      <Textarea
                        value={comments[account.account]?.analysis || ""}
                        onChange={(e) => updateComment(account.account, "analysis", e.target.value)}
                        placeholder="差異の要因を記入してください"
                        className="min-h-[80px] text-sm"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded border text-sm print:bg-white print:border-gray-300">
                        {comments[account.account]?.analysis || "分析コメントが入力されていません"}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700">改善アクション</Label>
                    {isEditing ? (
                      <Textarea
                        value={comments[account.account]?.action || ""}
                        onChange={(e) => updateComment(account.account, "action", e.target.value)}
                        placeholder="改善アクションを記入してください"
                        className="min-h-[80px] text-sm"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded border text-sm print:bg-white print:border-gray-300">
                        {comments[account.account]?.action || "改善アクションが入力されていません"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 印刷・エクスポート機能 */}
      <Card className="shadow-sm print:hidden">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              印刷プレビュー
            </Button>
            <Button variant="outline" onClick={handlePdfExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              PDF出力
            </Button>
            <Button variant="outline" onClick={handleExcelExport} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Excel出力
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
