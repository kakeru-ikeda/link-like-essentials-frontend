/**
 * Sanity スキーマ定義: liveGrandPrix
 *
 * models/live-grand-prix/LiveGrandPrix.ts に対応するドキュメント型。
 * LiveGrandPrixDetail・LiveGrandPrixSectionEffect はネストした inline object として保持。
 * DB 結合用フィールド（detailId / liveGrandPrixId 等）は Sanity では不要のため削除。
 * Song は参照（reference）として持つ。
 */

export const liveGrandPrixSchema = {
  name: 'liveGrandPrix',
  title: 'ライブグランプリ',
  type: 'document',
  fields: [
    {
      name: 'eventName',
      title: 'イベント名',
      type: 'string',
    },
    {
      name: 'yearTerm',
      title: '年期',
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
      name: 'eventUrl',
      title: 'イベントURL',
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
      title: 'eventName',
      subtitle: 'yearTerm',
    },
  },
};
