import { Card } from '@/models/domain/Card';
import { CharacterName } from '@/config/characters';
import { DeckType } from '@/models/shared/enums';

export interface DeckSlot {
  slotId: number;
  characterName: CharacterName;
  cardId: string | null;
  limitBreak?: number;
  card?: Card | null; // フロントエンド内部で使用（クラウド送信時は除外）
}

// クラウド送信用のDeckSlot型
export type DeckSlotForCloud = Pick<DeckSlot, 'slotId' | 'cardId' | 'limitBreak'>;

export interface Deck {
  id: string;
  name: string;
  slots: DeckSlot[];
  aceSlotId: number | null;
  deckType?: DeckType;
  songId?: string;
  songName?: string;                 // フロントエンド内部で使用（songIdから復元、送信不要）
  centerCharacter?: string;          // フロントエンド内部で使用（songIdから復元、送信不要）
  participations?: string[];         // フロントエンド内部で使用（songIdから復元、送信不要）
  liveAnalyzerImageUrl?: string;     // フロントエンド内部で使用（songIdから復元、送信不要）
  liveGrandPrixId?: string;          // ライブグランプリID（選択された場合のみ）
  liveGrandPrixDetailId?: string;    // ライブグランプリ詳細ID（ステージ選択時のみ）
  liveGrandPrixEventName?: string;   // フロントエンド内部で使用（表示用、送信不要）
  liveGrandPrixStageName?: string;   // フロントエンド内部で使用（表示用、送信不要）
  score?: number;                    // 参考スコア（兆単位）
  memo?: string;
  isFriendSlotEnabled?: boolean;     // フレンドカード枠の有効化状態
  createdAt: string;
  updatedAt: string;
}

// クラウド送信用のDeck型（必要最小限のフィールドのみ）
export type DeckForCloud = Pick<Deck, 
  | 'id'
  | 'name' 
  | 'aceSlotId'
  | 'deckType'
  | 'songId'
  | 'liveGrandPrixId'
  | 'liveGrandPrixDetailId'
  | 'score'
  | 'memo'
> & {
  slots: DeckSlotForCloud[];
};

// クラウド更新用のDeck型（Partial）
export type DeckForCloudUpdate = Partial<Pick<Deck,
  | 'name'
  | 'aceSlotId'
  | 'deckType'
  | 'songId'
  | 'liveGrandPrixId'
  | 'liveGrandPrixDetailId'
  | 'score'
  | 'memo'
>> & {
  slots?: DeckSlotForCloud[];
};
