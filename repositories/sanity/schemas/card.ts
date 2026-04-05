/**
 * Sanity スキーマ定義: card
 *
 * models/card/Card.ts に対応するドキュメント型。
 * カード本体情報と検索用トークンを保持する。
 */

import { CHARACTERS } from '@/config/characters';
import {
  FAVORITE_MODE_LABELS,
  LIMITED_TYPE_LABELS,
  RARITY_LABELS,
  SKILL_SEARCH_TARGET_LABELS,
  STYLE_TYPE_LABELS,
} from '@/mappers/enumMappers';
import {
  DeckType,
  FavoriteMode,
  LimitedType,
  ParentType,
  Rarity,
  StyleType,
} from '@/models/shared/enums';
import { MultiSelectDropdown } from '../components/MultiSelectDropdown';

const rarityValues = Object.values(Rarity);
const styleTypeValues = Object.values(StyleType);
const limitedTypeValues = Object.values(LimitedType);
const favoriteModeValues = Object.values(FavoriteMode);
const parentTypeValues = Object.values(ParentType);
const deckTypeValues = Object.values(DeckType);

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
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: CHARACTERS.map((v) => ({ title: v, value: v })),
      },
      components: {
        input: MultiSelectDropdown,
      },
    },
    {
      name: 'rarity',
      title: 'レアリティ',
      type: 'string',
      options: {
        list: rarityValues.map((v) => ({ title: RARITY_LABELS[v], value: v })),
      },
    },
    {
      name: 'styleType',
      title: 'スタイルタイプ',
      type: 'string',
      options: {
        list: styleTypeValues.map((v) => ({
          title: STYLE_TYPE_LABELS[v],
          value: v,
        })),
      },
    },
    {
      name: 'limited',
      title: '限定区分',
      type: 'string',
      options: {
        list: limitedTypeValues.map((v) => ({
          title: LIMITED_TYPE_LABELS[v],
          value: v,
        })),
      },
    },
    {
      name: 'releaseDate',
      title: 'リリース日',
      type: 'date',
    },
    {
      name: 'favoriteMode',
      title: '得意ムード',
      type: 'string',
      options: {
        list: favoriteModeValues.map((v) => ({
          title: FAVORITE_MODE_LABELS[v],
          value: v,
        })),
      },
    },
    {
      name: 'acquisitionMethod',
      title: '入手方法',
      type: 'string',
    },
    {
      name: 'awakeBeforeImage',
      title: '覚醒前画像URL',
      type: 'url',
    },
    {
      name: 'awakeAfterImage',
      title: '覚醒後画像URL',
      type: 'url',
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
    {
      name: 'tokens',
      title: 'トークン',
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
                list: parentTypeValues.map((v) => ({
                  title: SKILL_SEARCH_TARGET_LABELS[v],
                  value: v,
                })),
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
    {
      name: 'sidePlacementRules',
      title: 'サイド配置ルール',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'サイド配置ルール',
          fields: [
            {
              name: 'characters',
              title: 'キャラクター名',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: CHARACTERS.map((v) => ({ title: v, value: v })),
              },
              components: {
                input: MultiSelectDropdown,
              },
            },
            {
              name: 'deckTypes',
              title: 'デッキタイプ',
              type: 'string',
              options: {
                list: deckTypeValues.map((v) => ({ title: v, value: v })),
              },
            },
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
    prepare(selection: Record<string, unknown>) {
      const title = selection['title'] as string | undefined;
      const subtitle = selection['subtitle'];
      return {
        title,
        subtitle: Array.isArray(subtitle)
          ? subtitle.join('＆')
          : (subtitle as string | undefined),
      };
    },
  },
};
