/**
 * Sanity スキーマ定義: skillEffectKeyword
 *
 * 旧 DB の SkillEffectKeyword（keywords[]）+ SkillEffectDefinition（description）の
 * 複数テーブル構造を 1 ドキュメントに集約したもの。
 * effectType は models/shared/enums.ts の SkillEffectType（branded string）に対応するキー。
 */

export const skillEffectKeywordSchema = {
  name: 'skillEffectKeyword',
  title: 'スキル効果キーワード',
  type: 'document',
  fields: [
    {
      name: 'effectType',
      title: '効果タイプ（キー）',
      type: 'string',
      description: 'SkillEffectType に対応する識別キー（例: HEART_CAPTURE）',
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
