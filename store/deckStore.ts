import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Deck, DeckSlot } from '@/models/Deck';
import { Card } from '@/models/Card';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';

interface DeckState {
  deck: Deck | null;
  setDeck: (deck: Deck) => void;
  addCardToSlot: (slotId: number, card: Card) => void;
  removeCardFromSlot: (slotId: number) => void;
  setAceCard: (slotId: number) => void;
  clearAceCard: () => void;
  clearDeck: () => void;
  saveDeckToLocal: () => void;
  loadDeckFromLocal: () => void;
  initializeDeck: () => void;
}

const createEmptyDeck = (): Deck => {
  const slots: DeckSlot[] = DECK_SLOT_MAPPING.map((mapping) => ({
    slotId: mapping.slotId,
    characterName: mapping.characterName,
    card: null,
  }));

  return {
    id: crypto.randomUUID(),
    name: '新しいデッキ',
    slots,
    aceSlotId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const useDeckStore = create<DeckState>()(
  immer((set) => ({
    deck: null,

    setDeck: (deck) =>
      set((state) => {
        state.deck = deck;
      }),

    addCardToSlot: (slotId, card) =>
      set((state) => {
        if (state.deck) {
          const slot = state.deck.slots.find((s) => s.slotId === slotId);
          if (slot) {
            slot.card = card;
            state.deck.updatedAt = new Date().toISOString();
          }
        }
      }),

    removeCardFromSlot: (slotId) =>
      set((state) => {
        if (state.deck) {
          const slot = state.deck.slots.find((s) => s.slotId === slotId);
          if (slot) {
            slot.card = null;
            state.deck.updatedAt = new Date().toISOString();
            // カードを削除する際、そのスロットがエースだった場合はエースも解除
            if (state.deck.aceSlotId === slotId) {
              state.deck.aceSlotId = null;
            }
          }
        }
      }),

    setAceCard: (slotId) =>
      set((state) => {
        if (state.deck) {
          const slot = state.deck.slots.find((s) => s.slotId === slotId);
          // カードがセットされている場合のみエースに設定可能
          if (slot?.card) {
            state.deck.aceSlotId = slotId;
            state.deck.updatedAt = new Date().toISOString();
          }
        }
      }),

    clearAceCard: () =>
      set((state) => {
        if (state.deck) {
          state.deck.aceSlotId = null;
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    clearDeck: () =>
      set((state) => {
        if (state.deck) {
          state.deck.slots.forEach((slot) => {
            slot.card = null;
          });
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    saveDeckToLocal: () =>
      set((state) => {
        if (state.deck && typeof window !== 'undefined') {
          localStorage.setItem('deck', JSON.stringify(state.deck));
        }
      }),

    loadDeckFromLocal: () =>
      set((state) => {
        if (typeof window !== 'undefined') {
          const savedDeck = localStorage.getItem('deck');
          if (savedDeck) {
            state.deck = JSON.parse(savedDeck);
          } else {
            state.deck = createEmptyDeck();
          }
        }
      }),

    initializeDeck: () =>
      set((state) => {
        state.deck = createEmptyDeck();
      }),
  }))
);
