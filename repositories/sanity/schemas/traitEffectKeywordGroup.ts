/**
 * Sanity スキーマ定義: traitEffectKeywordGroup
 *
 * 旧 DB の TraitEffectKeyword + TraitEffectDefinition の複数テーブル構造を
 * 1 ドキュメントに集約したもの。
 * effectType は models/shared/enums.ts の TraitEffectType（branded string）に対応するキー。
 * SkillEffectKeywordGroup と対称構造。
 */

export const traitEffectKeywordGroupSchema = {
  name: 'traitEffectKeywordGroup',
  title: '特性効果キーワードグループ',
  type: 'document',
  fields: [
    {
      name: 'effectType',
      title: '効果タイプ（キー）',
      type: 'string',
      description: 'TraitEffectType に対応する識別キー',
    },
    {
      name: 'displayName',
      title: '表示名',
      type: 'string',
    },
    {
      name: 'definitions',
      title: 'キーワード定義一覧',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'keyword', title: 'キーワード', type: 'string' },
            { name: 'description', title: '説明', type: 'text' },
          ],
          preview: {
            select: { title: 'keyword' },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'displayName',
      subtitle: 'effectType',
    },
  },
};
