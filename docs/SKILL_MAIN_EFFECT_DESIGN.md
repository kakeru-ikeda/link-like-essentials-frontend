# メイン効果検索 設計書

## 概要

カード検索において「**メイン効果検索**」機能を追加する。  
メイン効果とは、スキル文言を「。」で区切った **最初の文節** の中で、**最初の文字位置にマッチするキーワード** に対応する効果タイプである。

DB・バックエンドの変更なし。フロントエンドのみで完結する。

### 例

```
「手札をリセットシャッフルし、メンタルが200%以上のとき、ビートハート570回分の
スキルハートを獲得し、このステージ中、ハート上限を+1368する。
さらにカードがステージにセットされ...」
```

- 最初の文節（最初の「。」より前）: 「手札をリセットシャッフルし、...ハート上限を+1368する」
- ヒットするキーワードの文字位置:
  - 「シャッフル」→ 位置 4（最小）
  - 「スキルハート獲得」→ 位置 21
  - 「ハート上限」→ 位置 35
- **メイン効果 = 「リシャッフル」**（文字位置が最小のキーワードのeffectType）

---

## 判定アルゴリズム

```
入力: スキル文言テキスト + Zustandストアの skillEffectTypes × skillEffectKeywords

1. テキストを「。」で分割し [0] を取得（第1文節）
2. skillEffectTypes の順に各 effectType を走査:
   a. そのeffectTypeのキーワード配列を第1文節でマッチング
   b. ヒットした場合、文字インデックスを記録（以降、より小さいインデックスで上書き）
   c. ヒットしたら次の effectType へ（同effectType内の複数キーワードは最初のヒットのみ使う）
3. 全走査後、インデックスが最小だったeffectTypeを返す
4. 1件もヒットしない場合は null を返す
```

---

## 変更箇所一覧（フロントエンドのみ）

### 1. `services/game/skillEffectService.ts`

メイン効果判定関数 `getMainSkillEffect` と内部ヘルパー `findKeywordIndex` を追加する。

```typescript
/**
 * スキル文言のメイン効果を判定する
 *
 * スキル文言を「。」で区切った最初の文節内で、
 * 最初の文字位置にマッチするキーワードに対応するeffectTypeを返す。
 *
 * @param skillEffect スキル効果テキスト
 * @returns マッチしたeffectType、なければ null
 */
export function getMainSkillEffect(
  skillEffect: string | undefined
): SkillEffectType | null {
  if (!skillEffect) return null;

  // 最初の「。」で区切られた第1文節を取得
  const firstClause = skillEffect.split('。')[0];
  if (!firstClause) return null;

  const { skillEffectTypes, skillEffectKeywords } =
    useEffectKeywordsStore.getState();

  let best: { effectType: SkillEffectType; index: number } | null = null;

  for (const effectType of skillEffectTypes) {
    const keywords = skillEffectKeywords[effectType] ?? [];
    for (const keyword of keywords) {
      const hitIndex = findKeywordIndex(firstClause, keyword);
      if (hitIndex === -1) continue;
      if (best === null || hitIndex < best.index) {
        best = { effectType, index: hitIndex };
      }
      break; // このeffectTypeの最先ヒットが確定したので次のeffectTypeへ
    }
  }

  return best?.effectType ?? null;
}

/** キーワードの先頭文字位置を返す（正規表現対応） */
function findKeywordIndex(text: string, keyword: string): number {
  if (keyword.includes('\\')) {
    try {
      const match = new RegExp(keyword).exec(text);
      return match ? match.index : -1;
    } catch {
      return text.indexOf(keyword);
    }
  }
  return text.indexOf(keyword);
}
```

---

### 2. `models/shared/Filter.ts`

`CardFilter` にメイン効果フィルタフィールドを追加する。

```typescript
export interface CardFilter {
  keyword?: string;
  rarities?: Rarity[];
  styleTypes?: StyleType[];
  limitedTypes?: LimitedType[];
  favoriteModes?: FavoriteMode[];
  characterNames?: string[];
  skillEffects?: SkillEffectType[];
  skillMainEffects?: SkillEffectType[]; // 追加: メイン効果フィルタ
  traitEffects?: TraitEffectType[];
  skillSearchTargets?: SkillSearchTarget[];
  filterMode?: FilterMode;
  hasTokens?: boolean;
}
```

> **`skillEffects` との違い:**
>
> | フィールド         | 検索対象範囲         | 判定方法                           |
> | ------------------ | -------------------- | ---------------------------------- |
> | `skillEffects`     | 全文節（任意の位置） | テキスト全体でキーワードをマッチ   |
> | `skillMainEffects` | 第1文節のみ          | 最初にヒットしたeffectTypeのみ合致 |

---

### 3. `services/card/cardFilterService.ts`

`filterCardsOnClient` に `skillMainEffects` フィルタ条件を追加する。  
メイン効果の判定には、スキル効果テキストから先頭文節のメイン効果を抽出するヘルパー `getMainSkillEffect` を利用する。  
**対象はスキル効果テキスト（`card.detail.skill?.effect` およびアクセサリー効果）のみ**。

```typescript
// --- filterCardsOnClient 内: skillEffects フィルタの後に追加 ---

// メイン効果検索（スキル効果テキストのみ対象）
if (filter.skillMainEffects && filter.skillMainEffects.length > 0) {
  const skillTexts: (string | undefined)[] = [
    card.detail?.skill?.effect,
    ...(card.accessories?.map((acc) => acc.effect) ?? []),
  ];

  const checkMainEffect = (effectType: SkillEffectType): boolean =>
    skillTexts.some((text) => getMainSkillEffect(text) === effectType);

  const mode = filter.filterMode ?? FilterMode.OR;
  const hasMainEffect =
    mode === FilterMode.OR
      ? filter.skillMainEffects.some(checkMainEffect)
      : filter.skillMainEffects.every(checkMainEffect);

  if (!hasMainEffect) return false;
}
```

```typescript
// --- ファイル末尾付近に追加するヘルパー ---

function getSkillTextsForTarget(
  card: Card,
  target: SkillSearchTarget
): (string | undefined)[] {
  switch (target) {
    case SkillSearchTarget.SKILL:
      return [
        card.detail?.skill?.effect,
        ...(card.accessories?.map((acc) => acc.effect) ?? []),
      ];
    case SkillSearchTarget.SPECIAL_APPEAL:
      return [card.detail?.specialAppeal?.effect];
    case SkillSearchTarget.TRAIT:
      return [
        card.detail?.trait?.effect,
        ...(card.accessories?.map((acc) => acc.traitEffect) ?? []),
      ];
    default:
      return [];
  }
}
```

> **補足**: `skillMainEffects` のデフォルト検索ターゲットは SKILL と SPECIAL_APPEAL のみ。  
> TRAIT を含めると「スキルキーワードを特性テキストで検索」という意味的な混在が生じるため除外。  
> ユーザーが手動で検索範囲に TRAIT を追加した場合は動作する。

---

### 4. `hooks/card/useCardFilterQuery.ts`

`skillMainEffects` を URL クエリパラメータとして管理する。  
`skillEffects` と `skillMainEffects` は**排他制御を行わず、両方を同時に保持できる**（ExpansionPanel による追加選択UI）。

```typescript
// CardFilterQueryParams に追加
type CardFilterQueryParams = {
  // ...既存...
  skillMainEffects?: SkillEffectType[];   // 追加
};

// cardFilterQuerySchema に追加（skillEffects と同一パターン）
skillMainEffects: {
  defaultValue: undefined,
  parse: (value) => {
    const state = useEffectKeywordsStore.getState();
    const validTypes = state.isLoaded
      ? state.skillEffectTypes
      : (parseStringList(value)?.filter((s) => /^[A-Z][A-Z0-9_]*$/.test(s)) as SkillEffectType[] | undefined);
    return parseEnumList(value, validTypes ?? []);
  },
  serialize: (value) => serializeList(value),
},

// toQueryParams に追加
skillMainEffects: filter.skillMainEffects,
```

---

### 5. `components/cards/filters/SkillEffectFilter.tsx`

メイン効果検索を ExpansionPanel で折りたたんで表示する（追加選択UI）。`skillEffects` と `skillMainEffects` は同時に有効にできる。

include/exclude の両モードで共用するため、`mode` プロップでツールチップ文言を切り替える。

**Props:**

```typescript
interface SkillEffectFilterProps {
  selectedEffects: SkillEffectType[] | undefined;
  selectedTargets: SkillSearchTarget[] | undefined;
  onToggleEffect: (effect: SkillEffectType) => void;
  onToggleTarget: (target: SkillSearchTarget) => void;
  selectedMainEffects?: SkillEffectType[] | undefined;
  onToggleMainEffect?: (effect: SkillEffectType) => void;
  mode?: 'include' | 'exclude'; // ツールチップ文言の切り替えに使用
}
```

---

### 6. `services/card/highlightService.ts`

メイン効果フィルタが設定されている場合もキーワードをハイライト対象に含める。

```typescript
// getHighlightKeywordsByTarget 内の skillTargets 構築部分に追加
if (filter.skillMainEffects?.length) {
  const kws = filter.skillMainEffects.flatMap((e) => getSkillEffectKeyword(e));
  skillTargets.push(...kws);
}
```

---

## データフロー図

```
[Zustandストア: skillEffectTypes + skillEffectKeywords]
    ↓ （起動時にDB由来データをキャッシュ済み）
[skillEffectService.getMainSkillEffect(text)]
    ↓ 第1文節抽出 → 全effectType × 文字位置比較
[cardFilterService.filterCardsOnClient]
    ↑ filter.skillMainEffects
[useCardFilterQuery（URLクエリ連動 + 排他正規化）]
    ↑
[SkillEffectFilter.tsx（検索モードトグル）]
```

---

## 実装順序

| 順序 | ファイル                                         | 変更内容                                       |
| ---- | ------------------------------------------------ | ---------------------------------------------- |
| 1    | `services/game/skillEffectService.ts`            | `getMainSkillEffect` + `findKeywordIndex` 追加 |
| 2    | `models/shared/Filter.ts`                        | `skillMainEffects?` フィールド追加             |
| 3    | `services/card/cardFilterService.ts`             | `skillMainEffects` フィルタロジック追加        |
| 4    | `hooks/card/useCardFilterQuery.ts`               | URLクエリ対応 + `normalizeFilter` 排他制御     |
| 5    | `components/cards/filters/SkillEffectFilter.tsx` | 検索モードトグルUI追加                         |
| 6    | `services/card/highlightService.ts`              | メイン効果のハイライト対応                     |
