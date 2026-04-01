/**
 * Sanity スキーマ定義: gradeChallenge
 *
 * models/grade-challenge/GradeChallenge.ts に対応するドキュメント型。
 * GradeChallengeDetail・GradeChallengeSectionEffect はネストした inline object として保持。
 * DB 結合用フィールド（detailId / gradeChallengeId 等）は Sanity では不要のため削除。
 * Song は参照（reference）として持つ。
 */

export const gradeChallengeSchema = {
  name: 'gradeChallenge',
  title: 'グレードチャレンジ',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
    },
    {
      name: 'termName',
      title: '期名',
      type: 'string',
    },
    {
      name: 'startDate',
      title: '開始日',
      type: 'date',
    },
    {
      name: 'endDate',
      title: '終了日',
      type: 'date',
    },
    {
      name: 'detailUrl',
      title: '詳細URL',
      type: 'url',
    },
    {
      name: 'details',
      title: 'ステージ一覧',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'stageName',
              title: 'ステージ名',
              type: 'string',
            },
            {
              name: 'specialEffect',
              title: '特殊効果',
              type: 'text',
            },
            {
              name: 'song',
              title: '楽曲',
              type: 'reference',
              to: [{ type: 'song' }],
            },
            {
              name: 'sectionEffects',
              title: 'セクション効果',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'sectionName', title: 'セクション名', type: 'string' },
                    { name: 'effect', title: '効果', type: 'text' },
                    { name: 'sectionOrder', title: '順序', type: 'number' },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { title: 'stageName' },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'termName',
    },
  },
};
