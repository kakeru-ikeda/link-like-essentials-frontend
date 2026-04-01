/**
 * Sanity スキーマ定義: maintenance
 *
 * MicroCMS から移行するメンテナンス情報のドキュメント型。
 * body は MicroCMS のリッチテキストを Portable Text に変換して格納。
 * ctaLabel / ctaUrl はオプショナルな CTA ボタン情報。
 */

export const maintenanceSchema = {
  name: 'maintenance',
  title: 'メンテナンス',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
    },
    {
      name: 'body',
      title: '本文',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Portable Text 形式のリッチテキスト',
    },
    {
      name: 'notice',
      title: 'お知らせ補足',
      type: 'text',
    },
    {
      name: 'ctaLabel',
      title: 'CTAボタンラベル',
      type: 'string',
    },
    {
      name: 'ctaUrl',
      title: 'CTAURL',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
