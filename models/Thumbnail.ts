import { Rarity } from '@/models/enums';
import { Deck, DeckSlotForCloud } from '@/models/Deck';

export interface ThumbnailDeckSlotPayload extends DeckSlotForCloud {}

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
  slots: ThumbnailDeckSlotPayload[];
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
