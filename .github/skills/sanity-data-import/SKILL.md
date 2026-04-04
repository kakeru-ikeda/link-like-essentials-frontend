---
name: sanity-data-import
description: 'SanityデータインポートスクリプトのワークフロースキルUse when: GraphQL/MicroCMSのデータをSanityにインポートするとき。NDJSONの生成・削除・インポート手順、スクリプトの追加・修正方法を提供する。'
argument-hint: '対象ドキュメント型（例: song, card, gradeChallenge）とtarget dataset（例: production, development）'
---

# Sanity データインポートワークフロー

## スクリプト構成

```
scripts/sanity-import/
  lib/
    env.ts                ← .env.local を process.env に読み込む
    auth.ts               ← Firebase REST API で匿名 JWT トークン取得
    graphqlFetch.ts       ← GraphQL クライアント（Bearer 認証付き）
    writeNdjson.ts        ← dumps/{filename}.ndjson への書き出し
  transformers/
    songTransformer.ts    ← GraphQL Song → Sanity song ドキュメント
    cardTransformer.ts    ← GraphQL Card → Sanity card ドキュメント
  importSongs.ts          ← songs インポートエントリポイント
  importCards.ts          ← cards インポートエントリポイント
  deleteSanityDocs.ts     ← 指定 _type のドキュメントを全削除
```

出力 NDJSON は `dumps/` に生成される。

## 必要な環境変数（.env.local）

| 変数名                          | 用途                                      |
| ------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`  | Firebase 匿名認証（GraphQL JWT 取得用）   |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT`  | GraphQL エンドポイント URL                |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity プロジェクト ID                    |
| `NEXT_PUBLIC_SANITY_DATASET`    | デフォルトデータセット名                  |
| `SANITY_API_TOKEN`              | 削除スクリプト用（Editor 以上のトークン） |

`SANITY_API_TOKEN` は [https://sanity.io/manage](https://sanity.io/manage) → API → Tokens → Add API token（権限: Editor）で発行する。

## 基本コマンド

```bash
# NDJSON 生成
npx tsx scripts/sanity-import/import{TypeName}.ts

# Sanity にインポート
npx sanity dataset import dumps/{type}.ndjson {dataset}

# 既存ドキュメント全削除（再インポート前）
npx tsx scripts/sanity-import/deleteSanityDocs.ts {_type}
```

## 再インポート手順（既存データを置き換えるとき）

```bash
# 1. 既存削除
npx tsx scripts/sanity-import/deleteSanityDocs.ts {_type}

# 2. NDJSON 再生成
npx tsx scripts/sanity-import/import{TypeName}.ts

# 3. インポート
npx sanity dataset import dumps/{type}.ndjson {dataset}
```

## 新規ドキュメント型を追加するときの手順

### 1. transformer を作成

`scripts/sanity-import/transformers/{type}Transformer.ts` を作成する。

**必須の変換ルール（全 transformer 共通）:**

- `_id`: `"{type}-{graphql_id}"` 形式（例: `song-42`, `card-100`）
- `_type`: Sanity スキーマの `name` と一致させる
- `isLocked`: songs/cards は無視して全件 published 扱い（`drafts.` プレフィックスなし）
- DB 結合用フィールド（`id`, `cardId`, `detailId` 等）は除外
- `createdAt` / `updatedAt` は除外
- `null` / `undefined` フィールドはドキュメントに含めない

**型固有ルール:**

| 型     | 変換ポイント                                                                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `song` | `category` → `deckType` にリネーム。`moodProgressions` 除外。`singers` は文字列のまま                                                                                                             |
| `card` | `characterName` (string) → `[characterName]` に wrap。`＆` 区切りは split して配列化。`detail.*` を inline 展開。`accessories` → `tokens` にリネーム。`releaseDate` は `.slice(0, 10)` で日付のみ |

### 2. import スクリプトを作成

`scripts/sanity-import/import{TypeName}.ts` を作成する。

```typescript
import './lib/env.ts';
import { getFirebaseIdToken } from './lib/auth.ts';
import { graphqlFetch } from './lib/graphqlFetch.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import { type GraphQL{Type}, transform{Type} } from './transformers/{type}Transformer.ts';

const TARGET_DATASET = 'development'; // または 'production'

async function main() {
  const token = await getFirebaseIdToken();
  const data = await graphqlFetch<{ {types}: GraphQL{Type}[] }>(QUERY, undefined, token);
  const docs = data.{types}.map(transform{Type});
  writeNdjson('{type}s', docs as Record<string, unknown>[]);
}

main().catch((err: unknown) => { console.error(err); process.exit(1); });
```

### 3. import 内の `.js` 拡張子に注意

`tsx` で実行するため import パスは **`.ts` 拡張子** を使うこと（`.js` は解決できない）。

## dataset の使い分け

| dataset       | 用途                                   |
| ------------- | -------------------------------------- |
| `production`  | 本番データ（songs はここに投入済み）   |
| `development` | 開発・検証用（cards はここに投入済み） |

## 既知の問題・注意点

- `deleteSanityDocs.ts` は `.env.local` の `NEXT_PUBLIC_SANITY_DATASET` を参照する。`production` と `development` で削除先が変わるので注意。
- Sanity CLI の `dataset import` コマンドは `sanity.cli.ts` が存在しないと projectId エラーになる（`sanity.cli.ts` はリポジトリ直下に配置済み）。
- GraphQL の `songs` フィールドの `category` は Sanity スキーマでは `deckType`。
- GradeChallenge / LiveGrandPrix の `song` フィールドは Sanity reference（`{ _type: 'reference', _ref: 'song-{id}' }`）にする必要があるため、**songs を先にインポートすること**。
