# Sanity 移行 概要設計書

## プロジェクト概要

既存の GraphQL バックエンド（Apollo Server/Prisma）および MicroCMS を廃止し、コンテンツ管理を全て Sanity CMS へ統一する完全移行計画。フロントエンドで利用していた Apollo クエリおよび MicroCMS API リクエストはすべて GROQ に差し替える。

## データソースの責務分離

| データ種別               | 現在のバックエンド          | 移行後の方針                  |
| ------------------------ | --------------------------- | ----------------------------- |
| カード・楽曲・スキルなど | GraphQL API                 | **Sanity CMS (GROQ)**         |
| 各種イベント（LGP/GC）   | GraphQL API                 | **Sanity CMS (GROQ)**         |
| ニュース・メンテナンス   | MicroCMS                    | **Sanity CMS (GROQ)**         |
| ユーザー・公開デッキ     | Firebase Functions REST API | **現状維持 (変更なし)**       |
| 認証・画像・Analytics    | Firebase SDK直接            | **現状維持 (変更なし)**       |
| 特性分析 (TraitAnalysis) | GraphQL API                 | **※Phase 4で別途検討 (保留)** |

## アーキテクチャ変更方針

### Before

- カード/楽曲情報取得: `Apollo Client` -> `repositories/graphql`
- ニュース情報取得: `MicroCMS SDK` -> `repositories/api`
- ユーザー/デッキ管理: `Firebase Functions` -> `repositories/api`

### After

- コンテンツ情報全般取得: `Sanity SDK` -> `repositories/sanity`
- ユーザー/デッキ管理: `Firebase Functions` -> `repositories/api` (現状維持)

### キャッシュとパフォーマンス戦略

- **Sanity CDN (+ハイブリッドキャッシュ)**:
  - 複雑なクエリ（スキル部分一致検索など）において、すべてを Sanity 側で動的解決しようとせず「キャラ名等での一次絞り込み」をメインとし、Sanity CDN のキャッシュヒット率を改善。
  - 後続のスキル効果テキスト検索やソート等は、既存の `cardFilterService.ts` を用いることでネットワーク通信のない安全なクライアントサイドフィルタリングに委ねる。
- **イベントステータス管理**:
  - `ongoingGradeChallenges` / `ongoingLiveGrandPrix` 等の開催中判定において、Sanity のクエリ上で `now()` 関数を利用すると CDN キャッシュが利用しにくいため設計を見直し。
  - 判定を Firebase Remote Config 側 (`active_grade_challenge_id` 等) に持たせ、そのIDを用いた Sanity への「ID単件取得 (CDN キャッシュ有効)」へ切り替える。
