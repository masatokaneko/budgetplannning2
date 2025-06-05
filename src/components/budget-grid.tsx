"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const months = ["4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月"]

interface BudgetItem {
  id: string
  supplier: string
  inputMethod: "direct" | "employee" | "sales"
  baseValue: number
  monthlyValues: number[]
}

interface BudgetGridProps {
  accounts: string[]
  data: { [account: string]: BudgetItem[] }
  employeeCount: number[]
  salesAmount: number[]
  onChange: (account: string, itemId: string, field: string, value: any) => void
  onAddItem: (account: string) => void
  onRemoveItem: (account: string, itemId: string) => void
  onAddAccount: (accountName: string) => void
}

export function BudgetGrid({
  accounts,
  data,
  employeeCount,
  salesAmount,
  onChange,
  onAddItem,
  onRemoveItem,
  onAddAccount,
}: BudgetGridProps) {
  const [newAccountName, setNewAccountName] = useState("")
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)

  const calculateItemTotal = (item: BudgetItem) => {
    return item.monthlyValues.reduce((sum, value) => sum + value, 0)
  }

  const calculateMonthlyTotal = (monthIndex: number) => {
    return accounts.reduce((total, account) => {
      return total + (data[account]?.reduce((sum, item) => sum + (item.monthlyValues[monthIndex] || 0), 0) || 0)
    }, 0)
  }

  const calculateAccountTotal = (account: string) => {
    return data[account]?.reduce((sum, item) => sum + calculateItemTotal(item), 0) || 0
  }

  const handleInputMethodChange = (account: string, itemId: string, method: "direct" | "employee" | "sales") => {
    onChange(account, itemId, "inputMethod", method)

    // 変動要因に基づく自動計算
    if (method !== "direct") {
      const item = data[account]?.find((i) => i.id === itemId)
      if (item) {
        const factorData = method === "employee" ? employeeCount : salesAmount
        const baseValue = item.baseValue || (method === "employee" ? 10 : 0.01)

        const newMonthlyValues = factorData.map((factorValue) => {
          return Math.round(factorValue * baseValue)
        })

        onChange(account, itemId, "monthlyValues", newMonthlyValues)
      }
    }
  }

  const handleBaseValueChange = (account: string, itemId: string, baseValue: number) => {
    onChange(account, itemId, "baseValue", baseValue)

    // 基礎値変更時の再計算
    const item = data[account]?.find((i) => i.id === itemId)
    if (item && item.inputMethod !== "direct") {
      const factorData = item.inputMethod === "employee" ? employeeCount : salesAmount
      const newMonthlyValues = factorData.map((factorValue) => {
        return Math.round(factorValue * baseValue)
      })
      onChange(account, itemId, "monthlyValues", newMonthlyValues)
    }
  }

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      onAddAccount(newAccountName.trim())
      setNewAccountName("")
      setIsAddAccountOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 勘定科目追加ボタン */}
      <div className="flex justify-end">
        <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-3 w-3" />
              勘定科目追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しい勘定科目を追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="account-name">勘定科目名</Label>
                <Input
                  id="account-name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="勘定科目名を入力"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleAddAccount}>追加</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1400px]">
          {/* ヘッダー */}
          <div className="grid grid-cols-[200px_150px_120px_100px_repeat(12,80px)_100px] gap-1 border-b-2 border-gray-300 pb-2 mb-2 bg-gray-50 p-2">
            <div className="text-xs font-medium text-gray-700">勘定科目</div>
            <div className="text-xs font-medium text-gray-700">取引先</div>
            <div className="text-xs font-medium text-gray-700">入力方法</div>
            <div className="text-xs font-medium text-gray-700">変動基礎値</div>
            {months.map((month) => (
              <div key={month} className="text-xs font-medium text-gray-700 text-center">
                {month}
              </div>
            ))}
            <div className="text-xs font-medium text-gray-700 text-center">年間合計</div>
          </div>

          {/* データ行 */}
          {accounts.map((account) => (
            <div key={account} className="space-y-1">
              {data[account]?.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[200px_150px_120px_100px_repeat(12,80px)_100px] gap-1 py-1 border-b border-gray-100 hover:bg-gray-50"
                >
                  {/* 勘定科目 */}
                  <div className="flex items-center text-sm">{itemIndex === 0 ? account : ""}</div>

                  {/* 取引先 */}
                  <div className="flex items-center">
                    <Input
                      value={item.supplier}
                      onChange={(e) => onChange(account, item.id, "supplier", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="取引先名"
                    />
                  </div>

                  {/* 入力方法 */}
                  <div className="flex items-center">
                    <Select
                      value={item.inputMethod}
                      onValueChange={(value: "direct" | "employee" | "sales") =>
                        handleInputMethodChange(account, item.id, value)
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">直接入力</SelectItem>
                        <SelectItem value="employee">人員数連動</SelectItem>
                        <SelectItem value="sales">売上高連動</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 変動基礎値 */}
                  <div className="flex items-center">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.baseValue}
                      onChange={(e) => handleBaseValueChange(account, item.id, Number.parseFloat(e.target.value) || 0)}
                      className="h-7 text-xs text-right"
                      disabled={item.inputMethod === "direct"}
                      placeholder={
                        item.inputMethod === "employee" ? "人/万円" : item.inputMethod === "sales" ? "%" : ""
                      }
                    />
                  </div>

                  {/* 月別データ */}
                  {months.map((month, monthIndex) => (
                    <div key={month} className="flex items-center">
                      <Input
                        type="number"
                        value={item.monthlyValues[monthIndex] || 0}
                        onChange={(e) => {
                          const newValues = [...item.monthlyValues]
                          newValues[monthIndex] = Number.parseInt(e.target.value) || 0
                          onChange(account, item.id, "monthlyValues", newValues)
                        }}
                        className="h-7 text-xs text-right"
                        disabled={item.inputMethod !== "direct"}
                      />
                    </div>
                  ))}

                  {/* 年間合計 */}
                  <div className="flex items-center justify-center text-xs font-medium">
                    {calculateItemTotal(item).toLocaleString()}
                  </div>

                  {/* 削除ボタン */}
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(account, item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      disabled={data[account]?.length === 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* 取引先追加ボタン */}
              <div className="grid grid-cols-[200px_150px_120px_100px_repeat(12,80px)_100px] gap-1 py-1">
                <div></div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddItem(account)}
                    className="h-6 w-full text-xs flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    取引先追加
                  </Button>
                </div>
                <div className="col-span-14"></div>
              </div>

              {/* 勘定科目小計 */}
              <div className="grid grid-cols-[200px_150px_120px_100px_repeat(12,80px)_100px] gap-1 py-1 bg-blue-50 border border-blue-200">
                <div className="text-xs font-medium text-blue-700">{account} 小計</div>
                <div className="col-span-3"></div>
                {months.map((month, monthIndex) => (
                  <div key={month} className="text-xs font-medium text-blue-700 text-center">
                    {(
                      data[account]?.reduce((sum, item) => sum + (item.monthlyValues[monthIndex] || 0), 0) || 0
                    ).toLocaleString()}
                  </div>
                ))}
                <div className="text-xs font-bold text-blue-700 text-center">
                  {calculateAccountTotal(account).toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {/* 総合計行 */}
          <div className="grid grid-cols-[200px_150px_120px_100px_repeat(12,80px)_100px] gap-1 py-2 border-t-2 border-gray-400 bg-gray-100 mt-4">
            <div className="text-sm font-bold text-gray-800">総合計</div>
            <div className="col-span-3"></div>
            {months.map((month, monthIndex) => (
              <div key={month} className="text-sm font-bold text-gray-800 text-center">
                {calculateMonthlyTotal(monthIndex).toLocaleString()}
              </div>
            ))}
            <div className="text-sm font-bold text-gray-800 text-center">
              {accounts.reduce((sum, account) => sum + calculateAccountTotal(account), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
