/**
 * GraphQL TraitEffectKeyword レスポンスの型定義。
 * GET_TRAIT_EFFECT_KEYWORDS クエリが返すフィールドに対応する。
 */
export interface GraphQLTraitEffectKeyword {
  effectType: string;
  label: string;
  description: string;
  keywords: string[];
}

/**
 * Sanity に投入する traitEffectKeyword ドキュメントの型。
 * スキーマ定義（repositories/sanity/schemas/traitEffectKeyword.ts）に準拠。
 */
export interface SanityTraitEffectKeyword {
  _id: string;
  _type: 'traitEffectKeyword';
  effectType: string;
  displayName: string;
  description: string;
  keywords: string[];
}

/**
 * GraphQL の TraitEffectKeyword グループレスポンスを Sanity ドキュメント形式に変換する。
 *
 * - `label` → `displayName` にリネーム
 * - `description` はグループレベルでそのまま保持
 * - `keywords` は string[] のままフラットに保持（オブジェクト配列にしない）
 */
export function transformTraitEffectKeyword(group: GraphQLTraitEffectKeyword): SanityTraitEffectKeyword {
  return {
    _id: `trait-effect-keyword-${group.effectType.toLowerCase().replace(/_/g, '-')}`,
    _type: 'traitEffectKeyword',
    effectType: group.effectType,
    displayName: group.label,
    description: group.description,
    keywords: group.keywords,
  };
}
