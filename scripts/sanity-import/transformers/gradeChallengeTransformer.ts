/**
 * GraphQL GradeChallenge レスポンスの型定義。
 * インポートクエリが返すフィールドに対応する。
 */

export interface GraphQLGradeChallengeSectionEffect {
  id: string;
  sectionName: string;
  effect: string;
  sectionOrder: number;
  isLocked: boolean;
}

export interface GraphQLGradeChallengeDetailSong {
  id: string;
}

export interface GraphQLGradeChallengeDetail {
  id: string;
  stageName: string;
  specialEffect?: string | null;
  isLocked: boolean;
  song?: GraphQLGradeChallengeDetailSong | null;
  sectionEffects: GraphQLGradeChallengeSectionEffect[];
}

export interface GraphQLGradeChallenge {
  id: string;
  title: string;
  /** Prisma: DateTime?（nullable）、GraphQL: DateTime（not !） */
  termName?: string | null;
  /** Prisma: DateTime?（nullable）、GraphQL: DateTime（not !） */
  startDate?: string | null;
  /** Prisma: DateTime?（nullable）、GraphQL: DateTime（not !） */
  endDate?: string | null;
  detailUrl?: string | null;
  isLocked: boolean;
  details: GraphQLGradeChallengeDetail[];
}

/**
 * Sanity に投入する gradeChallenge ドキュメントの型。
 * スキーマ定義（repositories/sanity/schemas/gradeChallenge.ts）に準拠。
 */
export interface SanitySectionEffect {
  _key: string;
  sectionName: string;
  effect: string;
  sectionOrder: number;
}

export interface SanityGradeChallengeDetail {
  _key: string;
  stageName: string;
  specialEffect?: string;
  song?: { _type: 'reference'; _ref: string };
  sectionEffects: SanitySectionEffect[];
}

export interface SanityGradeChallenge {
  _id: string;
  _type: 'gradeChallenge';
  title: string;
  termName?: string;
  startDate?: string;
  endDate?: string;
  detailUrl?: string;
  details: SanityGradeChallengeDetail[];
}

/**
 * GraphQL の GradeChallenge レスポンスを Sanity ドキュメント形式に変換する。
 *
 * - `isLocked` は除外し全件 published として投入する
 * - `createdAt` / `updatedAt` / DB結合用フィールド（detailId / gradeChallengeId 等）は除外
 * - `startDate` / `endDate` は `.slice(0, 10)` で日付のみに変換
 * - 各 detail / sectionEffect は Sanity 配列に必須の `_key` を付与する
 * - `song` は `{ _type: 'reference', _ref: 'song-{id}' }` 形式に変換する（songs を先にインポートすること）
 */
export function transformGradeChallenge(gc: GraphQLGradeChallenge): SanityGradeChallenge {
  const doc: SanityGradeChallenge = {
    _id: `gradeChallenge-${gc.id}`,
    _type: 'gradeChallenge',
    title: gc.title,
    ...(gc.termName != null && { termName: gc.termName }),
    ...(gc.startDate != null && { startDate: gc.startDate.slice(0, 10) }),
    ...(gc.endDate != null && { endDate: gc.endDate.slice(0, 10) }),
    details: gc.details.map((detail, detailIndex) => {
      const sanityDetail: SanityGradeChallengeDetail = {
        _key: `detail-${gc.id}-${detailIndex}`,
        stageName: detail.stageName,
        sectionEffects: detail.sectionEffects.map((se, seIndex) => ({
          _key: `se-${gc.id}-${detailIndex}-${seIndex}`,
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

  if (gc.detailUrl) {
    doc.detailUrl = gc.detailUrl;
  }

  return doc;
}
