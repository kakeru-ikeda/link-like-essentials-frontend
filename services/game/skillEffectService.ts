import { SkillEffectType } from '@/models/shared/enums';
import { SKILL_EFFECT_KEYWORDS } from '@/config/skillEffects';

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
