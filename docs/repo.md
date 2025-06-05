# 費用予算策定・実績把握システム リポジトリ構成

## 1. プロジェクト全体構成

```
budget-management-system/
├── README.md                          # プロジェクト概要・セットアップ手順
├── package.json                       # Node.js依存関係設定
├── package-lock.json                  # 依存関係バージョン固定
├── .gitignore                         # Git管理対象外ファイル設定
├── .env.example                       # 環境変数のテンプレート
├── .env                              # 環境変数（Git管理対象外）
├── tsconfig.json                      # TypeScript設定
├── tailwind.config.js                 # TailwindCSS設定
├── next.config.js                     # Next.js設定
├── public/                           # 静的ファイル
│   ├── favicon.ico
│   ├── logo.svg
│   └── sample-data/                  # サンプルデータファイル
│       ├── sample-budget.xlsx
│       ├── sample-actuals-freee.csv
│       └── sample-past-data.csv
├── src/                              # ソースコード
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css               # グローバルCSS
│   │   ├── layout.tsx                # 共通レイアウト
│   │   ├── page.tsx                  # ダッシュボード（トップページ）
│   │   ├── login/
│   │   │   └── page.tsx              # ログイン画面
│   │   ├── budget/
│   │   │   ├── page.tsx              # 予算策定メイン画面
│   │   │   ├── create/
│   │   │   │   └── page.tsx          # 予算作成画面
│   │   │   └── import/
│   │   │       └── page.tsx          # Excel予算インポート画面
│   │   ├── actuals/
│   │   │   ├── page.tsx              # 実績データ管理画面
│   │   │   └── import/
│   │   │       └── page.tsx          # freee実績インポート画面
│   │   ├── analysis/
│   │   │   ├── page.tsx              # 予実対比分析メイン画面
│   │   │   ├── comparison/
│   │   │   │   └── page.tsx          # 詳細予実対比画面
│   │   │   └── reports/
│   │   │       └── page.tsx          # レポート出力画面
│   │   └── masters/
│   │       ├── page.tsx              # マスタ管理メイン画面
│   │       ├── accounts/
│   │       │   └── page.tsx          # 勘定科目マスタ
│   │       ├── vendors/
│   │       │   └── page.tsx          # 取引先マスタ
│   │       ├── factors/
│   │       │   └── page.tsx          # 変動要因マスタ
│   │       └── users/
│   │           └── page.tsx          # ユーザーマスタ
│   ├── components/                   # 再利用可能コンポーネント
│   │   ├── ui/                       # 基本UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Select.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/                   # レイアウト関連
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   ├── charts/                   # グラフ・チャート
│   │   │   ├── BudgetActualChart.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ComparisonChart.tsx
│   │   ├── forms/                    # フォーム関連
│   │   │   ├── BudgetForm.tsx
│   │   │   ├── ImportForm.tsx
│   │   │   └── FilterForm.tsx
│   │   └── data-grid/                # データグリッド
│   │       ├── BudgetGrid.tsx
│   │       ├── ActualGrid.tsx
│   │       └── ComparisonGrid.tsx
│   ├── lib/                          # ユーティリティ・設定
│   │   ├── auth.ts                   # 認証関連
│   │   ├── database.ts               # データベース接続
│   │   ├── utils.ts                  # 汎用ユーティリティ
│   │   ├── constants.ts              # 定数定義
│   │   ├── validations.ts            # バリデーション
│   │   └── export-utils.ts           # エクスポート機能
│   ├── services/                     # ビジネスロジック
│   │   ├── budgetService.ts          # 予算関連サービス
│   │   ├── actualService.ts          # 実績関連サービス
│   │   ├── importService.ts          # インポート関連サービス
│   │   ├── analysisService.ts        # 分析関連サービス
│   │   ├── masterService.ts          # マスタ管理サービス
│   │   └── calculationService.ts     # 計算ロジック
│   ├── hooks/                        # カスタムHooks
│   │   ├── useBudget.ts
│   │   ├── useActuals.ts
│   │   ├── useImport.ts
│   │   ├── useAnalysis.ts
│   │   └── useAuth.ts
│   ├── types/                        # TypeScript型定義
│   │   ├── budget.ts
│   │   ├── actual.ts
│   │   ├── master.ts
│   │   ├── analysis.ts
│   │   ├── import.ts
│   │   └── auth.ts
│   └── data/                         # データ関連
│       ├── mock/                     # モックデータ
│       │   ├── budgetData.ts
│       │   ├── actualData.ts
│       │   └── masterData.ts
│       └── migrations/               # データベースマイグレーション
│           ├── 001_initial_schema.sql
│           ├── 002_add_budget_tables.sql
│           └── 003_add_actual_tables.sql
├── docs/                            # ドキュメント
│   ├── requirements.md              # 要件定義
│   ├── design.md                    # 設計書
│   ├── api.md                       # API仕様
│   ├── deployment.md                # デプロイ手順
│   └── user-guide.md                # ユーザーガイド
└── tests/                           # テストファイル
    ├── components/
    ├── services/
    ├── pages/
    └── utils/
```

## 2. 主要ファイルの内容説明

### package.json
```json
{
  "name": "budget-management-system",
  "version": "1.0.0",
  "description": "費用予算策定・実績把握システム",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "recharts": "^2.8.0",
    "papaparse": "^5.4.0",
    "xlsx": "^0.18.0",
    "date-fns": "^2.30.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "@tanstack/react-table": "^8.10.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/papaparse": "^5.3.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^13.0.0"
  }
}
```

### .gitignore
```gitignore
# Dependencies
node_modules/
.pnpm-debug.log*

# Next.js
.next/
out/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Database
*.db
*.sqlite
*.sqlite3

# Uploads
uploads/
temp/

# Test coverage
coverage/
```

### README.md
```markdown
# 費用予算策定・実績把握システム

## 概要
CFOおよび経理担当者向けの予算策定・実績管理・予実分析システムです。

## 主な機能
- 予算策定（Excel連携、変動要因連動）
- 実績データ取込（freee会計CSV連携）
- 予実対比分析
- レポート出力
- マスタデータ管理

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/budget-management-system.git
cd budget-management-system
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な値を設定
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (グラフ)
- React Hook Form (フォーム)
- Zod (バリデーション)

## ディレクトリ構成
[詳細なディレクトリ構成の説明]
```

## 3. 初期セットアップ用のコマンド集

### GitHubリポジトリ作成後の初期化
```bash
# ローカルでプロジェクト初期化
npx create-next-app@latest budget-management-system --typescript --tailwind --eslint --app
cd budget-management-system

# 必要なパッケージインストール
npm install recharts papaparse xlsx date-fns react-hook-form zod @tanstack/react-table lucide-react
npm install -D @types/papaparse @testing-library/react jest

# Gitリポジトリ設定
git remote add origin https://github.com/your-username/budget-management-system.git
git branch -M main
git push -u origin main
```

### フォルダ構造作成
```bash
# 必要なディレクトリを一括作成
mkdir -p src/{components/{ui,layout,charts,forms,data-grid},lib,services,hooks,types,data/{mock,migrations}}
mkdir -p public/sample-data
mkdir -p docs tests/{components,services,pages,utils}
```

## 4. 開発の進め方

### Phase 1: 基本構造とUI作成
1. `src/app/layout.tsx` - 共通レイアウト
2. `src/components/layout/` - ヘッダー、サイドバー
3. `src/app/page.tsx` - ダッシュボード
4. `src/components/ui/` - 基本UIコンポーネント

### Phase 2: 各機能画面
1. 予算策定画面 (`src/app/budget/`)
2. 実績取込画面 (`src/app/actuals/`)
3. 予実分析画面 (`src/app/analysis/`)
4. マスタ管理画面 (`src/app/masters/`)

### Phase 3: データ処理とサービス
1. `src/services/` - ビジネスロジック
2. `src/lib/` - ユーティリティ
3. データインポート機能
4. 計算ロジック実装

### Phase 4: 統合とテスト
1. 画面間の連携
2. エラーハンドリング
3. テスト実装
4. パフォーマンス最適化

## 5. 重要な設定ファイル

この構成により、要件定義書に記載された全機能を段階的に実装できる基盤が整います。まずは基本的なUI作成から始めて、徐々に機能を追加していくことをお勧めします。