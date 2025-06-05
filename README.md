# 予算管理システム

予算の策定、実績管理、分析を行うためのWebアプリケーションです。

## 機能

- 予算の策定と管理
- 実績データのインポートと管理
- 予算と実績の比較分析
- マスタデータの管理
- ユーザー管理と権限設定

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Recharts

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone https://github.com/your-username/budget-management-system.git
cd budget-management-system
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 にアクセス

## プロジェクト構造

```
budget-management-system/
├── src/                    # ソースコード
│   ├── app/               # Next.js App Router
│   ├── components/        # 再利用可能コンポーネント
│   ├── lib/              # ユーティリティ・設定
│   ├── types/            # TypeScript型定義
│   ├── services/         # ビジネスロジック
│   └── data/             # データ関連
├── public/               # 静的ファイル
└── docs/                # ドキュメント
```

## ライセンス

MIT 