"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Plus, Save, Check, Upload, Download, FileSpreadsheet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BudgetGrid } from "@/components/budget-grid"
import { VariableFactorsGrid } from "@/components/variable-factors-grid"
import { BudgetSummary } from "@/components/budget-summary"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const months = ["4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月"]

const costOfSalesAccounts = ["材料費", "外注費", "労務費", "製造経費", "減価償却費", "その他原価"]

const sellingExpenseAccounts = [
  "人件費",
  "広告宣伝費",
  "旅費交通費",
  "通信費",
  "消耗品費",
  "賃借料",
  "水道光熱費",
  "保険料",
  "租税公課",
  "支払手数料",
  "減価償却費",
  "その他販管費",
]

// データ構造を変更
interface BudgetItem {
  id: string
  supplier: string
  inputMethod: "direct" | "employee" | "sales"
  baseValue: number
  monthlyValues: number[]
}

interface BudgetFormData {
  fiscalYear: string
  budgetVersion: string
  employeeCount: number[]
  salesAmount: number[]
  costOfSales: { [account: string]: BudgetItem[] }
  sellingExpenses: { [account: string]: BudgetItem[] }
}

export function BudgetPlanningContent() {
  const [activeTab, setActiveTab] = useState("cost-of-sales")
  const [isLoading, setIsLoading] = useState(false)

  // defaultValuesを更新
  const { control, handleSubmit, watch, setValue, getValues } = useForm<BudgetFormData>({
    defaultValues: {
      fiscalYear: "2024",
      budgetVersion: "normal",
      employeeCount: Array(12).fill(50),
      salesAmount: Array(12).fill(10000),
      costOfSales: costOfSalesAccounts.reduce(
        (acc, account) => {
          acc[account] = [
            {
              id: `${account}-1`,
              supplier: "取引先A",
              inputMethod: "direct",
              baseValue: 0,
              monthlyValues: Array(12).fill(0),
            },
          ]
          return acc
        },
        {} as { [key: string]: BudgetItem[] },
      ),
      sellingExpenses: sellingExpenseAccounts.reduce(
        (acc, account) => {
          acc[account] = [
            {
              id: `${account}-1`,
              supplier: "取引先A",
              inputMethod: "direct",
              baseValue: 0,
              monthlyValues: Array(12).fill(0),
            },
          ]
          return acc
        },
        {} as { [key: string]: BudgetItem[] },
      ),
    },
  })

  const watchedValues = watch()

  const handleSave = async (data: BudgetFormData) => {
    setIsLoading(true)
    // 保存処理のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("保存データ:", data)
    setIsLoading(false)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    // 確定処理のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("予算確定")
    setIsLoading(false)
  }

  const handleExcelImport = () => {
    console.log("Excelインポート")
  }

  const handleNewBudget = () => {
    console.log("新規予算作成")
  }

  // CSVテンプレートダウンロード機能
  const downloadCsvTemplate = (type: "cost-of-sales" | "selling-expenses") => {
    // ヘッダー行の作成
    const headers = ["勘定科目", "取引先", "入力方法", "変動基礎値", ...months, "年間合計"]

    // データ行の作成（サンプル行）
    const accounts = type === "cost-of-sales" ? costOfSalesAccounts : sellingExpenseAccounts
    const rows = accounts.map((account) => {
      return [account, "取引先名", "直接入力", "0", ...Array(12).fill("0"), "0"]
    })

    // CSVデータの作成
    let csvContent = headers.join(",") + "\n"
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })

    // BOMを追加してExcelで文字化けしないようにする
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" })

    // ダウンロードリンクの作成
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `予算テンプレート_${type === "cost-of-sales" ? "売上原価" : "販管費"}_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Excelテンプレートダウンロード機能
  const downloadExcelTemplate = () => {
    // 実際のExcelファイル生成は複雑なため、ここではCSVをダウンロードする簡易版を実装
    // 本番環境では、xlsx.jsなどのライブラリを使用してExcelファイルを生成することを推奨

    // ヘッダー行の作成（全体構造）
    const headers = ["シート", "勘定科目", "取引先", "入力方法", "変動基礎値", ...months]

    // データ行の作成（サンプル行）
    const rows = [
      // 変動要因
      ["変動要因", "社員数", "", "", "", ...Array(12).fill("50")],
      ["変動要因", "売上高", "", "", "", ...Array(12).fill("10000")],

      // 売上原価
      ...costOfSalesAccounts.map((account) => {
        return ["売上原価", account, "取引先A", "直接入力", "0", ...Array(12).fill("0")]
      }),

      // 販管費
      ...sellingExpenseAccounts.map((account) => {
        return ["販管費", account, "取引先B", "直接入力", "0", ...Array(12).fill("0")]
      }),
    ]

    // CSVデータの作成
    let csvContent = headers.join(",") + "\n"
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })

    // BOMを追加してExcelで文字化けしないようにする
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" })

    // ダウンロードリンクの作成
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `予算テンプレート_全体_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">予算策定</h2>
          <p className="text-sm text-gray-500">年度予算の策定・編集を行います</p>
        </div>
        <Badge variant="outline" className="text-sm">
          最終更新: 2024年10月15日 14:30
        </Badge>
      </div>

      {/* 上部操作パネル */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">予算設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="fiscal-year">対象年度</Label>
              <Select value={watchedValues.fiscalYear} onValueChange={(value) => setValue("fiscalYear", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="年度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023年度</SelectItem>
                  <SelectItem value="2024">2024年度</SelectItem>
                  <SelectItem value="2025">2025年度</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-version">予算バージョン</Label>
              <Select value={watchedValues.budgetVersion} onValueChange={(value) => setValue("budgetVersion", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="バージョンを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">通常予算</SelectItem>
                  <SelectItem value="optimistic">楽観予算</SelectItem>
                  <SelectItem value="pessimistic">悲観予算</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>操作</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleNewBudget} className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  新規
                </Button>

                {/* テンプレートダウンロードとインポートのドロップダウン */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileSpreadsheet className="h-3 w-3" />
                      テンプレート
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => downloadExcelTemplate()}>
                      <Download className="mr-2 h-4 w-4" />
                      全体テンプレート
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadCsvTemplate("cost-of-sales")}>
                      <Download className="mr-2 h-4 w-4" />
                      売上原価テンプレート
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadCsvTemplate("selling-expenses")}>
                      <Download className="mr-2 h-4 w-4" />
                      販管費テンプレート
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" onClick={handleExcelImport} className="flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  インポート
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>保存・確定</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubmit(handleSave)}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  保存
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-3 w-3" />
                  確定
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 変動要因設定エリア */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">変動要因設定</CardTitle>
        </CardHeader>
        <CardContent>
          <VariableFactorsGrid
            employeeCount={watchedValues.employeeCount}
            salesAmount={watchedValues.salesAmount}
            onEmployeeCountChange={(index, value) => {
              const newValues = [...watchedValues.employeeCount]
              newValues[index] = value
              setValue("employeeCount", newValues)
            }}
            onSalesAmountChange={(index, value) => {
              const newValues = [...watchedValues.salesAmount]
              newValues[index] = value
              setValue("salesAmount", newValues)
            }}
          />
        </CardContent>
      </Card>

      {/* 予算入力エリア */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">予算入力</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cost-of-sales">売上原価</TabsTrigger>
              <TabsTrigger value="selling-expenses">販管費</TabsTrigger>
            </TabsList>

            <TabsContent value="cost-of-sales" className="mt-6">
              {/* BudgetGridのpropsを更新 */}
              <BudgetGrid
                accounts={costOfSalesAccounts}
                data={watchedValues.costOfSales}
                employeeCount={watchedValues.employeeCount}
                salesAmount={watchedValues.salesAmount}
                onChange={(account, itemId, field, value) => {
                  const newData = { ...watchedValues.costOfSales }
                  const item = newData[account].find((item) => item.id === itemId)
                  if (item) {
                    if (field === "monthlyValues") {
                      item.monthlyValues = value as number[]
                    } else {
                      ;(item as any)[field] = value
                    }
                  }
                  setValue("costOfSales", newData)
                }}
                onAddItem={(account) => {
                  const newData = { ...watchedValues.costOfSales }
                  const newId = `${account}-${Date.now()}`
                  newData[account].push({
                    id: newId,
                    supplier: "新規取引先",
                    inputMethod: "direct",
                    baseValue: 0,
                    monthlyValues: Array(12).fill(0),
                  })
                  setValue("costOfSales", newData)
                }}
                onRemoveItem={(account, itemId) => {
                  const newData = { ...watchedValues.costOfSales }
                  newData[account] = newData[account].filter((item) => item.id !== itemId)
                  setValue("costOfSales", newData)
                }}
                onAddAccount={(accountName) => {
                  const newData = { ...watchedValues.costOfSales }
                  newData[accountName] = [
                    {
                      id: `${accountName}-1`,
                      supplier: "取引先A",
                      inputMethod: "direct",
                      baseValue: 0,
                      monthlyValues: Array(12).fill(0),
                    },
                  ]
                  setValue("costOfSales", newData)
                }}
              />
            </TabsContent>

            <TabsContent value="selling-expenses" className="mt-6">
              <BudgetGrid
                accounts={sellingExpenseAccounts}
                data={watchedValues.sellingExpenses}
                employeeCount={watchedValues.employeeCount}
                salesAmount={watchedValues.salesAmount}
                onChange={(account, itemId, field, value) => {
                  const newData = { ...watchedValues.sellingExpenses }
                  const item = newData[account].find((item) => item.id === itemId)
                  if (item) {
                    if (field === "monthlyValues") {
                      item.monthlyValues = value as number[]
                    } else {
                      ;(item as any)[field] = value
                    }
                  }
                  setValue("sellingExpenses", newData)
                }}
                onAddItem={(account) => {
                  const newData = { ...watchedValues.sellingExpenses }
                  const newId = `${account}-${Date.now()}`
                  newData[account].push({
                    id: newId,
                    supplier: "新規取引先",
                    inputMethod: "direct",
                    baseValue: 0,
                    monthlyValues: Array(12).fill(0),
                  })
                  setValue("sellingExpenses", newData)
                }}
                onRemoveItem={(account, itemId) => {
                  const newData = { ...watchedValues.sellingExpenses }
                  newData[account] = newData[account].filter((item) => item.id !== itemId)
                  setValue("sellingExpenses", newData)
                }}
                onAddAccount={(accountName) => {
                  const newData = { ...watchedValues.sellingExpenses }
                  newData[accountName] = [
                    {
                      id: `${accountName}-1`,
                      supplier: "取引先A",
                      inputMethod: "direct",
                      baseValue: 0,
                      monthlyValues: Array(12).fill(0),
                    },
                  ]
                  setValue("sellingExpenses", newData)
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* サマリー表示 */}
      <BudgetSummary
        costOfSales={watchedValues.costOfSales}
        sellingExpenses={watchedValues.sellingExpenses}
        salesAmount={watchedValues.salesAmount}
      />
    </div>
  )
}
