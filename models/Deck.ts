import { Card } from './Card';
import { CharacterName } from '../constants/characters';

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
  createdAt: string;
  updatedAt: string;
}
