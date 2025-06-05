"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

interface CsvData {
  headers: string[]
  rows: string[][]
  errors: { row: number; message: string }[]
}

interface MappingConfig {
  date: string
  yearMonth: string
  account: string
  supplier: string
  amount: string
}

interface ImportResult {
  success: number
  errors: { row: number; message: string }[]
  total: number
}

export function ActualImportContent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CsvData | null>(null)
  // const [targetYear, setTargetYear] = useState("2024")
  // const [targetMonth, setTargetMonth] = useState("10")
  const [importOption, setImportOption] = useState<"replace" | "append">("replace")
  const [mapping, setMapping] = useState<MappingConfig>({
    date: "",
    yearMonth: "",
    account: "",
    supplier: "",
    amount: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [currentStep, setCurrentStep] = useState<"upload" | "preview" | "mapping" | "result">("upload")

  // ファイルドロップハンドラー
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))
    if (csvFile) {
      handleFileSelect(csvFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  // ファイル選択処理
  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    parseCSV(file)
  }

  // CSV解析
  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
      const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))

      // 簡単なバリデーション
      const errors: { row: number; message: string }[] = []
      rows.forEach((row, index) => {
        if (row.length !== headers.length) {
          errors.push({ row: index + 2, message: "列数が一致しません" })
        }
        // 金額列の数値チェック（仮定：最後の列が金額）
        const amountCell = row[row.length - 1]
        if (amountCell && isNaN(Number(amountCell.replace(/,/g, "")))) {
          errors.push({ row: index + 2, message: "金額が数値ではありません" })
        }
      })

      setCsvData({ headers, rows, errors })
      setCurrentStep("preview")

      // 自動マッピング（推測）
      const autoMapping: MappingConfig = {
        date: headers.find((h) => h.includes("日付") || h.includes("Date")) || "",
        yearMonth: headers.find((h) => h.includes("年月") || h.includes("対象年月") || h.includes("YearMonth")) || "",
        account: headers.find((h) => h.includes("勘定科目") || h.includes("科目") || h.includes("Account")) || "",
        supplier: headers.find((h) => h.includes("取引先") || h.includes("補助科目") || h.includes("Supplier")) || "",
        amount: headers.find((h) => h.includes("金額") || h.includes("Amount")) || "",
      }
      setMapping(autoMapping)
    }
    reader.readAsText(file, "UTF-8")
  }

  // サンプルファイルダウンロード
  const downloadSampleFile = () => {
    const sampleData = [
      ["年月", "日付", "勘定科目名", "補助科目（取引先）", "金額"],
      ["2024/10", "2024/10/01", "人件費", "株式会社A", "500000"],
      ["2024/10", "2024/10/02", "広告宣伝費", "株式会社B", "120000"],
      ["2024/10", "2024/10/03", "旅費交通費", "個人C", "15000"],
      ["2024/10", "2024/10/04", "通信費", "株式会社D", "8000"],
      ["2024/10", "2024/10/05", "消耗品費", "株式会社E", "25000"],
    ]

    const csvContent = sampleData.map((row) => row.join(",")).join("\n")
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `実績取込サンプル_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 取り込み実行
  const executeImport = async () => {
    if (!csvData) return

    setIsProcessing(true)
    setCurrentStep("result")

    // 取り込み処理のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const successCount = csvData.rows.length - csvData.errors.length
    const result: ImportResult = {
      success: successCount,
      errors: csvData.errors,
      total: csvData.rows.length,
    }

    setImportResult(result)
    setIsProcessing(false)
  }

  // リセット
  const resetImport = () => {
    setSelectedFile(null)
    setCsvData(null)
    setImportResult(null)
    setCurrentStep("upload")
    setMapping({ date: "", yearMonth: "", account: "", supplier: "", amount: "" })
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">実績取込</h2>
          <p className="text-sm text-gray-500">freee会計からの実績データを取り込みます</p>
        </div>
        <Badge variant="outline" className="text-sm">
          最終取込: 2024年10月15日 09:15
        </Badge>
      </div>

      {/* ステップインジケーター */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === "upload" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className={`text-sm ${currentStep === "upload" ? "font-medium" : "text-gray-500"}`}>
                ファイル選択
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === "preview" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className={`text-sm ${currentStep === "preview" ? "font-medium" : "text-gray-500"}`}>
                プレビュー
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === "mapping" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span className={`text-sm ${currentStep === "mapping" ? "font-medium" : "text-gray-500"}`}>
                マッピング
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === "result" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                4
              </div>
              <span className={`text-sm ${currentStep === "result" ? "font-medium" : "text-gray-500"}`}>実行結果</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Tabs value={currentStep} className="space-y-6">
        {/* ステップ1: ファイル選択 */}
        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* インポート設定エリア */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">インポート設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 対象年月選択 */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>対象年</Label>
                    <Select value={targetYear} onValueChange={setTargetYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023年</SelectItem>
                        <SelectItem value="2024">2024年</SelectItem>
                        <SelectItem value="2025">2025年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>対象月</Label>
                    <Select value={targetMonth} onValueChange={setTargetMonth}>
                      <SelectTrigger>
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
                </div> */}

                {/* インポートオプション */}
                <div className="space-y-3">
                  <Label>インポートオプション</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="replace"
                        checked={importOption === "replace"}
                        onCheckedChange={() => setImportOption("replace")}
                      />
                      <Label htmlFor="replace" className="text-sm">
                        既存データを置き換え
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="append"
                        checked={importOption === "append"}
                        onCheckedChange={() => setImportOption("append")}
                      />
                      <Label htmlFor="append" className="text-sm">
                        差分を追加
                      </Label>
                    </div>
                  </div>
                </div>

                {/* ファイル選択エリア */}
                <div className="space-y-2">
                  <Label>ファイル選択</Label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">CSVファイルをドラッグ&ドロップするか、クリックして選択</p>
                    {selectedFile && <p className="mt-2 text-sm text-blue-600 font-medium">{selectedFile.name}</p>}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ファイル形式説明 */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">ファイル形式について</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">対応形式</h4>
                    <p className="text-sm text-gray-600">CSV（カンマ区切り）</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">必須列</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 年月（YYYY/MM形式）</li>
                      <li>• 日付（YYYY/MM/DD形式）</li>
                      <li>• 勘定科目名</li>
                      <li>• 補助科目（取引先）</li>
                      <li>• 金額（数値）</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">注意事項</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 1行目はヘッダー行として扱われます</li>
                      <li>• 文字コードはUTF-8を推奨</li>
                      <li>• 金額は数値のみ（カンマ区切り可）</li>
                    </ul>
                  </div>
                </div>

                <Button variant="outline" onClick={downloadSampleFile} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  サンプルファイルダウンロード
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ステップ2: プレビュー */}
        <TabsContent value="preview" className="space-y-6">
          {csvData && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">データプレビュー</CardTitle>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      総件数: <span className="font-medium">{csvData.rows.length}</span>
                    </span>
                    {csvData.errors.length > 0 && (
                      <span className="text-red-600">
                        エラー: <span className="font-medium">{csvData.errors.length}</span>
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {csvData.errors.length > 0 && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {csvData.errors.length}件のエラーが検出されました。エラー行は赤色でハイライトされています。
                    </AlertDescription>
                  </Alert>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-600">
                          行
                        </th>
                        {csvData.headers.map((header, index) => (
                          <th
                            key={index}
                            className="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-600"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.rows.slice(0, 10).map((row, rowIndex) => {
                        const hasError = csvData.errors.some((error) => error.row === rowIndex + 2)
                        return (
                          <tr key={rowIndex} className={hasError ? "bg-red-50" : ""}>
                            <td className="border border-gray-200 px-3 py-2 text-xs text-gray-500">{rowIndex + 2}</td>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-200 px-3 py-2 text-xs">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {csvData.rows.length > 10 && (
                    <p className="mt-2 text-xs text-gray-500">
                      最初の10行のみ表示しています（全{csvData.rows.length}行）
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={resetImport}>
                    <X className="mr-2 h-4 w-4" />
                    キャンセル
                  </Button>
                  <Button onClick={() => setCurrentStep("mapping")}>次へ：マッピング設定</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ステップ3: マッピング設定 */}
        <TabsContent value="mapping" className="space-y-6">
          {csvData && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">列マッピング設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">CSVの列と取り込み項目の対応を設定してください。</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>年月列</Label>
                    <Select
                      value={mapping.yearMonth}
                      onValueChange={(value) => setMapping({ ...mapping, yearMonth: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="列を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvData.headers.map((header, index) => (
                          <SelectItem key={index} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>日付列</Label>
                    <Select value={mapping.date} onValueChange={(value) => setMapping({ ...mapping, date: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="列を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvData.headers.map((header, index) => (
                          <SelectItem key={index} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>勘定科目列</Label>
                    <Select
                      value={mapping.account}
                      onValueChange={(value) => setMapping({ ...mapping, account: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="列を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvData.headers.map((header, index) => (
                          <SelectItem key={index} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>取引先列</Label>
                    <Select
                      value={mapping.supplier}
                      onValueChange={(value) => setMapping({ ...mapping, supplier: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="列を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvData.headers.map((header, index) => (
                          <SelectItem key={index} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>金額列</Label>
                    <Select value={mapping.amount} onValueChange={(value) => setMapping({ ...mapping, amount: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="列を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvData.headers.map((header, index) => (
                          <SelectItem key={index} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep("preview")}>
                    戻る
                  </Button>
                  <Button
                    onClick={executeImport}
                    disabled={
                      !mapping.yearMonth || !mapping.date || !mapping.account || !mapping.supplier || !mapping.amount
                    }
                  >
                    <Play className="mr-2 h-4 w-4" />
                    取り込み実行
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ステップ4: 実行結果 */}
        <TabsContent value="result" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">取り込み結果</CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-medium">データを取り込み中...</div>
                    <p className="text-sm text-gray-600">しばらくお待ちください</p>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              ) : importResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                      <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                      <div className="text-sm text-gray-600">成功</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <AlertCircle className="mx-auto h-8 w-8 text-red-600 mb-2" />
                      <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                      <div className="text-sm text-gray-600">エラー</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <FileText className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                      <div className="text-sm text-gray-600">総件数</div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">エラー詳細</h4>
                      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                        {importResult.errors.map((error, index) => (
                          <div key={index} className="px-3 py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm text-red-600">
                              {error.row}行目: {error.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Button onClick={resetImport}>新しいファイルを取り込む</Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
