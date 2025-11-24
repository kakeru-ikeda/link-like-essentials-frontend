# Link Like Essentials Frontend - 設計書

## 📋 目次

- [概要](#概要)
- [技術スタック](#技術スタック)
- [アーキテクチャ](#アーキテクチャ)
- [ディレクトリ構成](#ディレクトリ構成)
- [データモデル](#データモデル)
- [機能要件](#機能要件)
- [画面設計](#画面設計)
- [状態管理](#状態管理)
- [API 連携](#api連携)
- [認証](#認証)
- [デプロイ](#デプロイ)

## 🎯 概要

「Link! Like! ラブライブ!」のカードデッキビルダー Web アプリケーション。  
スマートフォン向けアプリで扱うカードを、最大 18 枚まで編成できるデッキビルダーを提供する。

### 主要機能

- キャラクター別のカード編成（9 キャラクター × 2 枚 = 18 枚）
- GraphQL API からのカード情報取得
- Firebase Authentication 匿名ログイン
- レスポンシブデザイン（モバイルファースト）

## 🛠 技術スタック

### フレームワーク・ライブラリ

- **フレームワーク**: Next.js 14.x (App Router)
- **言語**: TypeScript 5.x
- **UI ライブラリ**: React 18.x
- **スタイリング**: Tailwind CSS 3.x
- **状態管理**: Zustand 4.x
- **GraphQL クライアント**: Apollo Client 3.x
- **認証**: Firebase Authentication 10.x
- **フォーム**: React Hook Form 7.x + Zod
- **テスト**: Jest + React Testing Library
- **ホスティング**: Vercel

### 開発ツール

- **Linter**: ESLint
- **Formatter**: Prettier
- **型チェック**: TypeScript
- **Git Hooks**: Husky + lint-staged

## 🏗 アーキテクチャ

レイヤードアーキテクチャに基づく設計（参考: [Next.js のディレクトリ構成](https://zenn.dev/mongolyy/articles/01f0a4375edb2e)）

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

1. **徹底したコンポーネント化**
   - 単一責任の原則に基づくコンポーネント分割
   - Atomic Design パターンの適用
   - Presentational / Container Component の分離

2. **ビジネスロジックの分離**
   - カスタムフック（Composables）でロジックを抽出
   - コンポーネントは UI 表示に専念

3. **依存関係の方向**
   - components → services → repositories
   - 上位層は下位層に依存、逆は NG

## 📁 ディレクトリ構成

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証関連ページグループ
│   │   └── login/
│   ├── deck/                     # デッキビルダーページ
│   │   └── page.tsx
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # ホームページ
│
├── components/                   # UIコンポーネント
│   ├── common/                   # 共通コンポーネント
│   │   ├── Button/
│   │   ├── Loading/
│   │   ├── Modal/
│   │   └── ErrorBoundary/
│   │
│   ├── deck/                     # デッキビルダー関連
│   │   ├── DeckBuilder/          # デッキビルダーメインコンポーネント
│   │   ├── DeckSlot/             # カードスロット（キャラ枠）
│   │   ├── CardList/             # カード一覧
│   │   ├── CardItem/             # カードアイテム
│   │   ├── CardDetail/           # カード詳細モーダル
│   │   └── DeckStats/            # デッキ統計情報
│   │
│   └── layout/                   # レイアウトコンポーネント
│       ├── Header/
│       ├── Footer/
│       └── Navigation/
│
├── services/                     # ビジネスロジック層
│   ├── deck/
│   │   ├── deckService.ts        # デッキ編成ロジック
│   │   └── deckValidation.ts    # デッキバリデーション
│   │
│   └── card/
│       ├── cardService.ts        # カード操作ロジック
│       └── cardFilter.ts         # カードフィルタリング
│
├── repositories/                 # データアクセス層
│   ├── graphql/
│   │   ├── client.ts             # Apollo Client設定
│   │   ├── queries/              # GraphQLクエリ
│   │   │   ├── cards.ts
│   │   │   ├── cardDetail.ts
│   │   │   └── accessories.ts
│   │   └── types/                # GraphQL型定義
│   │       └── generated.ts
│   │
│   └── firebase/
│       ├── auth.ts               # Firebase Auth設定
│       └── config.ts             # Firebase設定
│
├── hooks/                        # カスタムフック（Composables）
│   ├── useDeck.ts                # デッキ管理フック
│   ├── useCards.ts               # カード取得フック
│   ├── useCardFilter.ts          # カードフィルターフック
│   └── useAuth.ts                # 認証フック
│
├── store/                        # 状態管理（Zustand）
│   ├── deckStore.ts              # デッキ状態
│   ├── cardStore.ts              # カード状態
│   └── authStore.ts              # 認証状態
│
├── models/                       # 型定義・モデル
│   ├── Card.ts                   # カード型
│   ├── Deck.ts                   # デッキ型
│   ├── Character.ts              # キャラクター型
│   └── enums.ts                  # Enum定義
│
├── constants/                    # 定数
│   ├── characters.ts             # キャラクター定数
│   ├── deckConfig.ts             # デッキ設定
│   └── apiEndpoints.ts           # APIエンドポイント
│
├── utils/                        # ユーティリティ関数
│   ├── format.ts                 # フォーマット関数
│   ├── validation.ts             # バリデーション
│   └── error.ts                  # エラーハンドリング
│
└── styles/                       # スタイル
    ├── globals.css               # グローバルスタイル
    └── tailwind.config.ts        # Tailwind設定
```

## 📊 データモデル

### Card（カード）

```typescript
interface Card {
  id: string;
  rarity: Rarity;
  limited: LimitedType;
  cardName: string;
  cardUrl: string;
  characterName: string;
  styleType: StyleType;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  detail?: CardDetail;
  accessories: Accessory[];
}

enum Rarity {
  UR = 'UR',
  SR = 'SR',
  R = 'R',
  DR = 'DR',
  BR = 'BR',
  LR = 'LR',
}

enum StyleType {
  CHEERLEADER = 'CHEERLEADER',
  TRICKSTER = 'TRICKSTER',
  PERFORMER = 'PERFORMER',
  MOODMAKER = 'MOODMAKER',
}

enum LimitedType {
  PERMANENT = 'PERMANENT',
  LIMITED = 'LIMITED',
  BIRTHDAY_LIMITED = 'BIRTHDAY_LIMITED',
  // ... 他の限定区分
}
```

### CardDetail（カード詳細）

```typescript
interface CardDetail {
  id: string;
  cardId: number;
  favoriteMode: FavoriteMode;
  acquisitionMethod: string;
  stats: Stats;
  specialAppeal?: Skill;
  skill?: Skill;
  trait?: Trait;
  accessories: Accessory[];
}

interface Stats {
  smile: number;
  pure: number;
  cool: number;
  mental: number;
}

interface Skill {
  name: string;
  ap?: string;
  effect?: string;
}

interface Trait {
  name: string;
  effect?: string;
}
```

### Accessory（アクセサリー）

```typescript
interface Accessory {
  id: string;
  cardId: number;
  parentType: ParentType;
  name: string;
  ap?: string;
  effect?: string;
  traitName?: string;
  traitEffect?: string;
}

enum ParentType {
  SPECIAL_APPEAL = 'SPECIAL_APPEAL',
  SKILL = 'SKILL',
  TRAIT = 'TRAIT',
}
```

### Deck（デッキ）

```typescript
interface Deck {
  id: string;
  name: string;
  slots: DeckSlot[];
  createdAt: string;
  updatedAt: string;
}

interface DeckSlot {
  slotId: number; // 0-17（18枠）
  characterName: CharacterName;
  card: Card | null;
}

type CharacterName =
  | 'セラス'
  | '桂城泉'
  | 'フリー'
  | '百生吟子'
  | '徒町小鈴'
  | '安養寺姫芽'
  | '日野下花帆'
  | '村野さやか'
  | '大沢瑠璃乃';
```

### デッキ構成マッピング

```typescript
// 各キャラクター2枠ずつ（計18枠）
const DECK_SLOT_MAPPING = [
  // 上段
  { slotId: 0, characterName: 'セラス', row: 0, col: 0 },
  { slotId: 1, characterName: 'セラス', row: 0, col: 1 },
  { slotId: 2, characterName: '桂城泉', row: 0, col: 2 },
  { slotId: 3, characterName: '桂城泉', row: 0, col: 3 },
  { slotId: 4, characterName: 'フリー', row: 0, col: 4 },
  { slotId: 5, characterName: 'フリー', row: 0, col: 5 },

  // 中段
  { slotId: 6, characterName: '百生吟子', row: 1, col: 0 },
  { slotId: 7, characterName: '百生吟子', row: 1, col: 1 },
  { slotId: 8, characterName: '徒町小鈴', row: 1, col: 2 },
  { slotId: 9, characterName: '徒町小鈴', row: 1, col: 3 },
  { slotId: 10, characterName: '安養寺姫芽', row: 1, col: 4 },
  { slotId: 11, characterName: '安養寺姫芽', row: 1, col: 5 },

  // 下段
  { slotId: 12, characterName: '日野下花帆', row: 2, col: 0 },
  { slotId: 13, characterName: '日野下花帆', row: 2, col: 1 },
  { slotId: 14, characterName: '村野さやか', row: 2, col: 2 },
  { slotId: 15, characterName: '村野さやか', row: 2, col: 3 },
  { slotId: 16, characterName: '大沢瑠璃乃', row: 2, col: 4 },
  { slotId: 17, characterName: '大沢瑠璃乃', row: 2, col: 5 },
];
```

## 📱 機能要件

### 1. デッキビルダー機能

#### 1.1 デッキスロット表示

- 18 個のスロット（3 行 × 6 列）を表示
- 各スロットにはキャラクター名を表示
- 空のスロットと埋まっているスロットを視覚的に区別
- スロットクリックでカード選択モーダルを表示

#### 1.2 カード選択機能

- スロットに対応するキャラクターのカード一覧を表示
- フリー枠はすべてのキャラクターのカードを表示
- カード一覧は以下でフィルタリング可能:
  - レアリティ（UR, SR, R, DR, BR, LR）
  - スタイルタイプ（CHEERLEADER, TRICKSTER, PERFORMER, MOODMAKER）
  - 限定区分
  - カード名（部分一致検索）

#### 1.3 カード詳細表示

- カード画像
- カード名、キャラクター名
- レアリティ、スタイルタイプ
- ステータス（smile, pure, cool, mental）
- スキル、スペシャルアピール、特性
- アクセサリー情報

#### 1.4 デッキ保存・読み込み

- LocalStorage へのデッキ保存
- 複数デッキの保存・管理（後続フェーズ）
- デッキのエクスポート/インポート（後続フェーズ）

### 2. 認証機能

#### 2.1 Firebase 匿名ログイン

- アプリ起動時に自動的に匿名ログイン
- トークンを GraphQL リクエストの Authorization ヘッダーに付与
- トークンの自動更新

### 3. UI/UX 要件

- **レスポンシブデザイン**: モバイルファーストで設計
- **ローディング表示**: データ取得中はスケルトンまたはスピナー表示
- **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージ
- **アクセシビリティ**: キーボード操作対応、WAI-ARIA 対応

## 🎨 画面設計

### 画面一覧

1. **ホーム画面** (`/`)
   - アプリの説明
   - デッキビルダーへのリンク

2. **デッキビルダー画面** (`/deck`)
   - デッキスロット表示エリア
   - デッキ統計情報（総ステータス、レアリティ分布など）
   - 保存/読み込みボタン

3. **カード選択モーダル**
   - カード一覧表示
   - フィルター/検索 UI
   - ページネーション

4. **カード詳細モーダル**
   - カード画像
   - 詳細情報
   - スロットに追加ボタン

### ワイヤーフレーム

```
┌─────────────────────────────────────┐
│  Header                             │
├─────────────────────────────────────┤
│  Deck Builder                       │
│                                     │
│  ┌───┬───┬───┬───┬───┬───┐         │
│  │セ │セ │泉 │泉 │フ │フ │  上段   │
│  └───┴───┴───┴───┴───┴───┘         │
│  ┌───┬───┬───┬───┬───┬───┐         │
│  │吟 │吟 │鈴 │鈴 │姫 │姫 │  中段   │
│  └───┴───┴───┴───┴───┴───┘         │
│  ┌───┬───┬───┬───┬───┬───┐         │
│  │花 │花 │さ │さ │瑠 │瑠 │  下段   │
│  └───┴───┴───┴───┴───┴───┘         │
│                                     │
│  Stats: Total Power: 12345          │
│  [保存] [読み込み]                  │
└─────────────────────────────────────┘
```

## 🗃 状態管理

### Zustand ストア設計

#### deckStore（デッキ状態）

```typescript
interface DeckState {
  deck: Deck | null;

  // Actions
  setDeck: (deck: Deck) => void;
  addCardToSlot: (slotId: number, card: Card) => void;
  removeCardFromSlot: (slotId: number) => void;
  clearDeck: () => void;
  saveDeckToLocal: () => void;
  loadDeckFromLocal: () => void;
}
```

#### cardStore（カード状態）

```typescript
interface CardState {
  cards: Card[];
  selectedCard: Card | null;
  filters: CardFilters;

  // Actions
  setCards: (cards: Card[]) => void;
  setSelectedCard: (card: Card | null) => void;
  updateFilters: (filters: Partial<CardFilters>) => void;
  clearFilters: () => void;
}
```

#### authStore（認証状態）

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}
```

## 🔌 API 連携

### GraphQL クエリ例

#### カード一覧取得

```graphql
query GetCards($first: Int, $after: String, $filter: CardFilterInput) {
  cards(first: $first, after: $after, filter: $filter) {
    edges {
      node {
        id
        cardName
        characterName
        rarity
        styleType
        limited
        cardUrl
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

#### カード詳細取得

```graphql
query GetCardDetail($id: ID!) {
  card(id: $id) {
    id
    cardName
    characterName
    rarity
    styleType
    cardUrl
    detail {
      stats {
        smile
        pure
        cool
        mental
      }
      specialAppeal {
        name
        ap
        effect
      }
      skill {
        name
        ap
        effect
      }
      trait {
        name
        effect
      }
      accessories {
        id
        name
        effect
        traitName
        traitEffect
      }
    }
  }
}
```

### Apollo Client 設定

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { auth } from './firebase/config';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser?.getIdToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

## 🔐 認証

### Firebase 匿名ログイン実装

```typescript
// repositories/firebase/auth.ts
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config';

export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('匿名ログインエラー:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

### App 初期化時の認証処理

```typescript
// app/layout.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initAuth } = useAuth();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

## 🚀 デプロイ

### Vercel 設定

#### 環境変数

```bash
# .env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend.com/graphql
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

#### ビルドコマンド

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### CI/CD（GitHub Actions）

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/vercel-cli-action@v3
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📝 開発フロー

1. **環境構築**

   ```bash
   npm create next-app@latest link-like-essentials-frontend
   cd link-like-essentials-frontend
   npm install
   ```

2. **必要パッケージのインストール**

   ```bash
   npm install @apollo/client graphql
   npm install firebase
   npm install zustand
   npm install react-hook-form zod @hookform/resolvers
   npm install -D tailwindcss postcss autoprefixer
   npm install -D @types/node typescript
   ```

3. **開発サーバー起動**

   ```bash
   npm run dev
   ```

4. **コーディング規約**
   - ESLint + Prettier に準拠
   - TypeScript の厳密な型チェック有効
   - コンポーネント名は PascalCase
   - ファイル名は kebab-case（コンポーネントは PascalCase）

## 🧪 テスト戦略

### ユニットテスト

- カスタムフックのテスト
- サービス層のロジックテスト
- ユーティリティ関数のテスト

### コンポーネントテスト

- React Testing Library による描画テスト
- ユーザーインタラクションテスト
- スナップショットテスト

### E2E テスト（後続フェーズ）

- Playwright による主要フローのテスト

## 📈 今後の拡張予定

- [ ] デッキの複数保存機能
- [ ] デッキのシェア機能（URL での共有）
- [ ] デッキの統計分析機能
- [ ] カードのお気に入り機能
- [ ] デッキのエクスポート/インポート（JSON）
- [ ] PWA 対応（オフライン利用）
- [ ] ダークモード対応

## 🔗 参考資料

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Apollo Client 公式ドキュメント](https://www.apollographql.com/docs/react/)
- [Firebase 公式ドキュメント](https://firebase.google.com/docs)
- [Zustand 公式ドキュメント](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [Next.js のディレクトリ構成を考えてみた](https://zenn.dev/mongolyy/articles/01f0a4375edb2e)
- [Link Like Essentials Backend](https://github.com/kakeru-ikeda/link-like-essentials-backend)
