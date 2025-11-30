import { CardFilter } from '@/models/Filter';
import { getSkillEffectKeywords } from '@/constants/skillEffects';

/**
 * アクティブフィルタからハイライト用のキーワードを抽出
 * @param filter カードフィルター
 * @returns ハイライト対象のキーワード配列
 */
export function getHighlightKeywords(filter: CardFilter | null): string[] {
  if (!filter) return [];

  const keywords: string[] = [];

  // キーワード検索のキーワード
  if (filter.keyword) {
    keywords.push(filter.keyword);
  }

  // スキル効果のキーワード
  if (filter.skillEffects && filter.skillEffects.length > 0) {
    const skillKeywords = getSkillEffectKeywords(filter.skillEffects);
    keywords.push(...skillKeywords);
  }

  return keywords;
}
