/**
 * Sanity スキーマ定義: card
 *
 * models/card/Card.ts に対応するドキュメント型。
 * CardDetail は別ドキュメントにせず card ドキュメントに内包する（inline object）。
 * DB 結合用フィールド（CardDetail.id / CardDetail.cardId）は Sanity では不要のため削除。
 * Accessory は card ドキュメントの配列（inline object）として保持。
 */

const rarityValues = ['UR', 'SR', 'R', 'DR', 'BR', 'LR'] as const;

const styleTypeValues = [
  'CHEERLEADER',
  'TRICKSTER',
  'PERFORMER',
  'MOODMAKER',
] as const;

const limitedTypeValues = [
  'PERMANENT',
  'LIMITED',
  'SPRING_LIMITED',
  'SUMMER_LIMITED',
  'AUTUMN_LIMITED',
  'WINTER_LIMITED',
  'BIRTHDAY_LIMITED',
  'LEG_LIMITED',
  'SHUFFLE_LIMITED',
  'BATTLE_LIMITED',
  'BANGDREAM_LIMITED',
  'PARTY_LIMITED',
  'ACTIVITY_LIMITED',
  'GRADUATE_LIMITED',
  'LOGIN_BONUS',
  'REWARD',
] as const;

const favoriteModeValues = ['NONE', 'HAPPY', 'MELLOW', 'NEUTRAL'] as const;

const parentTypeValues = ['SPECIAL_APPEAL', 'SKILL', 'TRAIT'] as const;

export const cardSchema = {
  name: 'card',
  title: 'カード',
  type: 'document',
  fields: [
    {
      name: 'cardName',
      title: 'カード名',
      type: 'string',
    },
    {
      name: 'characterName',
      title: 'キャラクター名',
      type: 'string',
    },
    {
      name: 'rarity',
      title: 'レアリティ',
      type: 'string',
      options: {
        list: rarityValues.map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: 'styleType',
      title: 'スタイルタイプ',
      type: 'string',
      options: {
        list: styleTypeValues.map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: 'limited',
      title: 'リミテッドタイプ',
      type: 'string',
      options: {
        list: limitedTypeValues.map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: 'cardUrl',
      title: 'カード画像URL',
      type: 'url',
    },
    {
      name: 'releaseDate',
      title: 'リリース日',
      type: 'date',
    },
    {
      name: 'detail',
      title: 'カード詳細',
      type: 'object',
      fields: [
        {
          name: 'favoriteMode',
          title: 'ファボモード',
          type: 'string',
          options: {
            list: favoriteModeValues.map((v) => ({ title: v, value: v })),
          },
        },
        {
          name: 'acquisitionMethod',
          title: '入手方法',
          type: 'string',
        },
        {
          name: 'awakeBeforeStorageUrl',
          title: '覚醒前画像URL',
          type: 'url',
        },
        {
          name: 'awakeAfterStorageUrl',
          title: '覚醒後画像URL',
          type: 'url',
        },
        {
          name: 'limitBreakCount',
          title: '限界突破数',
          type: 'number',
        },
        {
          name: 'stats',
          title: 'ステータス',
          type: 'object',
          fields: [
            { name: 'smile', title: 'スマイル', type: 'number' },
            { name: 'pure', title: 'ピュア', type: 'number' },
            { name: 'cool', title: 'クール', type: 'number' },
            { name: 'mental', title: 'メンタル', type: 'number' },
          ],
        },
        {
          name: 'specialAppeal',
          title: 'スペシャルアピール',
          type: 'object',
          fields: [
            { name: 'name', title: '名前', type: 'string' },
            { name: 'ap', title: 'AP', type: 'string' },
            { name: 'effect', title: '効果', type: 'text' },
          ],
        },
        {
          name: 'skill',
          title: 'スキル',
          type: 'object',
          fields: [
            { name: 'name', title: '名前', type: 'string' },
            { name: 'ap', title: 'AP', type: 'string' },
            { name: 'effect', title: '効果', type: 'text' },
          ],
        },
        {
          name: 'trait',
          title: '特性',
          type: 'object',
          fields: [
            { name: 'name', title: '名前', type: 'string' },
            { name: 'effect', title: '効果', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'accessories',
      title: 'アクセサリ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'parentType',
              title: '親タイプ',
              type: 'string',
              options: {
                list: parentTypeValues.map((v) => ({ title: v, value: v })),
              },
            },
            { name: 'name', title: '名前', type: 'string' },
            { name: 'ap', title: 'AP', type: 'string' },
            { name: 'effect', title: '効果', type: 'text' },
            { name: 'traitName', title: '特性名', type: 'string' },
            { name: 'traitEffect', title: '特性効果', type: 'text' },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'cardName',
      subtitle: 'characterName',
    },
  },
};
