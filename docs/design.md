---

## 費用予算策定・実績把握システム 設計書（案） - 外部設計レベル

### 1. システム構成図（案）

```mermaid
graph TD
    subgraph "ユーザー環境"
        User_CFO[CFO PC/ブラウザ]
        User_Keiri[経理担当者 PC/ブラウザ]
    end

    subgraph "アプリケーションサーバー (例: クラウド上)"
        WebAppServer[Web/APサーバー]
        subgraph "主要機能モジュール"
            Auth[認証モジュール]
            Import[データインポートモジュール]
            Budget[予算策定モジュール]
            Actual[実績管理モジュール]
            Analysis[予実分析・レポートモジュール]
            Master[マスタ管理モジュール]
        end
    end

    subgraph "データストア (例: クラウド上)"
        DB[データベースサーバー <br> (RDBMS: PostgreSQL, MySQL等)]
        FileStorage[ファイルストレージ <br> (インポートファイル一時保存等)]
    end

    subgraph "外部システム/データソース"
        GoogleSpreadsheet[Google Spreadsheet <br> (CSVエクスポート)]
        ExcelFile[Excel予算ファイル]
        Freee[freee会計 <br> (CSVエクスポート)]
    end

    User_CFO -->|HTTPS| WebAppServer
    User_Keiri -->|HTTPS| WebAppServer

    WebAppServer <--> Auth
    WebAppServer <--> Import
    WebAppServer <--> Budget
    WebAppServer <--> Actual
    WebAppServer <--> Analysis
    WebAppServer <--> Master

    Import -->|データ書き込み| DB
    Budget -->|データ書き込み/参照| DB
    Actual -->|データ書き込み/参照| DB
    Analysis -->|データ参照| DB
    Master -->|データ書き込み/参照| DB

    Import -->|ファイル操作| FileStorage

    GoogleSpreadsheet -->|手動CSVエクスポート| User_Keiri
    ExcelFile -->|手動アップロード| User_Keiri
    Freee -->|手動CSVエクスポート| User_Keiri
    User_Keiri -->|CSVアップロード| Import
```

**説明:**

*   ユーザー（CFO、経理担当者）はWebブラウザ経由でシステムにアクセスします。
*   Web/APサーバーがリクエストを受け付け、各機能モジュールが処理を実行します。
*   データはリレーショナルデータベース（RDBMS）に格納されます。
*   CSVファイルなどのインポートデータは、一時的にファイルストレージに保存されることもあります。
*   外部データソース（Google Spreadsheet, Excel, freee会計）からのデータは、現時点ではユーザーによる手動エクスポート＆アップロードを前提としています。

### 2. 主要画面設計（案） - ワイヤーフレームレベルのイメージ

#### 2.1. ログイン画面
*   入力項目: ユーザーID、パスワード
*   ボタン: ログイン

#### 2.2. ダッシュボード画面 (ログイン後初期画面)
*   表示項目例:
    *   当月総費用 予実差異 (金額、達成率)
    *   主要費目別 予実差異サマリー (グラフ表示: 棒グラフ等)
    *   年間費用予算進捗 (グラフ表示: 進捗バー等)
    *   お知らせ/通知エリア (システムメッセージ等)
*   ナビゲーションメニュー: 予算策定、実績取込、予実分析、マスタ管理などへのリンク

#### 2.3. 予算策定画面
*   **タブ/セクション構成**:
    *   予算バージョン選択 (初期は単一でも可)
    *   変動要因予測値入力 (社員数、売上高等、月別)
    *   科目別予算入力 (売上原価、販管費)
*   **科目別予算入力エリア**:
    *   表示形式: 勘定科目を行、月を列とするExcelライクなグリッド表示。
    *   入力項目 (科目ごと、月ごと):
        *   取引先 (プルダウン選択、複数可)
        *   予算額 (手入力)
        *   変動要因連動設定ボタン (クリックでモーダル表示)
            *   連動要因選択 (プルダウン)
            *   計算基準値 (前年単価等、自動計算/手入力)
            *   計算結果プレビュー
            *   適用ボタン
    *   機能ボタン: 保存、Excelインポート、Excelエクスポート、予算確定
*   **Excelインポート機能**:
    *   ファイル選択ダイアログ
    *   インポート実行ボタン
    *   インポート結果表示 (成功/エラーメッセージ)

#### 2.4. 実績データ取込画面 (freee会計CSV)
*   ファイル選択ボタン (CSVファイル)
*   アップロード実行ボタン
*   取り込み対象年月選択 (任意)
*   取り込みオプション (例: 既存データ洗い替え、差分追加など – 初期は洗い替えでシンプルに)
*   取り込み結果表示 (件数、エラー件数、エラー詳細)

#### 2.5. 予実対比レポート画面
*   **条件指定エリア**:
    *   対象期間 (月次、四半期、年次、範囲指定)
    *   表示科目 (全科目、主要科目選択、科目グループ選択)
    *   表示単位 (円、千円、万円)
*   **表示エリア**:
    *   テーブル形式で予算、実績、差異(金額)、差異(%)を表示。
    *   行: 勘定科目 (クリックで取引先別内訳にドリルダウン)
    *   列: 各月、累計など
*   機能ボタン: Excelエクスポート、印刷プレビュー

#### 2.6. マスタ管理画面
*   **共通**: 各マスタの一覧表示 (ページネーションあり)、新規登録ボタン、編集ボタン、削除ボタン
*   **勘定科目マスタ**: コード、科目名、区分（売上原価/販管費など）、有効/無効フラグ
*   **取引先マスタ**: コード、取引先名、freee補助科目名（紐付け用）、有効/無効フラグ
*   **変動要因マスタ**: 要因名、単位（人、円など）
*   **ユーザーマスタ**: ユーザーID、氏名、役割（CFO/経理）、パスワード設定/リセット
*   **権限管理**: 役割ごとに利用可能画面/機能をチェックボックス等で設定

### 3. データベース設計（主要エンティティとリレーション案）

※ER図で表現するのが理想ですが、ここではテキストベースで主要なものを示します。

*   **Users (ユーザーマスタ)**
    *   `user_id` (PK)
    *   `username` (ログインID, UNIQUE)
    *   `password_hash`
    *   `full_name`
    *   `role_id` (FK to Roles)
    *   `created_at`, `updated_at`
*   **Roles (役割マスタ)**
    *   `role_id` (PK)
    *   `role_name` (CFO, Keiri, Admin 등)
*   **Permissions (権限マスタ - 役割と機能の紐付け)**
    *   `permission_id` (PK)
    *   `role_id` (FK to Roles)
    *   `function_id` (FK to Functions - システム機能マスタ)
*   **Accounts (勘定科目マスタ)**
    *   `account_id` (PK)
    *   `account_code` (UNIQUE)
    *   `account_name`
    *   `account_category` (売上原価、販管費など)
    *   `is_active`
*   **Vendors (取引先マスタ)**
    *   `vendor_id` (PK)
    *   `vendor_code` (UNIQUE, オプショナル)
    *   `vendor_name`
    *   `freee_aux_account_name` (freee補助科目名との紐付け用)
    *   `is_active`
*   **FluctuationFactors (変動要因マスタ)**
    *   `factor_id` (PK)
    *   `factor_name` (社員数、売上高など)
    *   `unit` (人、円など)
*   **FactorForecasts (変動要因予測値)**
    *   `forecast_id` (PK)
    *   `factor_id` (FK to FluctuationFactors)
    *   `year_month` (YYYYMM形式)
    *   `forecast_value`
*   **Budgets (予算データ)**
    *   `budget_id` (PK)
    *   `account_id` (FK to Accounts)
    *   `vendor_id` (FK to Vendors, NULL許容)
    *   `year_month` (YYYYMM形式)
    *   `budget_amount`
    *   `budget_version` (初期は固定値でも可)
    *   `calculation_type` (手入力、変動要因連動など)
    *   `linked_factor_id` (FK to FluctuationFactors, 変動要因連動の場合)
    *   `basis_value` (変動要因連動の場合の基準単価など)
    *   `created_by` (FK to Users)
    *   `created_at`, `updated_at`
*   **Actuals (実績データ)**
    *   `actual_id` (PK)
    *   `account_id` (FK to Accounts)
    *   `vendor_id` (FK to Vendors, NULL許容)
    *   `transaction_date` (日付)
    *   `year_month` (YYYYMM形式, transaction_dateから導出)
    *   `actual_amount`
    *   `description` (摘要、オプショナル)
    *   `source_file_name` (インポート元CSVファイル名など)
    *   `imported_at`
*   **SystemLogs (システムログ)**
    *   `log_id` (PK)
    *   `timestamp`
    *   `user_id` (FK to Users, 操作ユーザー)
    *   `action_type` (ログイン、データインポート、予算保存など)
    *   `details` (操作詳細)

### 4. データ連携・インターフェース設計

*   **Google Spreadsheet (過去実績)**:
    *   インターフェース: 手動CSVエクスポート → システムへCSVアップロード
    *   CSVフォーマット（想定）: `日付`, `勘定科目名`, `支払先名`, `金額`, `摘要` (列名や順序は設定可能にするか、固定フォーマットを定義)
*   **Excel (予算案)**:
    *   インターフェース: 手動作成 → システムへExcel (xlsx) アップロード
    *   Excelフォーマット（想定）:
        *   1行目: ヘッダー (勘定科目コード, 勘定科目名, 4月, 5月, ..., 3月, 取引先コード, 取引先名)
        *   データ行: 各科目の月別予算額
        *   取引先別にする場合、取引先情報を行に追加するか、別シートで管理するかなど、フォーマット定義が必要。
*   **freee会計 (実績)**:
    *   インターフェース: 手動CSVエクスポート → システムへCSVアップロード
    *   CSVフォーマット: freee会計の標準的な仕訳エクスポート形式、または残高試算表エクスポート形式を想定。
        *   必要な項目: `日付`, `勘定科目名`, `補助科目名` (取引先), `借方金額`, `貸方金額` (費用は借方)、`摘要`
        *   インポート時に、借方/貸方を判断し費用項目を抽出するロジックが必要。

### 5. 技術スタック（案） - 選択肢の例

*   **プログラミング言語**:
    *   バックエンド: Python (Django/Flask), Ruby (Rails), Java (Spring Boot), PHP (Laravel) など
    *   フロントエンド: JavaScript (React, Vue.js, Angular), またはサーバーサイドレンダリング
*   **データベース**: PostgreSQL, MySQL (オープンソースRDBMSを推奨)
*   **Webサーバー**: Nginx, Apache
*   **インフラ**: AWS (EC2, RDS, S3), GCP (Compute Engine, Cloud SQL, Cloud Storage), Azure (Virtual Machines, Azure SQL Database, Blob Storage)
*   **その他**:
    *   バージョン管理: Git
    *   Excel操作ライブラリ (例: Pythonならopenpyxl, pandas)
    *   CSV操作ライブラリ

### 6. 非機能要件の実現方針（一部）

*   **性能**:
    *   データベースのインデックス最適化。
    *   非同期処理の導入（時間のかかるインポート処理など）。
    *   効率的なクエリ作成。
*   **セキュリティ**:
    *   OWASP Top 10等の脆弱性対策（SQLインジェクション、XSSなど）。
    *   パスワードポリシーの設定とハッシュ化保存。
    *   HTTPS通信の強制。
    *   定期的なセキュリティ診断（推奨）。
*   **操作性**:
    *   一貫性のあるUIデザイン。
    *   レスポンシブデザイン（PCでの利用が主だが、将来的なタブレット利用も考慮）。
    *   キーボードショートカットの導入（Excelライクな操作性向上のため、一部機能に）。

--- 