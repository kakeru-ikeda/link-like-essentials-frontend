# デッキアナライザ機能 設計書

## 概要

編成中のカードを分析し、**必須要素（ハートキャプチャ等）を持つカードを列挙**する機能。  
スキル効果・特性効果それぞれで該当カードを検出し、特性効果は**発動条件ごとに細分化**して分析する。

## 要求仕様

### 第1フェーズ：ハートキャプチャ分析

1. **必須要素の定義**
   - 第1フェーズでは「ハートキャプチャ」（スキルハートを獲得する効果）のみを対象
   - 今後、他の必須要素（シャッフル、ボルテージゲイン等）を追加可能な設計

2. **検索対象**
   - **スキル効果**: カード本体のスキル + トークンのスキル
   - **特性効果**: カード本体の特性 + トークンの特性
   - ※スペシャルアピールは対象外

3. **特性効果の細分化分析**
   - 特性文章を「。」で区切り、各文ごとに「発動条件 + 効果」の組み合わせを検出
   - 例：「ドローした時、〜スキルハートを獲得する」→ **ドロー条件でハートキャプチャ**
   - 例：「手札にある状態でハートを40000個獲得したとき、〜スキルハートを獲得する」→ **ハートコレクト条件でハートキャプチャ**

4. **UI要件**
   - ツールバーで開閉できるパネル形式
   - スキル/特性でどちらにヒットしたかを明示
   - 特性の場合は発動条件（ドロー/ハートコレクト/ショット等）も表示

---

## 特性効果の発動条件パターン

### 検出対象の発動条件

| 条件タイプ    | キーワードパターン                                        | 例                                              |
| ------------- | --------------------------------------------------------- | ----------------------------------------------- |
| DRAW          | `ドローした時` `ドローしたとき`                           | ドローした時、〜スキルハートを獲得する          |
| HEART_COLLECT | `手札にある状態でハートを\d+個(獲得\|回収)した(とき\|時)` | 手札にある状態でハートを40000個獲得したとき、〜 |
| SHOT          | `スキルを\d+回使用する` `スキル使用時、\d+回まで`         | スキルを3回使用するごとに、〜                   |
| OVER_SECTION  | `手札にある状態でセクションが変わる`                      | セクションが変わるごとに、〜                    |
| ACCUMULATE    | `使用する度に`                                            | 使用する度に効果が増加する                      |

### 検出対象の効果

| 効果タイプ    | キーワードパターン         |
| ------------- | -------------------------- |
| HEART_CAPTURE | `スキルハートを獲得`       |
| VOLTAGE_GAIN  | `ボルテージPt.を`          |
| LOVE_ATTRACT  | `獲得するLOVEを`           |
| VIBES         | `ビートハートの出現個数を` |

---

## アーキテクチャ

### ディレクトリ構成

```
services/
  deck/
    deckAnalyzerService.ts       # 分析ロジック（新規作成）
  game/
    traitConditionService.ts     # 特性発動条件検出ロジック（新規作成）

components/
  deck-builder/
    DeckAnalyzerPanel.tsx        # アナライザパネルUI（新規作成）
    DeckAnalyzerCardItem.tsx     # カード表示アイテム（新規作成）

models/
  deck/
    DeckAnalysis.ts              # 分析結果の型定義（新規作成）

config/
  traitConditions.ts             # 特性発動条件の定義（新規作成）
```

---

## データモデル

### `models/deck/DeckAnalysis.ts`

```typescript
import type { Card } from '@/models/card/Card';
import type { SkillEffectType } from '@/models/shared/enums';

/**
 * 特性の発動条件タイプ
 */
export enum TraitConditionType {
  NONE = 'NONE', // 条件なし（常時発動など）
  DRAW = 'DRAW', // ドロー時
  HEART_COLLECT = 'HEART_COLLECT', // ハートコレクト時
  SHOT = 'SHOT', // スキル使用回数
  OVER_SECTION = 'OVER_SECTION', // セクション跨ぎ
  ACCUMULATE = 'ACCUMULATE', // 使用ごとに蓄積
}

/**
 * 検出されたスキル効果の情報
 */
export interface DetectedSkillEffect {
  card: Card;
  source: 'skill' | 'trait'; // スキルで検出 or 特性で検出
  isAccessory: boolean; // トークンカードか
  accessoryIndex?: number; // トークンのインデックス（トークンの場合のみ）
}

/**
 * 特性から検出された効果の詳細情報
 */
export interface DetectedTraitEffect extends DetectedSkillEffect {
  source: 'trait';
  condition: TraitConditionType; // 発動条件
  conditionText: string; // 発動条件の元テキスト
  effectText: string; // 効果の元テキスト
}

/**
 * 必須要素の分析結果
 */
export interface RequiredEffectAnalysis {
  effectType: SkillEffectType;
  label: string; // 表示用ラベル（例：ハートキャプチャ）

  // スキルで検出されたカード
  skillMatches: DetectedSkillEffect[];

  // 特性で検出されたカード（発動条件ごとにグループ化）
  traitMatches: {
    condition: TraitConditionType;
    conditionLabel: string; // 表示用ラベル（例：ドロー時）
    items: DetectedTraitEffect[];
  }[];

  // 総カード数（重複除去）
  totalUniqueCards: number;
}

/**
 * デッキ分析結果
 */
export interface DeckAnalysis {
  // 基本情報
  totalSlots: number;
  assignedSlots: number;

  // 必須要素の分析結果
  requiredEffects: RequiredEffectAnalysis[];

  // レアリティ構成
  rarities: RarityCount[];

  // スタイルタイプ構成
  styleTypes: StyleTypeCount[];

  // 得意ムード構成
  favoriteModes: FavoriteModeCount[];

  // キャラクター別枚数
  characters: CharacterCount[];

  // トークンカード統計
  tokenCardCount: number; // トークン付きカード枚数
  totalTokenCount: number; // トークンの総数

  // 限界突破統計（任意）
  averageLimitBreak?: number; // 限界突破の平均値
}
```

---

## ビジネスロジック

### `config/traitConditions.ts` - 特性発動条件の定義

```typescript
import { TraitConditionType } from '@/models/deck/DeckAnalysis';

/**
 * 特性発動条件のキーワードパターン
 * 特性文章を「。」で区切った各文に対してマッチングする
 */
export const TRAIT_CONDITION_PATTERNS: Record<TraitConditionType, RegExp[]> = {
  [TraitConditionType.NONE]: [],
  [TraitConditionType.DRAW]: [
    /ドローした時/,
    /ドローしたとき/,
    /ドローしたセクションの間/,
  ],
  [TraitConditionType.HEART_COLLECT]: [
    /手札にある状態でハートを\d+個(獲得|回収)した(とき|時)/,
  ],
  [TraitConditionType.SHOT]: [
    /スキルを\d+回使用する/,
    /スキル使用時、?\d+回まで/,
  ],
  [TraitConditionType.OVER_SECTION]: [/手札にある状態でセクションが変わる/],
  [TraitConditionType.ACCUMULATE]: [/使用する度に/],
};

/**
 * 発動条件のラベル
 */
export const TRAIT_CONDITION_LABELS: Record<TraitConditionType, string> = {
  [TraitConditionType.NONE]: '常時',
  [TraitConditionType.DRAW]: 'ドロー時',
  [TraitConditionType.HEART_COLLECT]: 'ハートコレクト時',
  [TraitConditionType.SHOT]: 'ショット',
  [TraitConditionType.OVER_SECTION]: 'セクション跨ぎ',
  [TraitConditionType.ACCUMULATE]: '使用ごとに蓄積',
};
```

### `services/game/traitConditionService.ts` - 特性発動条件検出サービス

```typescript
import { TraitConditionType } from '@/models/deck/DeckAnalysis';
import { SkillEffectType } from '@/models/shared/enums';
import {
  TRAIT_CONDITION_PATTERNS,
  TRAIT_CONDITION_LABELS,
} from '@/config/traitConditions';
import { getSkillEffectKeyword } from '@/services/game/skillEffectService';

/**
 * 特性文章から検出された効果情報
 */
export interface DetectedTraitConditionEffect {
  condition: TraitConditionType;
  conditionLabel: string;
  conditionText: string; // マッチした条件部分のテキスト
  effectText: string; // マッチした効果部分のテキスト
  sentenceIndex: number; // 元の文章での位置（何番目の文か）
}

/**
 * 特性文章を「。」で区切って各文を取得
 */
export function splitTraitSentences(traitEffect: string): string[] {
  return traitEffect
    .split('。')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * 単一の文から発動条件を検出
 */
export function detectConditionInSentence(
  sentence: string
): TraitConditionType {
  for (const [conditionType, patterns] of Object.entries(
    TRAIT_CONDITION_PATTERNS
  )) {
    if (conditionType === TraitConditionType.NONE) continue;

    for (const pattern of patterns as RegExp[]) {
      if (pattern.test(sentence)) {
        return conditionType as TraitConditionType;
      }
    }
  }
  return TraitConditionType.NONE;
}

/**
 * 単一の文から指定したスキル効果が含まれるかチェック
 */
export function hasEffectInSentence(
  sentence: string,
  effectType: SkillEffectType
): boolean {
  const keywords = getSkillEffectKeyword(effectType);
  return keywords.some((keyword) => {
    if (keyword.includes('\\')) {
      try {
        const regex = new RegExp(keyword);
        return regex.test(sentence);
      } catch {
        return sentence.includes(keyword);
      }
    }
    return sentence.includes(keyword);
  });
}

/**
 * 特性文章を解析し、指定したスキル効果を持つ発動条件を全て検出
 *
 * @param traitEffect 特性効果の全文
 * @param targetEffectType 検出対象のスキル効果タイプ
 * @returns 検出された発動条件と効果のリスト
 *
 * @example
 * // 入力: "ドローした時、ビートハート8回分のスキルハートを獲得する。
 * //       手札にある状態でハートを40000個獲得したとき、ビートハート1000回分のスキルハートを獲得する。"
 * // 出力: [
 * //   { condition: 'DRAW', effectText: 'ビートハート8回分のスキルハートを獲得する', ... },
 * //   { condition: 'HEART_COLLECT', effectText: 'ビートハート1000回分のスキルハートを獲得する', ... }
 * // ]
 */
export function analyzeTraitForEffect(
  traitEffect: string,
  targetEffectType: SkillEffectType
): DetectedTraitConditionEffect[] {
  const results: DetectedTraitConditionEffect[] = [];
  const sentences = splitTraitSentences(traitEffect);

  sentences.forEach((sentence, index) => {
    // この文に対象のスキル効果が含まれているか
    if (!hasEffectInSentence(sentence, targetEffectType)) {
      return;
    }

    // 発動条件を検出
    const condition = detectConditionInSentence(sentence);

    results.push({
      condition,
      conditionLabel: TRAIT_CONDITION_LABELS[condition],
      conditionText: extractConditionText(sentence, condition),
      effectText: sentence,
      sentenceIndex: index,
    });
  });

  return results;
}

/**
 * 文章から条件部分のテキストを抽出
 */
function extractConditionText(
  sentence: string,
  condition: TraitConditionType
): string {
  const patterns = TRAIT_CONDITION_PATTERNS[condition];
  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return '';
}

/**
 * 発動条件のラベルを取得
 */
export function getTraitConditionLabel(condition: TraitConditionType): string {
  return TRAIT_CONDITION_LABELS[condition];
}
```

### `services/deck/deckAnalyzerService.ts` - デッキ分析サービス

```typescript
import type { Deck } from '@/models/deck/Deck';
import type { Card } from '@/models/card/Card';
import type {
  DeckAnalysis,
  RequiredEffectAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
  TraitConditionType,
} from '@/models/deck/DeckAnalysis';
import { SkillEffectType } from '@/models/shared/enums';
import { getSkillEffectKeyword } from '@/services/game/skillEffectService';
import {
  analyzeTraitForEffect,
  getTraitConditionLabel,
} from '@/services/game/traitConditionService';

/**
 * 必須要素の定義（第1フェーズはハートキャプチャのみ）
 */
const REQUIRED_EFFECTS: { effectType: SkillEffectType; label: string }[] = [
  { effectType: SkillEffectType.HEART_CAPTURE, label: 'ハートキャプチャ' },
];

/**
 * デッキを分析して統計情報を生成
 */
export function analyzeDeck(deck: Deck | null): DeckAnalysis | null {
  if (!deck) return null;

  const cards = deck.slots
    .filter((slot) => slot.card)
    .map((slot) => slot.card as Card);

  return {
    totalSlots: deck.slots.length,
    assignedSlots: cards.length,
    requiredEffects: REQUIRED_EFFECTS.map((req) =>
      analyzeRequiredEffect(cards, req.effectType, req.label)
    ),
  };
}

/**
 * 必須要素の分析
 */
function analyzeRequiredEffect(
  cards: Card[],
  effectType: SkillEffectType,
  label: string
): RequiredEffectAnalysis {
  const skillMatches: DetectedSkillEffect[] = [];
  const traitMatchesMap = new Map<TraitConditionType, DetectedTraitEffect[]>();
  const uniqueCardIds = new Set<string>();

  const keywords = getSkillEffectKeyword(effectType);

  cards.forEach((card) => {
    // === スキルのチェック ===
    // カード本体のスキル
    if (card.detail?.skill?.effect) {
      if (matchesKeywords(card.detail.skill.effect, keywords)) {
        skillMatches.push({
          card,
          source: 'skill',
          isAccessory: false,
        });
        uniqueCardIds.add(card.id);
      }
    }

    // トークンのスキル
    card.accessories?.forEach((acc, index) => {
      if (acc.effect && matchesKeywords(acc.effect, keywords)) {
        skillMatches.push({
          card,
          source: 'skill',
          isAccessory: true,
          accessoryIndex: index,
        });
        uniqueCardIds.add(card.id);
      }
    });

    // === 特性のチェック（発動条件ごとに細分化） ===
    // カード本体の特性
    if (card.detail?.trait?.effect) {
      const traitResults = analyzeTraitForEffect(
        card.detail.trait.effect,
        effectType
      );
      traitResults.forEach((result) => {
        const traitMatch: DetectedTraitEffect = {
          card,
          source: 'trait',
          isAccessory: false,
          condition: result.condition,
          conditionText: result.conditionText,
          effectText: result.effectText,
        };

        if (!traitMatchesMap.has(result.condition)) {
          traitMatchesMap.set(result.condition, []);
        }
        traitMatchesMap.get(result.condition)!.push(traitMatch);
        uniqueCardIds.add(card.id);
      });
    }

    // トークンの特性
    card.accessories?.forEach((acc, index) => {
      if (acc.traitEffect) {
        const traitResults = analyzeTraitForEffect(acc.traitEffect, effectType);
        traitResults.forEach((result) => {
          const traitMatch: DetectedTraitEffect = {
            card,
            source: 'trait',
            isAccessory: true,
            accessoryIndex: index,
            condition: result.condition,
            conditionText: result.conditionText,
            effectText: result.effectText,
          };

          if (!traitMatchesMap.has(result.condition)) {
            traitMatchesMap.set(result.condition, []);
          }
          traitMatchesMap.get(result.condition)!.push(traitMatch);
          uniqueCardIds.add(card.id);
        });
      }
    });
  });

  // 特性マッチを発動条件ごとにグループ化
  const traitMatches = Array.from(traitMatchesMap.entries()).map(
    ([condition, items]) => ({
      condition,
      conditionLabel: getTraitConditionLabel(condition),
      items,
    })
  );

  return {
    effectType,
    label,
    skillMatches,
    traitMatches,
    totalUniqueCards: uniqueCardIds.size,
  };
}

/**
 * キーワードリストのいずれかにマッチするかチェック
 */
function matchesKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => {
    if (keyword.includes('\\')) {
      try {
        const regex = new RegExp(keyword);
        return regex.test(text);
      } catch {
        return text.includes(keyword);
      }
    }
    return text.includes(keyword);
  });
}
```

---

## UIコンポーネント

### `components/deck-builder/DeckAnalyzerPanel.tsx`

```tsx
'use client';

import React from 'react';
import type {
  DeckAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';
import { DeckAnalyzerCardItem } from './DeckAnalyzerCardItem';
import { ChevronDown, ChevronUp, Zap, Sparkles } from 'lucide-react';

interface DeckAnalyzerPanelProps {
  analysis: DeckAnalysis;
  isOpen: boolean;
  onToggle: () => void;
}

export const DeckAnalyzerPanel: React.FC<DeckAnalyzerPanelProps> = ({
  analysis,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* ツールバー（開閉トグル） */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">デッキ分析</span>
          <span className="text-sm text-gray-500">
            ({analysis.assignedSlots}/{analysis.totalSlots}枚編成中)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* パネル本体 */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {analysis.requiredEffects.map((effect) => (
            <div key={effect.effectType} className="space-y-4">
              {/* 必須要素ヘッダー */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {effect.label}
                </h3>
                <span className="text-sm font-medium text-blue-600">
                  {effect.totalUniqueCards}枚
                </span>
              </div>

              {/* スキルでヒットしたカード */}
              {effect.skillMatches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>スキル ({effect.skillMatches.length})</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    {effect.skillMatches.map((match, idx) => (
                      <DeckAnalyzerCardItem
                        key={`skill-${match.card.id}-${idx}`}
                        match={match}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 特性でヒットしたカード（発動条件ごとにグループ化） */}
              {effect.traitMatches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>特性</span>
                  </div>

                  {effect.traitMatches.map((group) => (
                    <div key={group.condition} className="pl-6 space-y-2">
                      <div className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block">
                        {group.conditionLabel} ({group.items.length})
                      </div>
                      {group.items.map((match, idx) => (
                        <DeckAnalyzerCardItem
                          key={`trait-${match.card.id}-${idx}`}
                          match={match}
                          showCondition
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* 該当なしの場合 */}
              {effect.totalUniqueCards === 0 && (
                <p className="text-sm text-gray-500 italic">
                  該当するカードがありません
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### `components/deck-builder/DeckAnalyzerCardItem.tsx`

```tsx
'use client';

import React from 'react';
import type {
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';

interface DeckAnalyzerCardItemProps {
  match: DetectedSkillEffect | DetectedTraitEffect;
  showCondition?: boolean;
}

export const DeckAnalyzerCardItem: React.FC<DeckAnalyzerCardItemProps> = ({
  match,
  showCondition = false,
}) => {
  const isTraitMatch = match.source === 'trait';
  const traitMatch = isTraitMatch ? (match as DetectedTraitEffect) : null;

  return (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
      {/* カード画像（サムネイル） */}
      {match.card.cardUrl && (
        <img
          src={match.card.cardUrl}
          alt={match.card.cardName}
          className="w-12 h-12 object-cover rounded"
        />
      )}

      <div className="flex-1 min-w-0">
        {/* カード名 */}
        <p className="font-medium text-sm text-gray-800 truncate">
          {match.card.cardName}
          {match.isAccessory && (
            <span className="ml-1 text-xs text-orange-600">(トークン)</span>
          )}
        </p>

        {/* キャラクター名 */}
        <p className="text-xs text-gray-500">{match.card.characterName}</p>

        {/* 特性の場合：発動条件と効果テキスト */}
        {showCondition && traitMatch && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {traitMatch.effectText}
          </p>
        )}
      </div>
    </div>
  );
};
```

---

## 統合方法

### DeckDashboard.tsx への統合（ツールバー形式）

```tsx
import { useState } from 'react';
import { DeckAnalyzerPanel } from '@/components/deck-builder/DeckAnalyzerPanel';
import { analyzeDeck } from '@/services/deck/deckAnalyzerService';

// ... 既存コード ...

const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
const analysis = deck ? analyzeDeck(deck) : null;

// ... レンダリング部分（デッキビルダーの上部などに配置） ...

{
  analysis && (
    <DeckAnalyzerPanel
      analysis={analysis}
      isOpen={isAnalyzerOpen}
      onToggle={() => setIsAnalyzerOpen(!isAnalyzerOpen)}
    />
  );
}
```

---

## 実装順序

### フェーズ1: 基盤実装（0.5日）

1. `models/deck/DeckAnalysis.ts` - 型定義（TraitConditionType含む）
2. `config/traitConditions.ts` - 特性発動条件のパターン定義
3. `services/game/traitConditionService.ts` - 特性解析ロジック
   - `splitTraitSentences()` - 文分割
   - `detectConditionInSentence()` - 条件検出
   - `analyzeTraitForEffect()` - メイン解析関数

### フェーズ2: 分析ロジック実装（0.5日）

4. `services/deck/deckAnalyzerService.ts` - デッキ分析サービス
   - `analyzeDeck()` - メイン分析関数
   - `analyzeRequiredEffect()` - 必須要素分析

### フェーズ3: UI実装（0.5日）

5. `components/deck-builder/DeckAnalyzerCardItem.tsx` - カード表示
6. `components/deck-builder/DeckAnalyzerPanel.tsx` - パネルUI

### フェーズ4: 統合（0.5日）

7. `DeckDashboard.tsx` への統合
8. 動作確認・調整

**合計見積もり: 2日**

---

## テストケース

### 特性解析のテスト

```typescript
// テスト入力
const traitEffect = `ドローした時、ビートハート8回分のスキルハートを獲得する。ボルテージLv.15ごと、最大150Lv.で200倍まで効果量が増加する。さらに手札にある状態でハートを40000個獲得したとき、ビートハート1000回分のスキルハートを獲得する。`;

// 期待される出力
const expected = [
  {
    condition: 'DRAW',
    conditionLabel: 'ドロー時',
    effectText: 'ドローした時、ビートハート8回分のスキルハートを獲得する',
  },
  {
    condition: 'HEART_COLLECT',
    conditionLabel: 'ハートコレクト時',
    effectText:
      '手札にある状態でハートを40000個獲得したとき、ビートハート1000回分のスキルハートを獲得する',
  },
];
```

---

## 拡張案（将来）

### 第2フェーズ：他の必須要素追加

```typescript
const REQUIRED_EFFECTS = [
  { effectType: SkillEffectType.HEART_CAPTURE, label: 'ハートキャプチャ' },
  { effectType: SkillEffectType.VOLTAGE_GAIN, label: 'ボルテージゲイン' },
  { effectType: SkillEffectType.RESHUFFLE, label: 'シャッフル' },
  { effectType: SkillEffectType.VIBES, label: 'バイブス' },
];
```

### 第3フェーズ：発動条件による効果量の可視化

- ドロー時のハートキャプチャ効果量を合計
- ハートコレクト時の効果量を表示

---

## まとめ

**変更点:**

1. UIをモーダルからツールバー開閉パネルに変更
2. 統計カウントから「該当カード列挙」アプローチに変更
3. 検索対象をスキル + 特性に限定（SA除外）
4. 特性効果を「。」区切りで解析し、発動条件ごとに分類
5. 第1フェーズはハートキャプチャのみ対象

**技術的ポイント:**

- `traitConditionService.ts`で特性文章を解析する汎用メソッドを提供
- 発動条件パターンは`config/traitConditions.ts`で一元管理
- 将来の必須要素追加に対応可能な設計
