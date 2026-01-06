# コード構成ガイド - 定数・設定・マッピング管理

このドキュメントでは、プロジェクト内での定数、設定、マッピング、ユーティリティ関数の管理方法について説明します。

## ディレクトリ構造

```
├── models/
│   └── enums.ts                    # すべてのEnum定義
├── config/                         # 純粋な設定定数
│   ├── api.ts                      # APIエンドポイント
│   ├── characters.ts               # キャラクター一覧
│   ├── deckSlots.ts                # デッキスロット定義
│   ├── generations.ts              # 期・ユニット定義
│   └── skillEffects.ts             # スキル効果定義
├── styles/
│   └── colors.ts                   # 色定義の集約
├── mappers/
│   └── enumMappers.ts              # Enum→日本語ラベルマッピング
├── utils/                          # ユーティリティ関数
│   ├── colorUtils.ts               # 色変換・取得
│   └── skillEffectUtils.ts         # スキル効果関連
└── services/                       # ビジネスロジック
    ├── deckConfigService.ts        # デッキ設定ロジック
    └── deckRulesService.ts         # デッキルールロジック
```

## 各ディレクトリの役割

### `models/enums.ts`
**用途**: すべてのEnum定義を集約

**含まれるもの**:
- Rarity (UR, SR, R, DR, BR, LR)
- StyleType (CHEERLEADER, TRICKSTER, PERFORMER, MOODMAKER)
- LimitedType (PERMANENT, LIMITED, BIRTHDAY_LIMITED, ...)
- FavoriteMode (HAPPY, MELLOW, NEUTRAL, NONE)
- DeckType (TERM_103, TERM_104, TERM_105, ...)
- SongAttribute (SMILE, PURE, COOL)
- SkillEffectType (HEART_CAPTURE, WIDE_HEART, ...)
- SkillSearchTarget (SPECIAL_APPEAL, SKILL, TRAIT, ...)
- ParentType (SPECIAL_APPEAL, SKILL, TRAIT)

**ルール**:
- 新しいEnumは必ずここに追加
- GraphQLのクエリで使用するEnumもここで定義
- string値を持つEnumを推奨（型安全性とデバッグ容易性のため）

### `config/` - 純粋な設定定数

**用途**: ロジックを含まない、変更される可能性のある設定値

#### `config/api.ts`
APIエンドポイントの定義
```typescript
export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '...';
export const DECK_API_ENDPOINT = `${FUNCTIONS_BASE_URL}/deckApi`;
```

#### `config/characters.ts`
キャラクター一覧と型定義
```typescript
export const CHARACTERS = ['日野下花帆', '村野さやか', ...] as const;
export type CharacterName = (typeof CHARACTERS)[number] | 'フリー' | 'フレンド';
```

#### `config/deckSlots.ts`
デッキスロットの物理的な配置データ
```typescript
export const DECK_SLOT_MAPPING_105: DeckSlotMapping[] = [
  { slotId: 0, characterName: 'セラス', slotType: 'main', row: 0, col: 1 },
  ...
];
```

#### `config/generations.ts`
期・ユニット別のキャラクター所属情報
```typescript
export const GENERATION_MEMBERS = {
  101: ['大賀美沙知'],
  102: ['乙宗梢', '夕霧綴理', '藤島慈'],
  ...
};
```

#### `config/skillEffects.ts`
スキル効果の説明文とキーワード
```typescript
export const SKILL_EFFECT_DESCRIPTIONS: Record<SkillEffectType, string> = {...};
export const SKILL_EFFECT_KEYWORDS: Record<SkillEffectType, string[]> = {...};
```

### `styles/colors.ts` - 色定義の集約

**用途**: すべての色定義（HEXカラーコード）を一元管理

```typescript
export const CHARACTER_COLORS: Record<string, string> = {
  日野下花帆: '#f8b500',
  ...
};

export const RARITY_COLORS: Record<Rarity, string> = {...};
export const STYLE_TYPE_COLORS: Record<StyleType, string> = {...};
export const LIMITED_TYPE_COLORS: Record<LimitedType, string> = {...};
export const FAVORITE_MODE_COLORS: Record<FavoriteMode, string> = {...};
```

**ルール**:
- 新しい色を追加する場合は必ずここに
- 色定義は必ずHEXカラーコード (`#RRGGBB`) で統一
- Enumに対応する色は `Record<EnumType, string>` 型で定義

### `mappers/enumMappers.ts` - Enum→日本語ラベルマッピング

**用途**: EnumをUIで表示する日本語ラベルに変換

```typescript
export const RARITY_LABELS: Record<Rarity, string> = {
  [Rarity.UR]: 'UR',
  [Rarity.SR]: 'SR',
  ...
};

export const STYLE_TYPE_LABELS: Record<StyleType, string> = {
  [StyleType.CHEERLEADER]: 'チアリーダー',
  ...
};
```

**ルール**:
- すべてのマッピングは `Record<EnumType, string>` 型で定義
- Enumキー → 日本語ラベル（または英語ラベル）の1対1対応
- 新しいEnumには必ず対応するラベルマッピングを作成

### `utils/` - ユーティリティ関数

**用途**: 汎用的な変換・計算ロジック（ビジネスロジックを含まない）

#### `utils/colorUtils.ts`
色変換と色取得の関数
```typescript
export function hexToRgba(hex: string, opacity: number): string {...}
export function getCharacterColor(characterName: string): string {...}
export function getCharacterBackgroundColor(characterName: string, opacity?: number): string {...}
```

#### `utils/skillEffectUtils.ts`
スキル効果のキーワード取得
```typescript
export function getSkillEffectKeyword(effectType: SkillEffectType): string[] {...}
export function getSkillEffectKeywords(effectTypes: SkillEffectType[]): string[] {...}
```

**ルール**:
- 単一責任の原則に従う
- 副作用のない純粋関数を推奨
- 複数の場所で使用される汎用ロジックのみ

### `services/` - ビジネスロジック

**用途**: アプリケーション固有のビジネスルール・ロジック

#### `services/deckConfigService.ts`
デッキタイプに応じたスロット取得ロジック
```typescript
export function getDeckSlotMapping(deckType?: DeckType): DeckSlotMapping[] {...}
export function getDeckFrame(deckType?: DeckType): CharacterName[] {...}
```

#### `services/deckRulesService.ts`
デッキ編成ルールの判定ロジック
```typescript
export function canPlaceCardInSlot(cardInfo, slotId, deckType?): { allowed: boolean; reason?: string } {...}
export function getCharacterGeneration(characterName: string): number | null {...}
export function getCharacterUnit(characterName: string): string | null {...}
```

**ルール**:
- ビジネスロジックに特化
- 複雑な判定・計算ロジックはここに配置
- config/ や utils/ の関数を組み合わせて使用

## 新しい定数・設定を追加する際のガイドライン

### 1. どこに追加するか判断する

**フローチャート**:
```
Enumか？
├─ Yes → models/enums.ts
└─ No
    ├─ 色定義か？
    │   └─ Yes → styles/colors.ts
    ├─ Enum→ラベルマッピングか？
    │   └─ Yes → mappers/enumMappers.ts
    ├─ 計算・変換ロジックか？
    │   ├─ 汎用的 → utils/
    │   └─ ビジネス固有 → services/
    └─ 純粋な定数データか？
        └─ Yes → config/
```

### 2. 追加例

#### 新しいEnumを追加する場合

1. `models/enums.ts` にEnumを追加
```typescript
export enum NewType {
  TYPE_A = 'TYPE_A',
  TYPE_B = 'TYPE_B',
}
```

2. `styles/colors.ts` に色定義を追加（必要な場合）
```typescript
export const NEW_TYPE_COLORS: Record<NewType, string> = {
  [NewType.TYPE_A]: '#ff0000',
  [NewType.TYPE_B]: '#00ff00',
};
```

3. `mappers/enumMappers.ts` にラベルマッピングを追加
```typescript
export const NEW_TYPE_LABELS: Record<NewType, string> = {
  [NewType.TYPE_A]: 'タイプA',
  [NewType.TYPE_B]: 'タイプB',
};
```

## ベストプラクティス

### ✅ Good

```typescript
// config/characters.ts
export const CHARACTERS = [...] as const;

// styles/colors.ts
export const CHARACTER_COLORS: Record<string, string> = {...};

// utils/colorUtils.ts
export function getCharacterColor(characterName: string): string {
  return CHARACTER_COLORS[characterName] || '#cccccc';
}

// Component内
import { getCharacterColor } from '@/utils/colorUtils';
const color = getCharacterColor(character);
```

### ❌ Bad

```typescript
// constants/characters.ts に全部詰め込む
export const CHARACTERS = [...];
export const CHARACTER_COLORS = {...};
export function getCharacterColor(name: string) {...}
export function getCharacterBackgroundColor(name: string, opacity: number) {...}
// → 責務が不明瞭
```

## マイグレーションの履歴

| 旧パス | 新パス | 種類 |
|--------|--------|------|
| `constants/characters.ts` → CHARACTERS | `config/characters.ts` | 定数 |
| `constants/characters.ts` → CHARACTER_COLORS | `styles/colors.ts` | 色定義 |
| `constants/characters.ts` → getCharacterColor | `utils/colorUtils.ts` | ユーティリティ |
| `constants/labels.ts` → *_LABELS | `mappers/enumMappers.ts` | マッピング |
| `constants/labels.ts` → *_COLORS | `styles/colors.ts` | 色定義 |
| `constants/enumMappings.ts` | `mappers/enumMappers.ts` | マッピング |
| `constants/deckConfig.ts` → mapping定数 | `config/deckSlots.ts` | 定数 |
| `constants/deckConfig.ts` → getDeck* | `services/deckConfigService.ts` | ビジネスロジック |
| `constants/deckRules.ts` | `services/deckRulesService.ts` | ビジネスロジック |
| `constants/skillEffects.ts` → Enum | `models/enums.ts` | Enum |
| `constants/skillEffects.ts` → 定数 | `config/skillEffects.ts` | 定数 |
| `constants/skillEffects.ts` → get* | `utils/skillEffectUtils.ts` | ユーティリティ |
| `constants/apiEndpoints.ts` | `config/api.ts` | 定数 |

## トラブルシューティング

### Q: どこに配置すべきか迷った場合は？
A: 以下の順で検討してください:
1. 既存の類似コードがある場所を探す
2. 責務を考える（設定？色？ロジック？）
3. 迷ったら `config/` に配置（後で移動しやすい）

### Q: 複数の場所で同じ定数を使いたい場合は？
A: 必ず適切な場所に1箇所だけ定義し、importして使用してください。重複定義は避けること。

### Q: 既存コードをリファクタリングする場合は？
A: このガイドに従って段階的に移行してください。一度に全部変更せず、ファイル単位・機能単位で進めること。
