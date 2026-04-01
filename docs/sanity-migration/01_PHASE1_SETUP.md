# Phase 1: 環境セットアップとデータ移行仕様書

## 目的

Sanity の初期設定を行い、必要なデータモデル（スキーマ）を定義し、既存の PostgreSQL / MicroCMS から初期データをマイグレーションする。

## 実装タスク

### 1. Sanity Project の立ち上げ

- Vercel の環境変数追加 (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`)
- `@sanity/client` のインストール
- `repositories/sanity/client.ts` の作成（`useCdn: true` を基本とする。キャッシュの恩恵を最大限受けるため）。

### 2. Sanity Schema の定義

既存の Prisma スキーマに相当する内容を `schemas` フォルダ（Sanity Studio 側）で定義する。

**主要な型変換ルール:**

- `Card.accessories`: `card` ドキュメントの配列（inline object）として保持。
- `CardDetail`: **別ドキュメントにせず `card` ドキュメントに内包**する（`detail` フィールドとして inline object）。`CardDetail.id` / `CardDetail.cardId` 等の DB 結合用フィールドは Sanity では不要のため削除。
- `Song.singers` / `Song.participations`: カンマ区切り文字列から Sanity の Array of String へ変換。
- `SongMoodProgression`: **移行対象外（廃止）**。Sanity スキーマには含めない。
- `SkillEffectKeyword`: 複数テーブル構造（`SkillEffectKeyword` + `SkillEffectDefinition`）ではなく `skillEffectKeywordGroup` として 1ドキュメントに集約する。
- `TraitEffectKeyword`: `SkillEffectKeyword` と対称構造。複数テーブル構造（`TraitEffectKeyword` + `TraitEffectDefinition`）を `traitEffectKeywordGroup` として 1ドキュメントに集約する。構造は以下の通り:
  ```
  // Sanity schema: traitEffectKeywordGroup
  {
    _type: 'traitEffectKeywordGroup',
    effectType: string,          // TraitEffectType ブランド型に対応するキー
    displayName: string,
    definitions: [
      { keyword: string, description?: string }
    ]
  }
  ```
- `LimitedType`: enum値は `options.list` で厳密に定義し、フロント側 `models/enums.ts` と整合を取る。
- `news`（MicroCMS → Sanity 移行）: Phase 2 でフェッチ先を切り替えるため、**スキーマは Phase 1 で定義する**。フィールド構成:
  ```
  // Sanity schema: news
  {
    _type: 'news',
    title: string,
    body: PortableText,          // MicroCMS のリッチテキストを Portable Text に変換
    thumbnail: { asset: reference, alt?: string },
    category: { id: string, name: string },  // inline object（リファレンスは不要）
    publishedAt: datetime,
  }
  ```
- `maintenance`（MicroCMS → Sanity 移行）: 同様に Phase 1 でスキーマ定義。フィールド構成:
  ```
  // Sanity schema: maintenance
  {
    _type: 'maintenance',
    title: string,
    body: PortableText,
    notice?: string,
    ctaLabel?: string,
    ctaUrl?: string,
  }
  ```

### 3. 初期データのインポート

- **バックエンドDB**: 変換スクリプトを作成し Sanity CLI もしくは Mutation API を経由して流し込む。
  - リレーション (`reference`) は Sanity の仕様に合わせてリンクさせる。
- **MicroCMS**: HTML リッチテキストを Portable Text に変換して流し込む処理が必須。

### 🚨 移行時の注意点

- **`isLocked` フラグの扱い**: 既存DB上の「非表示」判定用 `isLocked` フラグは Sanity の `draft` / `published` 機能で代替できるため、マイグレーション時に考慮する（`true`のものはドラフト扱いで移行するなど）。
- **JWT 認証の分離**: 認証（JWT `requireAuth`）は Sanity `public` dataset の設定により、コンテンツ取得時は不要になる。不要な HTTP ヘッダー自動付与などが Sanity Client に設定されないよう、Firebase を利用する `deck` 系と完全に切り離された設計とする。
