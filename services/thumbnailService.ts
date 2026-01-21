import type { Deck } from '@/models/Deck';
import type { GenerateThumbnailRequest, ThumbnailCardPayload, ThumbnailDeckPayload } from '@/models/Thumbnail';
import { thumbnailRepository } from '@/repositories/api/thumbnailRepository';

function buildThumbnailDeckPayload(deck: Deck): ThumbnailDeckPayload {
  return {
    id: deck.id,
    name: deck.name,
    slots: deck.slots.map((slot) => ({
      slotId: slot.slotId,
      cardId: slot.cardId,
      ...(slot.limitBreak !== undefined && { limitBreak: slot.limitBreak }),
    })),
    aceSlotId: deck.aceSlotId,
    deckType: deck.deckType,
    ...(deck.isFriendSlotEnabled !== undefined && { isFriendSlotEnabled: deck.isFriendSlotEnabled }),
    ...(deck.centerCharacter && { centerCharacter: deck.centerCharacter }),
    ...(deck.participations && { participations: deck.participations }),
  };
}

function buildThumbnailCardsPayload(deck: Deck): ThumbnailCardPayload[] {
  const cardMap = new Map<string, ThumbnailCardPayload>();

  deck.slots.forEach((slot) => {
    if (!slot.cardId) return;

    if (!slot.card) {
      throw new Error(`カード情報が不足しています: slotId=${slot.slotId}, cardId=${slot.cardId}`);
    }

    if (cardMap.has(slot.card.id)) return;

    cardMap.set(slot.card.id, {
      id: slot.card.id,
      cardName: slot.card.cardName,
      characterName: slot.card.characterName,
      rarity: slot.card.rarity,
      detail: slot.card.detail
        ? { awakeAfterStorageUrl: slot.card.detail.awakeAfterStorageUrl }
        : undefined,
    });
  });

  return Array.from(cardMap.values());
}

export const thumbnailService = {
  async generateThumbnail(deck: Deck): Promise<string> {
    const request: GenerateThumbnailRequest = {
      deck: buildThumbnailDeckPayload(deck),
      cards: buildThumbnailCardsPayload(deck),
    };

    return thumbnailRepository.generateThumbnail(request);
  },
};
