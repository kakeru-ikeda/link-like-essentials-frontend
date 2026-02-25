import { Song } from '@/models/song/Song';

/**
 * グレードチャレンジのセクション効果
 */
export interface GradeChallengeSectionEffect {
  id: string;
  detailId: number;
  sectionName: string;
  effect: string;
  sectionOrder: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * グレードチャレンジの詳細（ステージ情報）
 */
export interface GradeChallengeDetail {
  id: string;
  gradeChallengeId: number;
  stageName: string;
  specialEffect?: string;
  songId?: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  song?: Song;
  sectionEffects: GradeChallengeSectionEffect[];
}

/**
 * グレードチャレンジ
 */
export interface GradeChallenge {
  id: string;
  title: string;
  termName: string;
  startDate: string;
  endDate: string;
  detailUrl?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  details: GradeChallengeDetail[];
}

/**
 * 期別統計
 */
export interface TermNameStats {
  termName: string;
  count: number;
}

/**
 * グレードチャレンジ統計
 */
export interface GradeChallengeStats {
  totalEvents: number;
  byTermName: TermNameStats[];
}
