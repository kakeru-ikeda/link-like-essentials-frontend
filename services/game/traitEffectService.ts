import { TraitEffectType } from '@/models/shared/enums';
import { TRAIT_EFFECT_KEYWORDS } from '@/config/traitEffects';
import type { Card } from '@/models/card/Card';

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

/**
 * カードが特定の特性効果を持つかを判定
 * @param card 対象のカード
 * @param effectType 特性効果の種類
 * @returns 特性効果を持つ場合true
 */
export function hasTraitEffect(card: Card, effectType: TraitEffectType): boolean {
  const keywords = getTraitEffectKeyword(effectType);
  const traitEffect = card.detail?.trait?.effect;
  
  if (!traitEffect) return false;
  
  return keywords.some((keyword) => {
    if (keyword.includes('\\')) {
      try {
        const regex = new RegExp(keyword);
        return regex.test(traitEffect);
      } catch {
        return traitEffect.includes(keyword);
      }
    }
    return traitEffect.includes(keyword);
  });
}
