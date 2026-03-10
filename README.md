# Link Like Essentials Frontend

「Link! Like! ラブライブ!」のカードデッキビルダー Web アプリケーション

## 📋 概要

スマートフォン向けアプリ「Link! Like! ラブライブ!」で扱うカードを、最大 18 枚まで編成できるデッキビルダーです。

### 主要機能

- ✨ キャラクター別のカード編成（9 キャラクター × 2 枚 = 18 枚）
- 🔍 カードのフィルタリング・検索
- 📊 デッキの統計情報表示
- 💾 デッキの保存・読み込み（LocalStorage）
- 🔐 Firebase 匿名認証によるセキュアな API 通信

## 🛠 技術スタック

- **フレームワーク**: Next.js 14.x (App Router)
- **言語**: TypeScript 5.x
- **GraphQL クライアント**: Apollo Client 3.x
- **状態管理**: Zustand 4.x
- **スタイリング**: Tailwind CSS 3.x
- **認証**: Firebase Authentication 10.x
- **ホスティング**: Vercel

## 🚀 クイックスタート

### 必要要件

- Node.js 20.x 以上
- npm 10.x 以上

### インストール

```bash
# リポジトリクローン
git clone https://github.com/kakeru-ikeda/link-like-essentials-frontend.git
cd link-like-essentials-frontend

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.localファイルを編集して必要な値を設定
```

### 環境変数の設定

`.env.local` に以下の環境変数を設定してください:

```bash
# アプリケーションの基本URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GraphQL APIエンドポイント
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql

# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# microCMS設定（サーバーサイド専用）
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=link-like-essentials
SENTRY_PROJECT=lles-frontend
```

### Sentry 動作確認

- `NEXT_PUBLIC_SENTRY_DSN` と `SENTRY_AUTH_TOKEN` を `.env` に設定し、`npm run dev` を起動
- 任意のページで意図的に例外を発生させ、Sentry ダッシュボードでイベントを確認
- ビルド時にソースマップをアップロードする場合は `SENTRY_ORG`、`SENTRY_PROJECT`、`SENTRY_AUTH_TOKEN` を CI/Vercel 環境変数に登録

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📁 プロジェクト構成

```
src/
├── app/                    # Next.js App Router
├── components/             # UIコンポーネント（フラット構造）
│   ├── common/            # 共通コンポーネント
│   │   ├── AceBadge.tsx
│   │   ├── ApBadge.tsx
│   │   ├── Button.tsx
│   │   ├── FavoriteModeBadge.tsx
│   │   ├── Loading.tsx
│   │   ├── Modal.tsx
│   │   ├── RarityBadge.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SideModal.tsx
│   │   └── StyleTypeBadge.tsx
│   └── deck/              # デッキビルダー関連
│       ├── CardItem.tsx
│       ├── CardList.tsx
│       ├── CardListItem.tsx
│       ├── CurrentCardDisplay.tsx
│       ├── DeckBuilder.tsx
│       └── DeckSlot.tsx
├── hooks/                  # カスタムフック
├── services/               # ビジネスロジック
├── repositories/           # データアクセス層
├── store/                  # 状態管理（Zustand）
├── models/                 # 型定義
├── constants/              # 定数
└── utils/                  # ユーティリティ関数
```

**設計のポイント:**

- フラット構造により `index.ts` の乱立を防止
- 単一ファイルで完結するシンプルな構成
- Tailwind CSS によるインラインスタイル

詳細は [設計書](./docs/DESIGN.md) を参照してください。

## 🧪 テスト

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き
npm run test:coverage
```

## 🔍 コード品質チェック

```bash
# Lint
npm run lint

# Lint自動修正
npm run lint:fix

# 型チェック
npm run type-check

# フォーマット
npm run format
```

## 📦 ビルド

```bash
# プロダクションビルド
npm run build

# ビルドしたアプリを起動
npm start
```

## 🏗 アーキテクチャ

レイヤードアーキテクチャに基づく設計:

```
┌─────────────────────────────────────────┐
│   Presentation Layer (components)       │  ← UI Components
├─────────────────────────────────────────┤
│   Application Layer (services)          │  ← Business Logic
├─────────────────────────────────────────┤
│   Infrastructure Layer (repositories)   │  ← GraphQL API, Firebase
└─────────────────────────────────────────┘
```

### 設計原則

1. **徹底したコンポーネント化**: Atomic Design パターンの適用
2. **フラット構造**: `index.ts` の乱立を避け、シンプルな構成を維持
3. **ビジネスロジックの分離**: カスタムフックでロジックを抽出
4. **依存関係の方向**: components → services → repositories

詳細は [Copilot インストラクション](./.github/copilot-instructions.md) を参照してください。

## 🔌 バックエンド連携

このフロントエンドは以下のバックエンド API と連携します:

- **Repository**: [link-like-essentials-backend](https://github.com/kakeru-ikeda/link-like-essentials-backend)
- **API**: GraphQL (Apollo Server)
- **認証**: Firebase Authentication

### GraphQL クエリ例

```graphql
query GetCards($filter: CardFilterInput) {
  cards(first: 20, filter: $filter) {
    edges {
      node {
        id
        cardName
        characterName
        rarity
        styleType
      }
    }
  }
}
```

## 📚 ドキュメント

- [設計書](./docs/DESIGN.md) - アーキテクチャ、データモデル、画面設計
- [Copilot インストラクション](./.github/copilot-instructions.md) - 開発ガイドライン
- [バックエンドドキュメント](https://github.com/kakeru-ikeda/link-like-essentials-backend/blob/main/docs/GRAPHQL_QUERY_EXAMPLES.md) - GraphQL API 仕様

## 🤝 コントリビューション

1. Feature ブランチを作成 (`git checkout -b feature/amazing-feature`)
2. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
3. ブランチにプッシュ (`git push origin feature/amazing-feature`)
4. Pull Request を作成

### コミットメッセージ規約

Conventional Commits に準拠してください:

```
feat: 新機能
fix: バグ修正
docs: ドキュメント更新
style: コードフォーマット
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・設定変更
```

## 🚢 デプロイ

### Vercel へのデプロイ

1. Vercel アカウントにログイン
2. GitHub リポジトリを接続
3. 環境変数を設定
4. デプロイ

詳細は [Vercel 公式ドキュメント](https://vercel.com/docs) を参照してください。

## 📈 今後の拡張予定

- [ ] デッキの複数保存機能
- [ ] デッキのシェア機能（URL での共有）
- [ ] デッキの統計分析機能
- [ ] カードのお気に入り機能
- [ ] デッキのエクスポート/インポート（JSON）
- [ ] PWA 対応（オフライン利用）
- [ ] ダークモード対応

## 📝 ライセンス

MIT License

## 🔗 関連リンク

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Apollo Client 公式ドキュメント](https://www.apollographql.com/docs/react/)
- [Firebase 公式ドキュメント](https://firebase.google.com/docs)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [参考アーキテクチャ記事](https://zenn.dev/mongolyy/articles/01f0a4375edb2e)

