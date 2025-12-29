# Copilot Instructions

## レビュー

- **Copilotは日本語でレビューを行うこと**

## アーキテクチャ

```
components/ → services/ → repositories/
```

- **components/**: UI のみ。ビジネスロジック禁止
- **services/**: ビジネスロジック。複数 repository を組み合わせ可
- **repositories/**: 外部 API・Firebase 通信のみ

**依存関係をスキップしない**（例: components から直接 repositories を呼ばない）

## 型定義ルール

- `any`禁止（必要なら`unknown`）
- オブジェクト形状は`interface`、ユニオン型は`type`
- Enum は`models/enums.ts`に集約

## GraphQL スキーマ（バックエンド）

### 主要型

```typescript
type Card {
  id: ID!
  cardName: String!
  characterName: String!
  rarity: Rarity
  styleType: StyleType
  limited: LimitedType
  cardUrl: String
  detail: CardDetail
  accessories: [Accessory!]!
}

type CardDetail {
  stats: Stats!
  specialAppeal: Skill
  skill: Skill
  trait: Trait
}

enum Rarity { UR, SR, R, DR, BR, LR }
enum StyleType { CHEERLEADER, TRICKSTER, PERFORMER, MOODMAKER }
```

### クエリ定義場所

```typescript
// repositories/graphql/queries/cards.ts
export const GET_CARDS = gql`
  query GetCards($first: Int, $filter: CardFilterInput) {
    cards(first: $first, filter: $filter) {
      edges {
        node {
          id
          cardName
          characterName
          rarity
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
```

### カスタムフックで実行

```typescript
// hooks/useCards.ts
export function useCards(filter?: CardFilterInput) {
  const { data, loading, error } = useQuery(GET_CARDS, {
    variables: { first: 20, filter },
  });
  return {
    cards: data?.cards.edges.map((edge) => edge.node) ?? [],
    loading,
    error: error?.message,
  };
}
```

## 状態管理（Zustand + Immer）

```typescript
// store/deckStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useDeckStore = create<DeckState>()(
  immer((set) => ({
    deck: null,
    addCardToSlot: (slotId, card) =>
      set((state) => {
        if (state.deck) state.deck.slots[slotId].card = card;
      }),
  }))
);
```

## Firebase 認証

```typescript
// repositories/firebase/auth.ts
export const signInAnonymous = () => signInAnonymously(auth);
export const onAuthStateChange = (callback) =>
  onAuthStateChanged(auth, callback);

// Apollo Client設定でトークン自動付与
const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser?.getIdToken();
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '' },
  };
});
```

## 定数

```typescript
// constants/characters.ts
export const CHARACTERS = [
  'セラス',
  '桂城泉',
  'フリー',
  '百生吟子',
  '徒町小鈴',
  '安養寺姫芽',
  '日野下花帆',
  '村野さやか',
  '大沢瑠璃乃',
] as const;

// constants/deckConfig.ts
export const DECK_SLOT_COUNT = 18;
export const DECK_SLOT_MAPPING = [
  { slotId: 0, characterName: 'セラス', row: 0, col: 0 },
  { slotId: 1, characterName: 'セラス', row: 0, col: 1 },
  // ... 各キャラ2枠ずつ計18枠
];
```

## スタイリング

- Tailwind CSS のインラインクラス使用
- モバイルファースト: `sm:`, `md:`, `lg:`, `xl:`
- 絶対パス: `@/`エイリアス使用

## コンポーネント構造

**フラット構造を採用** - `index.ts` の乱立を避けるため、各ディレクトリ直下に `.tsx` ファイルを配置

```
components/
  common/
    AceBadge.tsx
    ApBadge.tsx
    Button.tsx
    ...
  deck/
    CardItem.tsx
    CardList.tsx
    DeckBuilder.tsx
    ...
```

### import ルール

```typescript
// 正しい import（拡張子は省略可能）
import { RarityBadge } from '@/components/common/RarityBadge';
import { CardList } from '@/components/deck/CardList';

// 誤った import（index.ts は不要）
import { RarityBadge } from '@/components/common/RarityBadge/';
```

### 新規コンポーネント作成時

- ディレクトリを作らず、直接 `.tsx` ファイルを作成
- 単一ファイルで完結させる（スタイルは Tailwind でインライン）
- 複数ファイルが必要な場合のみディレクトリ化を検討
