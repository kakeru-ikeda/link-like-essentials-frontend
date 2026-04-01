# Phase 2 & 3: フロントエンド統合仕様書

## 目的

GraphQL ベース / MicroCMS リクエストを担ってきた `useQuery` や各 API フック群に対し、段階的に Sanity GROQ でのフェッチ処理へ置き換え・運用確認を行っていく。低リスクでシンプルなモジュール（ニュース・楽曲）から着手し、最後にカード検索や動的開催中イベントへと拡大する。

## Phase 2: 低リスク領域の移行

### 移行対象

1. MicroCMS -> Sanity
   - `newsRepository`
   - `maintenanceRepository`
2. GraphQL API -> Sanity
   - `hooks/deck/useSongs`
   - `hooks/card/useEffectKeywords`

### キャッシュの最適化構築

- **On-Demand Revalidation (`/api/revalidate`)の実装**
  - Sanity Webhook から POST された際に Next.js の Route Handler で受け取る。
  - 更新されたタグ（例: `revalidateTag("songs")`）を発火させることで、次回のリクエスト時に Sanity の最新データが反映されるようにする。

---

## Phase 3: メインコンテンツ・イベント系の移行

### 1. カードデータの GROQ リプレイス (`useCards`)

- `repositories/sanity/queries/cards.ts` を作成する（既存の `cards.ts` に含まれていた Prisma 向けの全クエリ・ページネーションを代替）。
- `cardsConnection`（無限スクロールなどで使われるようなカーソルベースのページネーション）においては、Sanity のオフセットページネーション、あるいは `_id` + `releaseDate` 等を用いたページネーションの対応を行う必要性がある。
- **ハイブリッドキャッシュの適用**:
  - 全カードをサーバーからフルフェッチしたり、動的にスキル効果フィルタの GROQ を叩くことはせず、
  - 通信量を減らすため、Sanity 側への取得は「キャラ名等の1次フィルタ」に留めキャッシュさせる。
  - スキル効果の部分一致検索などの複雑な絞り込みは、すでに稼働している既存ロジック `cardFilterService.ts` を用いた「フロントエンド側のインメモリソート／フィルタ」へ流し込むようにする。

### 2. 開催中イベント対応 (`useGradeChallenge`, `useLiveGrandPrix`)

- **対応方針**: イベントの開始・終了（=現在時刻 `now()` が `startDate`〜`endDate` の間にあるか）を Sanity 側のクエリで行うと、常にキャッシュミスが発生する。
- **Firebase Remote Config でのイベント管理**:
  1. `repositories/firebase/remoteConfig.ts` を機能拡張し、`getActiveEventIds()` を追加。
  2. Firebase Remote Config に `active_grade_challenge_id` および `active_live_grand_prix_id` のキーを追加。
  3. `useGradeChallenge` や `useLiveGrandPrix` では、まずこれら Firebase Remote Config から「現在開催中のイベント ID」を取得する。
  4. 取得した ID を持っている時のみ、Sanity 側へ ID による取得を行い、キャッシュヒットによる高速な配信を実現する。
