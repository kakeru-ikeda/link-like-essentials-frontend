/**
 * GraphQL SkillEffectKeyword レスポンスの型定義。
 * GET_SKILL_EFFECT_KEYWORDS クエリが返すフィールドに対応する。
 */
export interface GraphQLSkillEffectKeyword {
  effectType: string;
  label: string;
  description: string;
  keywords: string[];
}

/**
 * Sanity に投入する skillEffectKeyword ドキュメントの型。
 * スキーマ定義（repositories/sanity/schemas/skillEffectKeyword.ts）に準拠。
 */
export interface SanitySkillEffectKeyword {
  _id: string;
  _type: 'skillEffectKeyword';
  effectType: string;
  displayName: string;
  description: string;
  keywords: string[];
}

/**
 * GraphQL の SkillEffectKeyword グループレスポンスを Sanity ドキュメント形式に変換する。
 *
 * - `label` → `displayName` にリネーム
 * - `description` はグループレベルでそのまま保持
 * - `keywords` は string[] のままフラットに保持（オブジェクト配列にしない）
 */
export function transformSkillEffectKeyword(group: GraphQLSkillEffectKeyword): SanitySkillEffectKeyword {
  return {
    _id: `skill-effect-keyword-${group.effectType.toLowerCase().replace(/_/g, '-')}`,
    _type: 'skillEffectKeyword',
    effectType: group.effectType,
    displayName: group.label,
    description: group.description,
    keywords: group.keywords,
  };
}
