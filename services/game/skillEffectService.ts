import { SkillEffectType } from '@/models/shared/enums';
import { SKILL_EFFECT_KEYWORDS } from '@/config/skillEffects';
import type { Card } from '@/models/card/Card';
import { matchesKeywords } from '@/utils/keywordMatcher';

/**
 * スキル効果の検索キーワードを取得
 * @param effectType スキル効果の種類
 * @returns 検索キーワードの配列
 */
export function getSkillEffectKeyword(effectType: SkillEffectType): string[] {
  return SKILL_EFFECT_KEYWORDS[effectType];
}

/**
 * 複数のスキル効果から検索キーワードを生成
 * @param effectTypes スキル効果の種類の配列
 * @returns 検索キーワードの配列（フラット化）
 */
export function getSkillEffectKeywords(effectTypes: SkillEffectType[]): string[] {
  return effectTypes.flatMap((type) => SKILL_EFFECT_KEYWORDS[type]);
}

/**
 * カードが特定のスキル効果を持つかを判定
 * @param card 対象のカード
 * @param effectType スキル効果の種類
 * @returns スキル効果を持つ場合true
 */
export function hasSkillEffect(card: Card, effectType: SkillEffectType): boolean {
  const keywords = getSkillEffectKeyword(effectType);
  const skillEffect = card.detail?.skill?.effect;
  
  if (!skillEffect) return false;

  return matchesKeywords(skillEffect, keywords);
}
