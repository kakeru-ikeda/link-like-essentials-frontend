/**
 * Sanity スキーマ定義: skillEffectKeywordGroup
 *
 * 旧 DB の SkillEffectKeyword + SkillEffectDefinition の複数テーブル構造を
 * 1 ドキュメントに集約したもの。
 * effectType は models/shared/enums.ts の SkillEffectType（branded string）に対応するキー。
 */

export const skillEffectKeywordGroupSchema = {
  name: 'skillEffectKeywordGroup',
  title: 'スキル効果キーワードグループ',
  type: 'document',
  fields: [
    {
      name: 'effectType',
      title: '効果タイプ（キー）',
      type: 'string',
      description: 'SkillEffectType に対応する識別キー',
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
