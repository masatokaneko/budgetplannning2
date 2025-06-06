import { Budget } from "@/types/budget"

// ダミーデータ例
const dummyBudgets: Budget[] = [
  // 必要に応じてサンプルデータを追加
]

export const budgetService = {
  getBudgets: async (): Promise<Budget[]> => {
    // 本来はAPI呼び出し等
    return dummyBudgets
  },
  saveBudget: async (budget: Budget): Promise<void> => {
    // 本来はAPI呼び出し等
    dummyBudgets.push(budget)
  },
  // 例: 月別集計
  getMonthlySummary: async (): Promise<{ yearMonth: string; total: number }[]> => {
    // ダミー集計
    return []
  },
} 