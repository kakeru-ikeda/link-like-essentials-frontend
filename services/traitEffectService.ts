import { TraitEffectType } from '@/models/enums';
import { TRAIT_EFFECT_KEYWORDS } from '@/config/traitEffects';

/**
 * 特性効果の検索キーワードを取得
 * @param effectType 特性効果の種類
 * @returns 検索キーワードの配列
 */
export function getTraitEffectKeyword(effectType: TraitEffectType): string[] {
  return TRAIT_EFFECT_KEYWORDS[effectType];
}

/**
 * 複数の特性効果から検索キーワードを生成
 * @param effectTypes 特性効果の種類の配列
 * @returns 検索キーワードの配列（フラット化）
 */
export function getTraitEffectKeywords(effectTypes: TraitEffectType[]): string[] {
  return effectTypes.flatMap((type) => TRAIT_EFFECT_KEYWORDS[type]);
}
