/**
 * Sanity スキーマ定義: song
 *
 * models/song/Song.ts に対応するドキュメント型。
 * singers / participations はカンマ区切り文字列から Array of String へ変換。
 * SongMoodProgression は移行対象外（廃止）のためスキーマに含めない。
 */

import { CHARACTERS } from '@/config/characters';
import { DeckType, SongAttribute } from '@/models/shared/enums';
import { MultiSelectDropdown } from '../components/MultiSelectDropdown';

const deckTypeValues = Object.values(DeckType);
const songAttributeValues = Object.values(SongAttribute);

export const songSchema = {
  name: 'song',
  title: '楽曲',
  type: 'document',
  fields: [
    {
      name: 'songName',
      title: '楽曲名',
      type: 'string',
    },
    {
      name: 'deckType',
      title: 'デッキタイプ（期）',
      type: 'string',
      options: {
        list: deckTypeValues.map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: 'attribute',
      title: '属性',
      type: 'string',
      options: {
        list: songAttributeValues.map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: 'centerCharacter',
      title: 'センターキャラクター',
      type: 'string',
      options: {
        list: CHARACTERS.map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: 'singers',
      title: '歌唱メンバー',
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
      name: 'participations',
      title: '参加メンバー',
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
      name: 'jacketImageUrl',
      title: 'ジャケット画像URL',
      type: 'url',
    },
    {
      name: 'liveAnalyzerImageUrl',
      title: 'ライブアナライザー画像URL',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'songName',
      subtitle: 'centerCharacter',
    },
  },
};
