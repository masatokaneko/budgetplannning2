import { Actual } from "@/types/actual"

// ダミーデータ例
const dummyActuals: Actual[] = [
  // 必要に応じてサンプルデータを追加
]

export const actualService = {
  getActuals: async (): Promise<Actual[]> => {
    // 本来はAPI呼び出し等
    return dummyActuals
  },
  saveActual: async (actual: Actual): Promise<void> => {
    // 本来はAPI呼び出し等
    dummyActuals.push(actual)
  },
  // 例: 月別集計
  getMonthlySummary: async (): Promise<{ yearMonth: string; total: number }[]> => {
    // ダミー集計
    return []
  },
} 