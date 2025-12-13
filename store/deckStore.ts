import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Deck, DeckSlot } from '@/models/Deck';
import { Card } from '@/models/Card';
import { DeckType } from '@/models/enums';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';
import { canPlaceCardInSlot } from '@/constants/deckRules';

interface DeckState {
  deck: Deck | null;
  lastError: string | null;
  setDeck: (deck: Deck) => void;
  addCardToSlot: (slotId: number, card: Card) => boolean;
  removeCardFromSlot: (slotId: number) => void;
  swapCards: (slotId1: number, slotId2: number) => boolean;
  setAceCard: (slotId: number) => void;
  clearAceCard: () => void;
  clearDeck: () => void;
  setDeckType: (deckType: DeckType) => void;
  setSong: (songId: string, songName: string) => void;
  saveDeckToLocal: () => void;
  loadDeckFromLocal: () => void;
  initializeDeck: () => void;
  getLastError: () => string | null;
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
  immer((set, get) => ({
    deck: null,
    lastError: null,

    setDeck: (deck) =>
      set((state) => {
        state.deck = deck;
      }),

    addCardToSlot: (slotId, card) => {
      const validationResult = canPlaceCardInSlot(
        { characterName: card.characterName, rarity: card.rarity },
        slotId
      );

      if (!validationResult.allowed) {
        set((state) => {
          state.lastError = validationResult.reason || '編成できませんでした';
        });
        return false;
      }

      set((state) => {
        if (state.deck) {
          const slot = state.deck.slots.find((s) => s.slotId === slotId);
          if (slot) {
            slot.card = card;
            state.deck.updatedAt = new Date().toISOString();
            state.lastError = null;
          }
        }
      });
      return true;
    },

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

    swapCards: (slotId1, slotId2) => {
      const state = get();
      if (!state.deck) return false;

      const slot1 = state.deck.slots.find((s) => s.slotId === slotId1);
      const slot2 = state.deck.slots.find((s) => s.slotId === slotId2);

      if (!slot1 || !slot2) return false;

      set((state) => {
        if (state.deck) {
          const slot1 = state.deck.slots.find((s) => s.slotId === slotId1);
          const slot2 = state.deck.slots.find((s) => s.slotId === slotId2);
          if (!slot1 || !slot2) return;

          // スワップ実行
          const tempCard = slot1.card;
          slot1.card = slot2.card;
          slot2.card = tempCard;

          // スワップ後の編成ルールチェック
          // slot1に配置されたカードが制約違反なら剥がす
          if (slot1.card) {
            const validation1 = canPlaceCardInSlot(
              { characterName: slot1.card.characterName, rarity: slot1.card.rarity },
              slotId1
            );
            if (!validation1.allowed) {
              slot1.card = null;
              // エースカードだった場合は解除
              if (state.deck.aceSlotId === slotId1) {
                state.deck.aceSlotId = null;
              }
            }
          }

          // slot2に配置されたカードが制約違反なら剥がす
          if (slot2.card) {
            const validation2 = canPlaceCardInSlot(
              { characterName: slot2.card.characterName, rarity: slot2.card.rarity },
              slotId2
            );
            if (!validation2.allowed) {
              slot2.card = null;
              // エースカードだった場合は解除
              if (state.deck.aceSlotId === slotId2) {
                state.deck.aceSlotId = null;
              }
            }
          }

          state.deck.updatedAt = new Date().toISOString();
          state.lastError = null;
        }
      });
      return true;
    },

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

    setDeckType: (deckType) =>
      set((state) => {
        if (state.deck) {
          state.deck.deckType = deckType;
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    setSong: (songId, songName) =>
      set((state) => {
        if (state.deck) {
          state.deck.songId = songId;
          state.deck.songName = songName;
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

    getLastError: () => get().lastError,
  }))
);
