# 不動在庫交換システム 設計ドキュメント

既存の薬局向けWebアプリ（Next.js App Router / TypeScript / Tailwind / Supabase / Vercel）に追加する
「不動在庫交換システム」の設計提案です。コードはまだ書かず、方針合意のための資料としてまとめています。

---

## 1. 全体アーキテクチャ

### 1.1 基本方針

- 既存アプリのルーティング・認証基盤に**新しい機能セグメント**として追加する（既存コードには手を入れない）
- 業務ロジックは **Server Actions** に集約し、Route Handler は「Excelアップロードのような大きめのファイル処理」「将来の外部通知（LINE/メール）」など、Server Actionでは扱いにくい処理のみに限定する
- Excel原本はセキュリティ上の理由から保存しない。アップロードされたファイルはメモリ上で解析（パース→正規化→マスタ照合→DB書き込み）した後は保持せず破棄する
- 医薬品マスタとの照合や在庫の状態遷移など、業務ルールは **DBのRLS + Server Action層** の二重で守る（クライアント側のバリデーションはUX目的のみ）
- Excelアップロードは「今の列名に依存しない」ため、**列名マッピング設定**をDBに持たせ、パーサーはマッピング定義を読んで解釈する設計にする

### 1.2 レイヤー構成

```
[Browser]
   │  Server Actions / Server Components
   ▼
[Next.js App Router (RSC)]
   │
   ├─ Excelパーサー層 (xlsx解析 → 正規化 → マスタ照合)
   ├─ 在庫サービス層 (掲載更新・履歴保存・ステータス遷移)
   ├─ 通知サービス層 (将来: メール/LINE, 現在はDB内通知のみ)
   └─ 認可層 (薬局スコープ / 管理者スコープ)
   │
   ▼
[Supabase]
   ├─ Postgres (RLSで薬局ごとにデータ分離)
   ├─ Storage (アップロード元Excelの原本保管・任意)
   └─ Auth (薬局アカウント / 管理者アカウント)
```

### 1.3 既存アプリとの統合方針

- 処方箋事前受付機能は現時点では未実装のため、今回は不動在庫交換システム単体としてスキーマを設計する（例: `stock` スキーマまたは `stock_*` prefix）
- ただし将来的に処方箋事前受付機能を実装する際は「同じ薬局アカウント」を使う可能性が高いため、`stock.pharmacies` は将来の共通化を見据え、認証（`auth_user_id`）と薬局プロフィールを分離して持たせておく（後から共通の `pharmacies` テーブルへ統合しやすくするため）

---

## 2. ディレクトリ構成（追加分のみ）

```
app/
  (stock)/
    stock/
      page.tsx                 # 在庫検索トップ
      layout.tsx
      [pharmacyId]/
        page.tsx                # 特定薬局の掲載一覧
      new-arrivals/
        page.tsx                # NEWのみ表示
      history/
        page.tsx                # 履歴（○月掲載分）一覧
        [period]/
          page.tsx
      requests/
        page.tsx                # 自薬局が出した引取希望一覧
        incoming/
          page.tsx               # 自薬局宛の引取希望（承認待ち）
      dashboard/
        page.tsx                # 薬局ダッシュボード
      upload/
        page.tsx                # Excelアップロード画面
      admin/
        master/
          page.tsx                # 医薬品マスタ管理（管理者のみ）
        unmatched/
          page.tsx                # 照合できなかった行の確認（管理者のみ）
        pharmacies/
          page.tsx                # 薬局管理（管理者のみ）

  api/
    stock/
      upload/
        route.ts                 # Excelアップロード受付（Route Handler）

lib/
  stock/
    actions/
      upload-stock.ts            # Server Action: アップロード確定処理
      request-pickup.ts          # Server Action: 引取希望送信
      approve-pickup.ts          # Server Action: 引取承認/ステータス変更
      update-master-mapping.ts   # Server Action: 未照合行の手動マッチング
    services/
      excel-parser.ts            # 列名マッピングに基づくExcel解析
      master-matcher.ts          # 医薬品マスタ自動照合ロジック
      listing-service.ts         # 掲載の差し替え・履歴保存
      notification-service.ts    # 通知生成（将来メール/LINE差し替え可能に）
    repositories/
      stock-listing-repo.ts
      medicine-master-repo.ts
      pickup-request-repo.ts
    types/
      stock.ts                   # 型定義（Excel行、正規化後在庫など）
    utils/
      column-mapping.ts          # 列名ゆらぎ吸収ユーティリティ

components/
  stock/
    SearchFilters.tsx
    StockTable.tsx
    UploadDropzone.tsx
    PickupStatusBadge.tsx
    DashboardCards.tsx
    UnmatchedRowReview.tsx
```

**設計意図**
- `lib/stock/` にドメインロジックを集約し、`app/` はほぼ「表示 + Server Action呼び出し」のみにする（テスト容易性・再利用性のため）
- Excel列名ゆらぎは `column-mapping.ts` に閉じ込め、パーサー本体に列名を直書きしない
- 将来のLINE通知・メール通知は `notification-service.ts` のインターフェースを差し替えるだけで済むようにする

---

## 3. Supabaseテーブル設計

スキーマ名は仮に `stock` とします（既存スキーマと衝突しないように分離）。

### 3.1 マスタ系

**`stock.pharmacies`（薬局）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| name | text | 薬局名 |
| auth_user_id | uuid | Supabase Authユーザーとの紐付け（既存基盤流用時） |
| is_admin | boolean | 管理者フラグ |
| created_at | timestamptz | |

**`stock.medicine_master`（医薬品マスタ）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| product_name | text | 商品名 |
| standard | text | 規格 |
| manufacturer | text | メーカー |
| yj_code | text UNIQUE | YJコード |
| jan_code | text | JANコード |
| price | numeric | 薬価 |
| is_discontinued | boolean | 販売中止フラグ |
| updated_at | timestamptz | |

**`stock.column_mapping_profiles`（Excel列名マッピング設定）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| profile_name | text | 例: "デフォルト", "A薬局形式" |
| mapping_json | jsonb | 論理項目名 → 実列名候補の配列 |
| is_default | boolean | |

### 3.2 在庫・掲載系

**`stock.listing_batches`（アップロード単位 = 掲載バッチ）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| pharmacy_id | uuid FK → pharmacies | |
| period_label | text | 「○月掲載分」の表示ラベル |
| uploaded_at | timestamptz | |
| is_current | boolean | この薬局の「最新」バッチかどうか |
| raw_row_count | integer | 取込行数 |
| unmatched_row_count | integer | 未照合行数 |

**`stock.stock_items`（不動在庫の1品目 = 掲載中の在庫本体）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| batch_id | uuid FK → listing_batches | 所属バッチ |
| pharmacy_id | uuid FK → pharmacies | 非正規化だが検索性のため保持 |
| medicine_master_id | uuid FK → medicine_master (nullable) | 照合成功時のみ |
| raw_product_name | text | Excel原文（照合失敗時の手掛かり） |
| quantity | numeric | 数量 |
| lot_number | text | LOT |
| expiry_date | date | 期限 |
| note | text | 備考 |
| pickup_destination | text | 引取先（Excel由来の任意項目） |
| is_new | boolean | 新着フラグ |
| status | text | 'available' / 'requested' / 'adjusting' / 'scheduled' / 'completed' |
| created_at | timestamptz | |

**`stock.unmatched_rows`（マスタ未照合行）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| batch_id | uuid FK → listing_batches | |
| stock_item_id | uuid FK → stock_items | |
| raw_row_json | jsonb | Excel行の生データ |
| resolved | boolean | 管理者確認済みか |
| resolved_medicine_master_id | uuid FK (nullable) | 手動紐付け結果 |

### 3.3 引取管理系

**`stock.pickup_requests`（引取希望）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| stock_item_id | uuid FK → stock_items | |
| requesting_pharmacy_id | uuid FK → pharmacies | 引取希望を出した薬局 |
| status | text | 'requested' / 'adjusting' / 'scheduled' / 'completed' / 'rejected' |
| requested_at | timestamptz | |
| responded_at | timestamptz | |
| completed_at | timestamptz | |

**`stock.notifications`（通知）**
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| pharmacy_id | uuid FK → pharmacies | 通知先 |
| type | text | 'pickup_requested' / 'pickup_approved' 等 |
| payload_json | jsonb | |
| is_read | boolean | |
| created_at | timestamptz | |

### 3.4 RLS方針

- `stock_items` / `listing_batches` / `pickup_requests` / `notifications` は行ごとに `pharmacy_id`（もしくは関連する薬局ID）を持ち、`auth.uid()` から解決した `pharmacies.id` と一致する場合のみ更新可能、閲覧は全薬局に許可（不動在庫は「他薬局も見える」仕様のため）
- `medicine_master` / `column_mapping_profiles` は管理者のみ書き込み可、閲覧は全薬局
- 管理者フラグ (`is_admin`) を使ったポリシーで全件アクセスを許可

---

## 4. ER図

薬局・医薬品マスタ・掲載バッチ・在庫・引取希望の関係を可視化した図を、別途Mermaid形式のアーティファクトとしてお見せします。

---

## 5. 画面一覧

| # | 画面 | パス（案） | 権限 | 概要 |
|---|---|---|---|---|
| 1 | 在庫検索トップ | `/stock` | 全薬局 | 薬局名・医薬品名・規格・メーカー・期限・掲載日・状態で検索 |
| 2 | 薬局別掲載一覧 | `/stock/[pharmacyId]` | 全薬局 | 特定薬局の掲載一覧 |
| 3 | 新着一覧 | `/stock/new-arrivals` | 全薬局 | NEWのみ表示 |
| 4 | 履歴一覧 | `/stock/history` | 全薬局 | 「○月掲載分」の一覧から選択 |
| 5 | 履歴詳細 | `/stock/history/[period]` | 全薬局 | 過去バッチの掲載内容閲覧 |
| 6 | 自薬局の引取希望一覧 | `/stock/requests` | 自薬局 | 自分が出した引取希望の状況 |
| 7 | 受信した引取希望一覧 | `/stock/requests/incoming` | 自薬局 | 自薬局の在庫への引取希望・承認操作 |
| 8 | ダッシュボード | `/stock/dashboard` | 自薬局 | 掲載件数・引取待ち・引取済・新着件数 |
| 9 | Excelアップロード | `/stock/upload` | 自薬局 | アップロード→プレビュー→確定 |
| 10 | 医薬品マスタ管理 | `/stock/admin/master` | 管理者 | マスタのCRUD |
| 11 | 未照合行の確認 | `/stock/admin/unmatched` | 管理者 | Excel行とマスタの手動紐付け |
| 12 | 薬局管理 | `/stock/admin/pharmacies` | 管理者 | 薬局アカウント管理 |

**アップロード画面のフロー**
1. Excelファイル選択
2. サーバー側で列名マッピングに基づき解析 → プレビュー表示（正常行／未照合行を分けて表示）
3. 確認後「確定」→ 新しい `listing_batches` を作成し `is_current` を切替、旧掲載は履歴化
4. 未照合行があれば `unmatched_rows` に記録し、管理者確認待ちバナーを表示

---

## 6. 開発ロードマップ

### Phase 0: 準備
- Supabaseスキーマ作成（`stock`）、RLSポリシー設計・テーブル作成
- 既存認証基盤との連携方式の確定（薬局アカウント共通化 or 別管理）

### Phase 1: マスタ・アップロード基盤
- 厚生労働省公開の医薬品一覧（薬価基準収載品目リスト等）を取り込むインポートスクリプトの作成、医薬品マスタへの初期投入
  - 公開データの形式（列構成・YJコード/JANコードの有無）を確認し、`medicine_master` へのマッピングを設計
  - 薬価改定など定期更新にも使えるよう、再インポート可能な設計にする（Phase5の「薬価改定時の一括更新」を見据える）
- 医薬品マスタCRUD（管理者画面、厚労省データにない項目の補完・修正用）
- 列名マッピング設定の実装
- Excelパーサー（マッピング適用・マスタ自動照合、ファイルはメモリ処理のみでStorageに保存しない）
- アップロード→プレビュー→確定フロー

### Phase 2: 検索・閲覧
- 在庫検索画面（フィルタ・一覧）
- 薬局別掲載一覧
- 新着表示・履歴一覧/詳細

### Phase 3: 引取管理
- 引取希望送信
- 承認/ステータス変更フロー
- DB内通知（メール/LINE連携前の土台）

### Phase 4: ダッシュボード・仕上げ
- 薬局別ダッシュボード（件数集計）
- 未照合行の管理者確認画面
- エラーハンドリング・パフォーマンス（インデックス設計・ページネーション）の見直し

### Phase 5（将来拡張、今回のスコープ外）
- 期限切れ間近通知
- 薬価改定一括更新
- CSV出力
- メール通知 / LINE通知
- 引取履歴分析・利用実績集計
- 医薬品マスタ自動更新（外部データ連携）

---

## 決定事項

1. 処方箋事前受付機能は現時点では実装しない。将来実装する場合は同じ薬局アカウントを使う可能性が高いため、`pharmacies` テーブルは将来の統合を見据えた設計にする
2. Excel原本は保存しない（セキュリティ面の要求）。アップロードファイルはメモリ上で解析後に破棄する
3. 医薬品マスタは厚生労働省が公開する医薬品一覧（薬価基準収載品目リスト等）を初期データとして取り込み、正確性を担保する
4. 引取希望の通知は当面アプリ内通知（`stock.notifications`）のみとし、メール/LINE連携はPhase5で検討する

この内容でPhase 1（マスタ・アップロード基盤）から実装を開始します。
