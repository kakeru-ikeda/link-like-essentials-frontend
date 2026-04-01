# Phase 4 & 5: 保留対応と完全移行処理 仕様書

## Phase 4: TraitAnalysis（特性分析）の対応方針検討

### 現状と課題

バックエンドデータベースには、ゲームロジックから計算された分析結果（`heartCollectAnalysis`, `unDrawAnalysis` 等）が、カードやアクセサリーごとに保存されています。
デッキビルダーなどの主要機能が `traitAnalysisBatch` (GraphQL) クエリを使ってこれにアクセスしていますが、単純な CMS 的なデータではありません。

### 対応方針の策定（⚠️保留中のため別途検討）

1. **サーバー側の維持・Sanity移管**: 新カード追加時に生成スクリプトを使って Sanity 側に流し込む仕組みを設計する。
2. **クライアントでの動的計算**: デッキビルダーなどのUI層で、カードの効果をもとに動的に分析計算を実行するようにリファクタリングする。

他のマイグレーションが完了し安定運用に入った後、全体の影響を踏まえてからいずれかを選択します。

---

## Phase 5: リソース整理・完全廃止

全ての API 呼び出しが Sanity、Firebase REST API (deck/user) に統一されたのを確認後、古い依存関係の削除と環境のクリーンアップを進めます。

### 1. Apollo Client と GraphQL 周辺の撤去

- `repositories/graphql/` のクエリコード等、不要なファイルを完全削除。
- `package.json` から `@apollo/client` および `graphql` といったパッケージのアンインストール。
- Firebase Authorization (JWT) を Apollo Context (`authLink`) へ付与していた部分は、不要となった GraphQL レシーバから Firebase REST レシーバへのみ対応するように切り離す（既存の Firebase REST レシーバの挙動を破壊していないことを確認する）。

### 2. MicroCMSSDK の撤去

- `package.json` から `microcms-js-sdk` の除去。
- アプリケーション環境変数から `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` の削除。

### 3. バックエンドリポジトリの廃止判断

- GraphQL バックエンドを抱える GitHub リポジトリ (`kakeru-ikeda/link-like-essentials-backend`) は、すべての提供パスが停止・置き換えられる。
- GitHub 側にて Archive ステータスへの移行（または Deletion）を実施し、バックエンドの保守運用を停止する。
