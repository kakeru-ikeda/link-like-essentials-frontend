/**
 * GraphQL LiveGrandPrix レスポンスの型定義。
 * インポートクエリが返すフィールドに対応する。
 */

export interface GraphQLLiveGrandPrixSectionEffect {
  id: string;
  sectionName: string;
  effect: string;
  sectionOrder: number;
  isLocked: boolean;
}

export interface GraphQLLiveGrandPrixDetailSong {
  id: string;
}

export interface GraphQLLiveGrandPrixDetail {
  id: string;
  stageName: string;
  specialEffect?: string | null;
  isLocked: boolean;
  song?: GraphQLLiveGrandPrixDetailSong | null;
  sectionEffects: GraphQLLiveGrandPrixSectionEffect[];
}

export interface GraphQLLiveGrandPrix {
  id: string;
  eventName: string;
  yearTerm: string;
  startDate: string;
  endDate: string;
  eventUrl?: string | null;
  isLocked: boolean;
  details: GraphQLLiveGrandPrixDetail[];
}

/**
 * Sanity に投入する liveGrandPrix ドキュメントの型。
 * スキーマ定義（repositories/sanity/schemas/liveGrandPrix.ts）に準拠。
 */
export interface SanitySectionEffect {
  _key: string;
  sectionName: string;
  effect: string;
  sectionOrder: number;
}

export interface SanityLiveGrandPrixDetail {
  _key: string;
  stageName: string;
  specialEffect?: string;
  song?: { _type: 'reference'; _ref: string };
  sectionEffects: SanitySectionEffect[];
}

export interface SanityLiveGrandPrix {
  _id: string;
  _type: 'liveGrandPrix';
  eventName: string;
  yearTerm: string;
  startDate: string;
  endDate: string;
  eventUrl?: string;
  details: SanityLiveGrandPrixDetail[];
}

/**
 * GraphQL の LiveGrandPrix レスポンスを Sanity ドキュメント形式に変換する。
 *
 * - `isLocked` は除外し全件 published として投入する
 * - `createdAt` / `updatedAt` / DB結合用フィールド（detailId / liveGrandPrixId 等）は除外
 * - `startDate` / `endDate` は `.slice(0, 10)` で日付のみに変換
 * - 各 detail / sectionEffect は Sanity 配列に必須の `_key` を付与する
 * - `song` は `{ _type: 'reference', _ref: 'song-{id}' }` 形式に変換する（songs を先にインポートすること）
 */
export function transformLiveGrandPrix(lgp: GraphQLLiveGrandPrix): SanityLiveGrandPrix {
  const doc: SanityLiveGrandPrix = {
    _id: `liveGrandPrix-${lgp.id}`,
    _type: 'liveGrandPrix',
    eventName: lgp.eventName,
    yearTerm: lgp.yearTerm,
    startDate: lgp.startDate.slice(0, 10),
    endDate: lgp.endDate.slice(0, 10),
    details: lgp.details.map((detail, detailIndex) => {
      const sanityDetail: SanityLiveGrandPrixDetail = {
        _key: `detail-${lgp.id}-${detailIndex}`,
        stageName: detail.stageName,
        sectionEffects: detail.sectionEffects.map((se, seIndex) => ({
          _key: `se-${lgp.id}-${detailIndex}-${seIndex}`,
          sectionName: se.sectionName,
          effect: se.effect,
          sectionOrder: se.sectionOrder,
        })),
      };

      if (detail.specialEffect) {
        sanityDetail.specialEffect = detail.specialEffect;
      }

      if (detail.song) {
        sanityDetail.song = { _type: 'reference', _ref: `song-${detail.song.id}` };
      }

      return sanityDetail;
    }),
  };

  if (lgp.eventUrl) {
    doc.eventUrl = lgp.eventUrl;
  }

  return doc;
}
