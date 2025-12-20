import { Card } from './Card';
import { CharacterName } from '../constants/characters';
import { DeckType } from './enums';

export interface DeckSlot {
  slotId: number;
  characterName: CharacterName;
  cardId: string | null;
  limitBreak?: number;
  card?: Card | null; // フロントエンド内部で使用（クラウド送信時は除外）
}

export interface Deck {
  id: string;
  userId?: string;                   // デッキ作成者のAuthUID（クラウド保存時に追加）
  userName?: string;                 // 作成者の表示名（将来的に実装）
  name: string;
  slots: DeckSlot[];
  aceSlotId: number | null;
  deckType?: DeckType;
  songId?: string;
  songName?: string;                 // フロントエンド内部で使用（songIdから復元、送信不要）
  centerCharacter?: string;          // フロントエンド内部で使用（songIdから復元、送信不要）
  participations?: string[];         // フロントエンド内部で使用（songIdから復元、送信不要）
  liveAnalyzerImageUrl?: string;     // フロントエンド内部で使用（songIdから復元、送信不要）
  memo?: string;
  tags?: string[];                   // 検索用タグ（サーバーサイドで自動生成）
  viewCount?: number;                // 閲覧数（クラウド保存時のみ）
  likeCount?: number;                // いいね数（将来的に実装）
  createdAt: string;
  updatedAt: string;
}
