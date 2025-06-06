import { AnalysisResult } from "@/types/analysis"

// ダミーデータ例
const dummyAnalysisResults: AnalysisResult[] = []

export const analysisService = {
  getAnalysisResults: async (): Promise<AnalysisResult[]> => {
    // 本来はAPI呼び出し等
    return dummyAnalysisResults
  },
  // 例: 差異集計やレポート生成などのメソッドも追加可能
} 