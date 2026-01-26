import { Song } from '@/models/song/Song';

/**
 * ライブグランプリのセクション効果
 */
export interface LiveGrandPrixSectionEffect {
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
 * ライブグランプリの詳細（ステージ情報）
 */
export interface LiveGrandPrixDetail {
  id: string;
  liveGrandPrixId: number;
  stageName: string;
  specialEffect?: string;
  songId?: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  song?: Song;
  sectionEffects: LiveGrandPrixSectionEffect[];
}

/**
 * ライブグランプリ
 */
export interface LiveGrandPrix {
  id: string;
  startDate: string;
  endDate: string;
  eventName: string;
  eventUrl?: string;
  yearTerm: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  details: LiveGrandPrixDetail[];
}

/**
 * 期別統計
 */
export interface YearTermStats {
  yearTerm: string;
  count: number;
}

/**
 * ライブグランプリ統計
 */
export interface LiveGrandPrixStats {
  totalEvents: number;
  byYearTerm: YearTermStats[];
}
