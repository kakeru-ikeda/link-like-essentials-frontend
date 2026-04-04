/**
 * Sanity スキーマ定義: traitEffectKeyword
 *
 * 旧 DB の TraitEffectKeyword（keywords[]）+ TraitEffectDefinition（description）の
 * 複数テーブル構造を 1 ドキュメントに集約したもの。
 * effectType は models/shared/enums.ts の TraitEffectType（branded string）に対応するキー。
 * skillEffectKeyword と対称構造。
 */

export const traitEffectKeywordSchema = {
  name: 'traitEffectKeyword',
  title: '特性効果キーワード',
  type: 'document',
  fields: [
    {
      name: 'effectType',
      title: '効果タイプ（キー）',
      type: 'string',
      description: 'TraitEffectType に対応する識別キー（例: SUPPORT_GUARD）',
    },
    {
      name: 'displayName',
      title: '表示名',
      type: 'string',
    },
    {
      name: 'description',
      title: '説明',
      type: 'text',
    },
    {
      name: 'keywords',
      title: 'キーワード（正規表現パターン）一覧',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
  preview: {
    select: {
      title: 'displayName',
      subtitle: 'effectType',
    },
  },
};
