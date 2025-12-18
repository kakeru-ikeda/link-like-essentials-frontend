import { Card } from './Card';
import { CharacterName } from '../constants/characters';
import { DeckType } from './enums';

export interface DeckSlot {
  slotId: number;
  characterName: CharacterName;
  card: Card | null;
}

export interface Deck {
  id: string;
  name: string;
  slots: DeckSlot[];
  aceSlotId: number | null;
  limitBreakCounts: { [cardId: string]: number };
  deckType?: DeckType;
  songId?: string;
  songName?: string;
  centerCharacter?: string;
  participations?: string[];
  liveAnalyzerImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
