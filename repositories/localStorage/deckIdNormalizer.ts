import { Card } from '@/models/card/Card';
import { Deck, DeckSlot } from '@/models/deck/Deck';
import { EntityIdPrefix } from '@/models/shared/enums';
import { ensureEntityIdPrefix } from '@/utils/entityIdUtils';

interface PersistedCard extends Omit<Card, 'id'> {
  id: number | string;
}

interface PersistedDeckSlot extends Omit<DeckSlot, 'cardId' | 'card'> {
  cardId: number | string | null;
  card?: PersistedCard | null;
}

interface PersistedDeck
  extends Omit<Deck, 'songId' | 'liveGrandPrixId' | 'gradeChallengeId' | 'slots'> {
  songId?: number | string;
  liveGrandPrixId?: number | string;
  gradeChallengeId?: number | string;
  slots: PersistedDeckSlot[];
}

const normalizeOptionalEntityId = (
  entityIdPrefix: EntityIdPrefix,
  rawId?: number | string
): string | undefined => {
  if (rawId === undefined) {
    return undefined;
  }

  if (typeof rawId === 'string' && rawId.trim() === '') {
    return undefined;
  }

  return ensureEntityIdPrefix(entityIdPrefix, rawId);
};

const normalizeNullableEntityId = (
  entityIdPrefix: EntityIdPrefix,
  rawId: number | string | null
): string | null => {
  if (rawId === null) {
    return null;
  }

  if (typeof rawId === 'string' && rawId.trim() === '') {
    return null;
  }

  return ensureEntityIdPrefix(entityIdPrefix, rawId);
};

const normalizePersistedCard = (card?: PersistedCard | null): Card | null | undefined => {
  if (card === undefined) {
    return undefined;
  }

  if (card === null) {
    return null;
  }

  return {
    ...card,
    id: ensureEntityIdPrefix(EntityIdPrefix.CARD, card.id),
  };
};

export const normalizePersistedDeck = (deck: PersistedDeck): Deck => ({
  ...deck,
  songId: normalizeOptionalEntityId(EntityIdPrefix.SONG, deck.songId),
  liveGrandPrixId: normalizeOptionalEntityId(EntityIdPrefix.LIVE_GRAND_PRIX, deck.liveGrandPrixId),
  gradeChallengeId: normalizeOptionalEntityId(
    EntityIdPrefix.GRADE_CHALLENGE,
    deck.gradeChallengeId
  ),
  slots: deck.slots.map(slot => ({
    ...slot,
    cardId: normalizeNullableEntityId(EntityIdPrefix.CARD, slot.cardId),
    card: normalizePersistedCard(slot.card),
  })),
});

export type { PersistedDeck };
