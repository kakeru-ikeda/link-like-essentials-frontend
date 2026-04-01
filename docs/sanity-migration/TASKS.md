# Sanity 移行プロジェクト 進捗管理 タスクリスト

## Phase 1: 環境セットアップとデータ移行

- [ ] Vercel プロジェクト環境変数に Sanity の各種キー (`NEXT_PUBLIC_SANITY_PROJECT_ID` 等) を追加
- [x] クライアント側に `@sanity/client` を導入
- [x] `repositories/sanity/client.ts` の作成
- [ ] Sanity Studio のスキーマ定義構築（Card, Song, GC, LGP, SkillEffectKeywordGroup, TraitEffectKeywordGroup, news, maintenance 等）
- [ ] GraphQL DB / MicroCMS コンテンツのデータ変換＆インポートスクリプト作成
- [ ] データインポートの実施（初回）

## Phase 2-A: MicroCMS → Sanity リプレイス（ニュース・メンテナンス）

- [ ] `newsRepository.ts` の GROQ 対応（`*[_type == "news"]` クエリへ置き換え）
- [ ] `maintenanceRepository.ts` の GROQ 対応（`*[_type == "maintenance"]` クエリへ置き換え）
- [ ] Sanity Webhook → `/api/revalidate` Route Handler 実装（`revalidateTag("news")` / `revalidateTag("maintenance")`）
- [ ] MicroCMS SDK の呼び出しが news / maintenance から消えていることの動作確認

## Phase 2-B: GraphQL → Sanity リプレイス（Songs・EffectKeywords）

- [ ] `repositories/sanity/queries/songs.ts` の作成（`*[_type == "song"]` クエリ定義）
- [ ] `useSongs` フックを Apollo `useQuery` から Sanity GROQ フェッチへ切り替え
- [ ] `repositories/sanity/queries/effectKeywords.ts` の作成（`skillEffectKeywordGroup` / `traitEffectKeywordGroup` クエリ定義）
- [ ] `useEffectKeywords` フックを Apollo `useQuery` から Sanity GROQ フェッチへ切り替え
- [ ] `/api/revalidate` に `"songs"` / `"effectKeywords"` タグを追加（2-A で未実装の場合）
- [ ] 動作確認（フィルタ・検索への影響チェック）

## Phase 3: メインデータ・イベントのリプレイス

- [ ] `useCards` の GROQ への置き換え（無限スクロール等のページネーション再設計含む）
- [ ] クライアント側ソート・フィルタ (`cardFilterService.ts`) を活用したハイブリッドキャッシュ適用の疎通確認
- [ ] `remoteConfig.ts` にイベント ID 取得 (`active_grade_challenge_id` 等) 処理追加
- [ ] 進行中イベントの `useGradeChallenge` / `useLiveGrandPrix` を Remote Config経由の単件取得へ切り替え

## Phase 4: TraitAnalysis（特性分析）対応

- [ ] TraitAnalysis データ提供方法の設計方針決定（Sanity格納 or フロント側動的計算）
- [ ] TraitAnalysis 対応実装

## Phase 5: 旧コード消去・バックエンド廃止

- [ ] Apollo Client パッケージ・コード (`repositories/graphql/`) 除却
- [ ] MicroCMS SDK パッケージ・コード (`repositories/api/microcmsRepository.ts` 等) 除却
- [ ] JWT 認証利用箇所の整理 (Apollo `authLink` の削除、既存の Firebase REST への影響チェック)
- [ ] 旧バックエンド (`link-like-essentials-backend`) の Archive 処理
