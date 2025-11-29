import { Card } from './Card';
import { CharacterName } from './Character';

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
