"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const months = ["4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月"]

interface VariableFactorsGridProps {
  employeeCount: number[]
  salesAmount: number[]
  onEmployeeCountChange: (index: number, value: number) => void
  onSalesAmountChange: (index: number, value: number) => void
}

export function VariableFactorsGrid({
  employeeCount,
  salesAmount,
  onEmployeeCountChange,
  onSalesAmountChange,
}: VariableFactorsGridProps) {
  const totalEmployees = employeeCount.reduce((sum, count) => sum + count, 0)
  const totalSales = salesAmount.reduce((sum, amount) => sum + amount, 0)

  return (
    <div className="space-y-6">
      {/* 社員数 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium">社員数（人）</Label>
          <div className="text-sm text-gray-500">年間平均: {Math.round(totalEmployees / 12)}人</div>
        </div>
        <div className="grid grid-cols-6 gap-2 lg:grid-cols-12">
          {months.map((month, index) => (
            <div key={month} className="space-y-1">
              <Label htmlFor={`employee-${index}`} className="text-xs text-gray-600">
                {month}
              </Label>
              <Input
                id={`employee-${index}`}
                type="number"
                value={employeeCount[index]}
                onChange={(e) => onEmployeeCountChange(index, Number.parseInt(e.target.value) || 0)}
                className="h-8 text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 売上高 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium">売上高（万円）</Label>
          <div className="text-sm text-gray-500">年間合計: {totalSales.toLocaleString()}万円</div>
        </div>
        <div className="grid grid-cols-6 gap-2 lg:grid-cols-12">
          {months.map((month, index) => (
            <div key={month} className="space-y-1">
              <Label htmlFor={`sales-${index}`} className="text-xs text-gray-600">
                {month}
              </Label>
              <Input
                id={`sales-${index}`}
                type="number"
                value={salesAmount[index]}
                onChange={(e) => onSalesAmountChange(index, Number.parseInt(e.target.value) || 0)}
                className="h-8 text-xs"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
