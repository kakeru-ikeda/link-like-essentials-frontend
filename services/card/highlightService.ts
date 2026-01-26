import { CardFilter } from '@/models/shared/Filter';
import { getSkillEffectKeywords } from '@/services/game/skillEffectService';
import { getTraitEffectKeywords } from '@/services/game/traitEffectService';

export interface HighlightKeywordsByTarget {
  general: string[]; // キーワード検索など全体に適用するキーワード
  skillTargets: string[]; // スキル検索対象（スペシャルアピール・スキル・特性）に適用するキーワード
  traitTargets: string[]; // 特性検索専用キーワード
}

/**
 * アクティブフィルタからハイライト用のキーワードを抽出
 * @param filter カードフィルター
 * @returns ハイライト対象のキーワード配列
 */
export function getHighlightKeywords(filter: CardFilter | null): string[] {
  const { general, skillTargets, traitTargets } = getHighlightKeywordsByTarget(filter);
  return [...general, ...skillTargets, ...traitTargets];
}

/**
 * ハイライト対象を検索ターゲット別に返す
 * - general: フリーワード検索など全体に適用
 * - skillTargets: スキル効果検索時にスペシャルアピール/スキル/特性へ適用
 * - traitTargets: 特性効果検索時に特性へのみ適用
 */
export function getHighlightKeywordsByTarget(
  filter: CardFilter | null
): HighlightKeywordsByTarget {
  const result: HighlightKeywordsByTarget = {
    general: [],
    skillTargets: [],
    traitTargets: [],
  };

  if (!filter) return result;

  if (filter.keyword) {
    result.general.push(filter.keyword);
  }

  if (filter.skillEffects && filter.skillEffects.length > 0) {
    result.skillTargets.push(...getSkillEffectKeywords(filter.skillEffects));
  }

  if (filter.traitEffects && filter.traitEffects.length > 0) {
    result.traitTargets.push(...getTraitEffectKeywords(filter.traitEffects));
  }

  return result;
}
