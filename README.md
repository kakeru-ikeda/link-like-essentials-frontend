# Link Like Essentials Frontend

「Link! Like! ラブライブ!」のカードデッキを作成・管理・共有するための Next.js フロントエンドです。

スクールアイドルステージ（スクステ）のカード編成に加えて、公開デッキの閲覧・インポート、ユーザープロフィール管理、お知らせ配信までをひとつのアプリで扱います。

## 概要

このリポジトリは App Router ベースの Next.js 14 アプリケーションです。Apollo Client を使った GraphQL 通信、Firebase 認証、Zustand による状態管理、microCMS 連携によるお知らせ配信を組み合わせて構成されています。

## 主な機能

- 最大 18 枚構成のデッキビルダー
- カード一覧の検索、フィルタリング、ソート、詳細表示
- スキル分析、ドロー分析、ライブグランプリ/グレードチャレンジ向けの編成補助
- デッキのローカル保存、公開、インポート
- 公開デッキの一覧表示、詳細表示、コメント、通報
- Firebase 匿名認証からメールログインへのアップグレード
- マイページでのプロフィール編集、投稿デッキ/いいね済みデッキの管理
- microCMS 連携によるお知らせ一覧・詳細表示

## 主要ルート

| ルート | 役割 |
| --- | --- |
| `/` | デッキビルダーのメイン画面 |
| `/cards` | カード一覧、フィルタ、ソート、詳細表示 |
| `/decks` | 公開デッキ一覧、タグ絞り込み、並び替え |
| `/decks/[id]` | 公開デッキ詳細、インポート、コメント、通報 |
| `/mypage` | プロフィール、投稿デッキ、いいね済みデッキの管理 |
| `/mypage/profile/edit` | プロフィール編集 |
| `/login` | メールログイン、匿名ユーザーのメール登録 |
| `/news` | お知らせ一覧 |
| `/news/[id]` | お知らせ詳細 |
| `/maintenance` | メンテナンス画面 |

`/deck` は互換用のルートで、現在は `/` にリダイレクトされます。

## 技術スタック

- Next.js 14（App Router）
- React 18
- TypeScript
- Apollo Client / GraphQL
- Firebase Authentication / Storage / Analytics
- Zustand + Immer
- Tailwind CSS
- microCMS
- Sentry

## セットアップ

```bash
git clone https://github.com/kakeru-ikeda/link-like-essentials-frontend.git
cd link-like-essentials-frontend
npm ci
cp .env.example .env.local
```

その後、`.env.local` に必要な環境変数を設定して開発サーバーを起動してください。

```bash
npm run dev
```

## 環境変数

`.env.example` をベースに `.env.local` を作成してください。

| 変数名 | 用途 | 備考 |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | アプリの公開 URL | OGP などの生成に利用 |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | GraphQL API エンドポイント | 未設定時は `http://localhost:4000/graphql` を利用 |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase 設定 | クライアントで利用 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase 設定 | クライアントで利用 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 設定 | クライアントで利用 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase 設定 | クライアントで利用 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase 設定 | クライアントで利用 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase 設定 | クライアントで利用 |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Analytics 設定 | Analytics 利用時に必要 |
| `NEXT_PUBLIC_FUNCTIONS_BASE_URL` | Cloud Functions のベース URL | 未設定時はローカル Emulator URL を利用 |
| `MICROCMS_SERVICE_DOMAIN` | microCMS のサービスドメイン | `news` 関連ページとビルド時に必要 |
| `MICROCMS_API_KEY` | microCMS API キー | `news` 関連ページとビルド時に必要 |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | ローカルでは任意、本番では推奨 |
| `SENTRY_AUTH_TOKEN` | Sentry Source Map アップロード | 本番ビルドで利用する場合に設定 |
| `SENTRY_ORG` | Sentry 組織名 | Source Map アップロード時に設定 |
| `SENTRY_PROJECT` | Sentry プロジェクト名 | Source Map アップロード時に設定 |

### 環境変数まわりの注意

- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` は Firebase Analytics 初期化で参照されます。
- `NEXT_PUBLIC_FUNCTIONS_BASE_URL` はデッキ API / ユーザー API のベース URL に使われます。
- `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` が未設定だと、`news` ページ関連の取得処理が失敗します。
- `npm run build` では `app/news` 配下のページが評価されるため、microCMS の環境変数はローカルビルド時も基本的に必要です。

## 利用できる npm scripts

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | ビルド済みアプリの起動 |
| `npm run lint` | Next.js ESLint 実行 |
| `npm run type-check` | TypeScript 型チェック（`tsc --noEmit`） |
| `npm run format` | Prettier による整形 |
| `npm run vercel` | Vercel CLI 実行 |
| `npm run vercel:prod` | Vercel 本番デプロイ |

現時点の `package.json` には `npm test` などのテスト用スクリプトは定義されていません。

## プロジェクト構成

```text
.
├── app/             # Next.js App Router のルートとページ
├── components/      # UI コンポーネント
├── hooks/           # カスタムフック
├── services/        # ビジネスロジック
├── repositories/    # GraphQL / Firebase / API / LocalStorage へのアクセス
├── store/           # Zustand ストア
├── models/          # ドメインモデルと型定義
├── types/           # 補助的な型定義
├── utils/           # 共通ユーティリティ
├── config/          # 各種設定
├── public/          # 静的アセット
├── styles/          # スタイル定義
├── docs/            # 補助ドキュメント
├── instrumentation.ts
├── next.config.js
└── tsconfig.json
```

`src/` ディレクトリは使用しておらず、各ディレクトリはリポジトリ直下に配置されています。

## アーキテクチャ

このアプリは、以下のレイヤード構成を前提にしています。

```text
components/ → services/ → repositories/
       ↓
 hooks/ + store/
```

- `components/`: UI 表示のみを担当
- `services/`: ビジネスロジックを担当
- `repositories/`: 外部 API、Firebase、LocalStorage との通信を担当
- `hooks/` と `store/`: 画面状態やユースケース単位の接着を担当

コンポーネントから `repositories/` を直接呼ばず、責務ごとに層を分ける前提です。

## 開発時の補足

- TypeScript は `strict: true` で動作します。
- import には `@/` エイリアスを利用します。
- ESLint は `next/core-web-vitals` を拡張しています。
- Prettier は 2 スペース、シングルクォート、`printWidth: 80` の設定です。

## 検証コマンド

変更時は少なくとも以下の確認を推奨します。

```bash
npm run lint
npm run type-check
```

本番相当の確認まで行う場合は、必要な環境変数を設定したうえで以下も実行してください。

```bash
npm run build
```

## 関連リポジトリ

- バックエンド: [link-like-essentials-backend](https://github.com/kakeru-ikeda/link-like-essentials-backend)
