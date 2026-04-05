import { SkillEffectType } from '@/models/shared/enums';
import type { Card } from '@/models/card/Card';
import { matchesKeywords } from '@/utils/keywordMatcher';
import { useEffectKeywordsStore } from '@/store/effectKeywordsStore';

/**
 * スキル効果の検索キーワードを取得
 * @param effectType スキル効果の種類
 * @returns 検索キーワードの配列
 */
export function getSkillEffectKeyword(effectType: SkillEffectType): string[] {
  return useEffectKeywordsStore.getState().getSkillKeywords(effectType);
}

/**
 * 複数のスキル効果から検索キーワードを生成
 * @param effectTypes スキル効果の種類の配列
 * @returns 検索キーワードの配列（フラット化）
 */
export function getSkillEffectKeywords(effectTypes: SkillEffectType[]): string[] {
  return effectTypes.flatMap((type) => useEffectKeywordsStore.getState().getSkillKeywords(type));
}

/**
 * カードが特定のスキル効果を持つかを判定
 * @param card 対象のカード
 * @param effectType スキル効果の種類
 * @returns スキル効果を持つ場合true
 */
export function hasSkillEffect(card: Card, effectType: SkillEffectType): boolean {
  const keywords = getSkillEffectKeyword(effectType);
  const skillEffect = card.skill?.effect;
  
  if (!skillEffect) return false;

  return matchesKeywords(skillEffect, keywords);
}

/**
 * スキル文言のメイン効果を判定する
 *
 * スキル文言を「。」で区切った最初の文節内で、
 * 最初の文字位置にマッチするキーワードに対応するeffectTypeを返す。
 *
 * @param skillEffect スキル効果テキスト
 * @returns マッチしたeffectType、なければ null
 */
export function getMainSkillEffect(skillEffect: string | undefined): SkillEffectType | null {
  if (!skillEffect) return null;

  const firstClause = skillEffect.split('。')[0];
  if (!firstClause) return null;

  const { skillEffectTypes, skillEffectKeywords } = useEffectKeywordsStore.getState();

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
