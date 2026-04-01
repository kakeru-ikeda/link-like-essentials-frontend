/**
 * Sanity スキーマ定義: news
 *
 * MicroCMS から移行するニュース記事のドキュメント型。
 * body は MicroCMS のリッチテキストを Portable Text に変換して格納。
 * thumbnail は Sanity の Image Asset を利用。
 * category は inline object（リファレンスは不要）。
 */

export const newsSchema = {
  name: 'news',
  title: 'ニュース',
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
      name: 'thumbnail',
      title: 'サムネイル',
      type: 'object',
      fields: [
        {
          name: 'asset',
          title: '画像',
          type: 'image',
          options: { hotspot: true },
        },
        {
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
        },
      ],
    },
    {
      name: 'category',
      title: 'カテゴリー',
      type: 'object',
      fields: [
        { name: 'id', title: 'カテゴリーID', type: 'string' },
        { name: 'name', title: 'カテゴリー名', type: 'string' },
      ],
    },
    {
      name: 'publishedAt',
      title: '公開日時',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'thumbnail.asset',
    },
  },
};
