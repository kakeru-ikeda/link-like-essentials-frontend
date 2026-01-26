import { DeckType, SongAttribute } from '@/models/shared/enums';
import { CharacterName } from '@/config/characters';

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
  deckType: DeckType;
  attribute: SongAttribute;
  centerCharacter: CharacterName;
  singers: string[];
  participations: string[];
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
  category: DeckType;
  count: number;
}

/**
 * 属性別統計
 */
export interface AttributeStats {
  attribute: SongAttribute;
  count: number;
}

/**
 * センターキャラクター別統計
 */
export interface CenterCharacterStats {
  centerCharacter: CharacterName;
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
