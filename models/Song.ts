import { SongCategory } from './enums';

/**
 * ムード推移のセクション
 */
export interface MoodProgression {
  id: string;
  section: string;
  progression: string;
  sectionOrder: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 楽曲
 */
export interface Song {
  id: string;
  songName: string;
  songUrl?: string;
  category: SongCategory;
  attribute: string;
  centerCharacter: string;
  singers: string[];
  jacketImageUrl?: string;
  liveAnalyzerImageUrl?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  moodProgressions: MoodProgression[];
}

/**
 * カテゴリー別統計
 */
export interface CategoryStats {
  category: SongCategory;
  count: number;
}

/**
 * 属性別統計
 */
export interface AttributeStats {
  attribute: string;
  count: number;
}

/**
 * センターキャラクター別統計
 */
export interface CenterCharacterStats {
  centerCharacter: string;
  count: number;
}

/**
 * 楽曲統計情報
 */
export interface SongStats {
  totalSongs: number;
  byCategory: CategoryStats[];
  byAttribute: AttributeStats[];
  byCenterCharacter: CenterCharacterStats[];
}
