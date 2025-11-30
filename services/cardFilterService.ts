import { CardFilter } from '@/models/Filter';
import { getSkillEffectKeywords } from '@/constants/skillEffects';

/**
 * カードフィルターからGraphQLクエリ用のフィルターパラメータを生成
 * 
 * @param filter カードフィルター
 * @returns GraphQLクエリ用のフィルターオブジェクト
 */
export function buildGraphQLFilter(filter: CardFilter): Record<string, any> {
  const graphqlFilter: Record<string, any> = {};

  // キーワード検索
  if (filter.keyword) {
    graphqlFilter.keyword = filter.keyword;
  }

  // スキル効果検索
  // 選択されたスキル効果のキーワードをキーワード検索に追加
  if (filter.skillEffects && filter.skillEffects.length > 0) {
    const skillKeywords = getSkillEffectKeywords(filter.skillEffects);
    
    // 検索対象が指定されている場合は、対象ごとにキーワード検索を実行
    if (filter.skillSearchTargets && filter.skillSearchTargets.length > 0) {
      // TODO: 実装時に検索対象に応じたフィールド指定を行う
      // 例: specialAppeal.description, skill.description, trait.description
      graphqlFilter.skillEffectKeywords = skillKeywords;
      graphqlFilter.skillSearchTargets = filter.skillSearchTargets;
    } else {
      // 検索対象が未指定の場合は全ての対象を検索
      graphqlFilter.skillEffectKeywords = skillKeywords;
    }
  }

  // レアリティ
  if (filter.rarities && filter.rarities.length > 0) {
    graphqlFilter.rarities = filter.rarities;
  }

  // スタイルタイプ
  if (filter.styleTypes && filter.styleTypes.length > 0) {
    graphqlFilter.styleTypes = filter.styleTypes;
  }

  // 入手方法
  if (filter.limitedTypes && filter.limitedTypes.length > 0) {
    graphqlFilter.limitedTypes = filter.limitedTypes;
  }

  // 得意ムード
  if (filter.favoriteModes && filter.favoriteModes.length > 0) {
    graphqlFilter.favoriteModes = filter.favoriteModes;
  }

  // キャラクター
  if (filter.characterNames && filter.characterNames.length > 0) {
    graphqlFilter.characterNames = filter.characterNames;
  }

  return graphqlFilter;
}

/**
 * スキル効果フィルターの検索クエリを生成
 * 将来的な実装で使用
 * 
 * @param filter カードフィルター
 * @returns 検索クエリ文字列（キーワード検索用）
 */
export function buildSkillEffectSearchQuery(filter: CardFilter): string | undefined {
  if (!filter.skillEffects || filter.skillEffects.length === 0) {
    return undefined;
  }

  const keywords = getSkillEffectKeywords(filter.skillEffects);
  
  // 複数のスキル効果が選択されている場合はOR検索
  // 例: "スキルハートを獲得" OR "ハート上限を"
  return keywords.join(' OR ');
}
