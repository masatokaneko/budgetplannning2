import { Budget, BudgetInput } from '@/types/budget';
import { Actual, ActualInput } from '@/types/actual';
import { Account, AccountInput } from '@/types/master';
import { AnalysisResult } from '@/types/analysis';
import { ImportResult } from '@/types/import';
import { User, UserInput } from '@/types/auth';

// 予算データのサンプル
const sampleBudget: Budget = {
  id: 1,
  fiscalYear: 2024,
  month: 4,
  accountId: 1,
  amount: 1000000,
  type: 'EXPENSE',
  status: 'DRAFT',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 1,
  updatedBy: 1,
  version: 1,
  notes: 'サンプル予算データ',
  tags: ['重要', '定期的'],
  attachments: ['budget_202404.pdf'],
  metadata: {
    department: '営業部',
    project: '新規プロジェクト'
  }
};

const sampleBudgetInput: BudgetInput = {
  fiscalYear: 2024,
  month: 4,
  accountId: 1,
  amount: 1000000,
  type: 'EXPENSE',
  notes: 'サンプル予算入力データ',
  tags: ['重要', '定期的'],
  metadata: {
    department: '営業部',
    project: '新規プロジェクト'
  }
};

// 実績データのサンプル
const sampleActual: Actual = {
  id: 1,
  fiscalYear: 2024,
  month: 4,
  accountId: 1,
  amount: 950000,
  type: 'EXPENSE',
  status: 'CONFIRMED',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 1,
  updatedBy: 1,
  version: 1,
  notes: 'サンプル実績データ',
  tags: ['重要', '定期的'],
  attachments: ['actual_202404.pdf'],
  metadata: {
    department: '営業部',
    project: '新規プロジェクト'
  }
};

const sampleActualInput: ActualInput = {
  fiscalYear: 2024,
  month: 4,
  accountId: 1,
  amount: 950000,
  type: 'EXPENSE',
  notes: 'サンプル実績入力データ',
  tags: ['重要', '定期的'],
  metadata: {
    department: '営業部',
    project: '新規プロジェクト'
  }
};

// 勘定科目のサンプル
const sampleAccount: Account = {
  id: 1,
  code: '5001',
  name: '人件費',
  type: 'EXPENSE',
  category: 'OPERATING',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 1,
  updatedBy: 1,
  version: 1,
  notes: 'サンプル勘定科目',
  tags: ['重要', '定期的'],
  metadata: {
    department: '経理部',
    costCenter: 'CC001'
  }
};

const sampleAccountInput: AccountInput = {
  code: '5001',
  name: '人件費',
  type: 'EXPENSE',
  category: 'OPERATING',
  notes: 'サンプル勘定科目入力',
  tags: ['重要', '定期的'],
  metadata: {
    department: '経理部',
    costCenter: 'CC001'
  }
};

// 分析結果のサンプル
const sampleAnalysisResult: AnalysisResult = {
  id: 1,
  fiscalYear: 2024,
  month: 4,
  accountId: 1,
  budgetAmount: 1000000,
  actualAmount: 950000,
  variance: -50000,
  variancePercentage: -5,
  type: 'EXPENSE',
  status: 'CONFIRMED',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 1,
  updatedBy: 1,
  version: 1,
  notes: 'サンプル分析結果',
  tags: ['重要', '定期的'],
  attachments: ['analysis_202404.pdf'],
  metadata: {
    department: '営業部',
    project: '新規プロジェクト'
  }
};

// インポート結果のサンプル
const sampleImportResult: ImportResult = {
  id: 1,
  type: 'BUDGET',
  status: 'SUCCESS',
  totalRecords: 100,
  processedRecords: 100,
  failedRecords: 0,
  errors: [],
  startedAt: new Date(),
  completedAt: new Date(),
  createdBy: 1,
  metadata: {
    fileName: 'budget_202404.xlsx',
    fileSize: 1024,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
};

// ユーザーのサンプル
const sampleUser: User = {
  id: 1,
  email: 'user@example.com',
  name: '山田太郎',
  role: 'ADMIN',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  metadata: {
    department: '経理部',
    position: '課長'
  }
};

const sampleUserInput: UserInput = {
  email: 'user@example.com',
  name: '山田太郎',
  role: 'ADMIN',
  metadata: {
    department: '経理部',
    position: '課長'
  }
};

// 型チェックのためのエクスポート
export {
  sampleBudget,
  sampleBudgetInput,
  sampleActual,
  sampleActualInput,
  sampleAccount,
  sampleAccountInput,
  sampleAnalysisResult,
  sampleImportResult,
  sampleUser,
  sampleUserInput
}; 