import { Rarity } from '@/models/shared/enums';
import { Deck, DeckSlotForCloud } from '@/models/deck/Deck';

export interface ThumbnailDeckPayload
  extends Pick<
    Deck,
    | 'id'
    | 'name'
    | 'aceSlotId'
    | 'deckType'
    | 'isFriendSlotEnabled'
    | 'centerCharacter'
    | 'participations'
  > {
  slots: DeckSlotForCloud[];
}

export interface ThumbnailCardDetailPayload {
  awakeAfterStorageUrl?: string;
}

export interface ThumbnailCardPayload {
  id: string;
  cardName: string;
  characterName: string;
  rarity: Rarity;
  detail?: ThumbnailCardDetailPayload;
}

export interface GenerateThumbnailRequest {
  deck: ThumbnailDeckPayload;
  cards: ThumbnailCardPayload[];
}

export interface GenerateThumbnailResponse {
  thumbnailUrl: string;
}
