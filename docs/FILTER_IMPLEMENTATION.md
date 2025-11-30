# カード絞り込み機能 実装仕様書

## 結論: 何をすればいいのか

**フロントエンドでクライアントサイドフィルタリングを実装する**

- 理由: データ量474枚(約2.4MB)と少ない
- 方法: 全カード取得 → JSでフィルター処理
- 所要時間: 2-3日
- バックエンド改修: **不要**

---

## やること（優先順）

### 1. クライアントサイドフィルタリング実装 【必須・2日】

**ファイル**: `services/cardFilterService.ts`

```typescript
export function filterCardsOnClient(cards: Card[], filter: CardFilter): Card[] {
  return cards.filter((card) => {
    // キーワード検索
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      if (
        !card.cardName?.toLowerCase().includes(keyword) &&
        !card.characterName?.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }

    // レアリティ
    if (filter.rarities?.length > 0 && !filter.rarities.includes(card.rarity)) {
      return false;
    }

    // キャラクター
    if (
      filter.characterNames?.length > 0 &&
      !filter.characterNames.includes(card.characterName)
    ) {
      return false;
    }

    // スタイルタイプ（日本語マッピング）
    if (filter.styleTypes?.length > 0) {
      const styleTypeMap = {
        CHEERLEADER: 'チアリーダー',
        MOODMAKER: 'ムードメーカー',
        PERFORMER: 'パフォーマー',
        TRICKSTER: 'トリックスター',
      };
      const allowedStyles = filter.styleTypes.map((t) => styleTypeMap[t]);
      if (!allowedStyles.includes(card.styleType)) return false;
    }

    // 得意ムード（日本語マッピング）
    if (filter.favoriteModes?.length > 0) {
      const favoriteModeMap = {
        HAPPY: 'ハッピー',
        MELLOW: 'メロウ',
        NEUTRAL: 'ニュートラル',
        NONE: '--',
      };
      const allowedModes = filter.favoriteModes.map((m) => favoriteModeMap[m]);
      if (!allowedModes.includes(card.detail?.favoriteMode)) return false;
    }

    // 入手方法（日本語マッピング）
    if (filter.limitedTypes?.length > 0) {
      const limitedTypeMap = {
        PERMANENT: '恒常',
        REWARD: '報酬',
        SUMMER_LIMITED: '夏限定',
        AUTUMN_LIMITED: '秋限定',
        WINTER_LIMITED: '冬限定',
        SPRING_LIMITED: '春限定',
        LIMITED: '限定',
        PARTY_LIMITED: '宴限定',
        BIRTHDAY_LIMITED: '誕生日限定',
        GRADUATION_LIMITED: '卒限定',
        LEGEND_LIMITED: 'LEG限定',
        LOGIN_BONUS: 'ログボ',
        BATTLE_LIMITED: '撃限定',
        ACTIVITY_LIMITED: '活限定',
      };
      const allowedLimited = filter.limitedTypes.map((t) => limitedTypeMap[t]);
      if (!allowedLimited.includes(card.limited)) return false;
    }

    // スキル効果検索
    if (filter.skillEffects?.length > 0) {
      const keywords = getSkillEffectKeywords(filter.skillEffects);
      const targets = filter.skillSearchTargets ?? [
        SkillSearchTarget.SKILL,
        SkillSearchTarget.SPECIAL_APPEAL,
        SkillSearchTarget.TRAIT,
      ];

      const hasEffect = keywords.some((keyword) =>
        targets.some((target) => {
          switch (target) {
            case SkillSearchTarget.SKILL:
              return card.detail?.skill?.effect?.includes(keyword);
            case SkillSearchTarget.SPECIAL_APPEAL:
              return card.detail?.specialAppeal?.effect?.includes(keyword);
            case SkillSearchTarget.TRAIT:
              return card.detail?.trait?.effect?.includes(keyword);
          }
        })
      );

      if (!hasEffect) return false;
    }

    return true;
  });
}
```

### 2. useCardsフックの更新 【必須・0.5日】

**ファイル**: `hooks/useCards.ts`

```typescript
import { filterCardsOnClient } from '@/services/cardFilterService';

export function useCards(filter?: CardFilter) {
  const { data, loading, error } = useQuery(GET_CARDS, {
    variables: { first: 1000 }, // 全件取得
  });

  const allCards = data?.cards.edges.map((edge) => edge.node) ?? [];

  // クライアントサイドフィルタリング
  const filteredCards = filter
    ? filterCardsOnClient(allCards, filter)
    : allCards;

  return {
    cards: filteredCards,
    loading,
    error: error?.message,
  };
}
```

### 3. マッピング定数の作成 【推奨・0.5日】

**ファイル**: `constants/enumMappings.ts`（新規作成）

```typescript
export const STYLE_TYPE_MAP: Record<StyleType, string> = {
  CHEERLEADER: 'チアリーダー',
  MOODMAKER: 'ムードメーカー',
  PERFORMER: 'パフォーマー',
  TRICKSTER: 'トリックスター',
};

export const FAVORITE_MODE_MAP: Record<FavoriteMode, string> = {
  HAPPY: 'ハッピー',
  MELLOW: 'メロウ',
  NEUTRAL: 'ニュートラル',
  NONE: '--',
};

export const LIMITED_TYPE_MAP: Record<LimitedType, string> = {
  PERMANENT: '恒常',
  REWARD: '報酬',
  SUMMER_LIMITED: '夏限定',
  // ... 全14種類
};
```

---

## データ検証結果（参考情報）

### データ量

- 総カード数: **474枚**
- データサイズ: **約2.4MB**
- フィルタリング処理時間: **10-50ms**（体感ゼロ）

### Enum ↔ DB値マッピング

| フロントEnum     | DB値（日本語） | 件数  |
| ---------------- | -------------- | ----- |
| **FavoriteMode** |                |       |
| HAPPY            | ハッピー       | 160枚 |
| MELLOW           | メロウ         | 128枚 |
| NEUTRAL          | ニュートラル   | 182枚 |
| NONE             | --             | 1枚   |
| **StyleType**    |                |       |
| MOODMAKER        | ムードメーカー | 196枚 |
| PERFORMER        | パフォーマー   | 106枚 |
| TRICKSTER        | トリックスター | 101枚 |
| CHEERLEADER      | チアリーダー   | 70枚  |
| **Rarity**       |                |       |
| UR               | UR             | 247枚 |
| SR               | SR             | 138枚 |
| R                | R              | 46枚  |
| **LimitedType**  |                |       |
| PERMANENT        | 恒常           | 147枚 |
| REWARD           | 報酬           | 76枚  |
| SUMMER_LIMITED   | 夏限定         | 55枚  |
| _(全14種類)_     |                |       |

---

## バックエンド改修（将来的・今は不要）

### いつやるか

- カード数が1000枚超えたら
- または、サーバーサイド検索が必要になったら

### 何をやるか

1. `CardFilterInput`を配列対応に変更
   - `rarity: Rarity` → `rarities: [Rarity!]`
   - `characterName: String` → `characterNames: [String!]`
2. `favoriteModes`フィルター追加
3. Prismaクエリで OR 検索実装

**現時点では実装不要**

---

---

## 詳細資料（必要な時だけ読む）

<details>
<summary>データベーススキーマ詳細</summary>

### cards テーブル

- id, card_name, character_name, rarity, style_type, limited, card_url

### card_details テーブル

- card_id (FK), favorite_mode, skill_name, skill_effect, special_appeal_effect, trait_effect

### card_accessories テーブル

- card_id (FK), parent_type, name, effect

</details>

<details>
<summary>スキル効果検索の実データ例</summary>

#### LOVEボーナス系

```
このステージ中、獲得するLOVEを+7%する。
```

#### ボルテージ系

```
ボルテージPt.を+26する。さらにメンタルを最大値の7%回復させる。
```

#### ドロー系

```
手札を全て捨てて、デッキから手札上限までスキルを引く。
```

#### スキルハート系

```
50個のスキルハートを獲得する。さらにこのセクション中、獲得するLOVEを+10%する。
```

</details>

<details>
<summary>レアリティ・キャラクター分布</summary>

### レアリティ分布

| レアリティ | 枚数 | 割合  |
| ---------- | ---- | ----- |
| UR         | 247  | 52.1% |
| SR         | 138  | 29.1% |
| R          | 46   | 9.7%  |
| DR         | 23   | 4.9%  |
| BR         | 14   | 3.0%  |
| LR         | 6    | 1.3%  |

### キャラクター分布（上位）

| キャラクター | 枚数 |
| ------------ | ---- |
| 日野下花帆   | 67   |
| 村野さやか   | 66   |
| 乙宗梢       | 57   |
| 夕霧綴理     | 57   |
| 大沢瑠璃乃   | 56   |

</details>
