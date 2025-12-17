import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Deck, DeckSlot } from '@/models/Deck';
import { Card } from '@/models/Card';
import { DeckType } from '@/models/enums';
import { getDeckSlotMapping } from '@/constants/deckConfig';

/**
 * デッキストアの状態管理インターフェース
 * ビジネスロジックはservices/deckService.tsに委譲
 */
interface DeckState {
  deck: Deck | null;
  setDeck: (deck: Deck) => void;
  setCardToSlot: (slotId: number, card: Card | null) => void;
  swapCardSlots: (slotId1: number, slotId2: number, removedSlots: number[]) => void;
  setAceSlotId: (slotId: number | null) => void;
  clearAllSlots: () => void;
  setDeckType: (deckType: DeckType) => void;
  setSong: (song: { id: string; name: string; centerCharacter: string; participations: string[]; liveAnalyzerImageUrl?: string }) => void;
  saveDeckToLocal: () => void;
  loadDeckFromLocal: () => void;
  initializeDeck: () => void;
}

const createEmptyDeck = (deckType?: DeckType): Deck => {
  const mapping = getDeckSlotMapping(deckType);
  const slots: DeckSlot[] = mapping.map((m) => ({
    slotId: m.slotId,
    characterName: m.characterName,
    card: null,
  }));

  return {
    id: crypto.randomUUID(),
    name: '新しいデッキ',
    slots,
    aceSlotId: null,
    deckType,
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

    setCardToSlot: (slotId, card) =>
      set((state) => {
        if (state.deck) {
          const slot = state.deck.slots.find((s) => s.slotId === slotId);
          if (slot) {
            slot.card = card;
            state.deck.updatedAt = new Date().toISOString();
          }
        }
      }),

    swapCardSlots: (slotId1, slotId2, removedSlots) =>
      set((state) => {
        if (state.deck) {
          const slot1 = state.deck.slots.find((s) => s.slotId === slotId1);
          const slot2 = state.deck.slots.find((s) => s.slotId === slotId2);
          
          if (slot1 && slot2) {
            // スワップ実行
            const tempCard = slot1.card;
            slot1.card = slot2.card;
            slot2.card = tempCard;

            // 制約違反のカードを剥がす
            removedSlots.forEach((slotId) => {
              const slot = state.deck!.slots.find((s) => s.slotId === slotId);
              if (slot) {
                slot.card = null;
              }
              // エースカードだった場合は解除
              if (state.deck!.aceSlotId === slotId) {
                state.deck!.aceSlotId = null;
              }
            });

            state.deck.updatedAt = new Date().toISOString();
          }
        }
      }),

    setAceSlotId: (slotId) =>
      set((state) => {
        if (state.deck) {
          state.deck.aceSlotId = slotId;
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    clearAllSlots: () =>
      set((state) => {
        if (state.deck) {
          state.deck.slots.forEach((slot) => {
            slot.card = null;
          });
          state.deck.aceSlotId = null;
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    setDeckType: (deckType) =>
      set((state) => {
        if (state.deck) {
          // デッキタイプ変更時はスロット構成を再構築
          const newDeck = createEmptyDeck(deckType);
          state.deck = {
            ...newDeck,
            id: state.deck.id,
            name: state.deck.name,
            songId: state.deck.songId,
            songName: state.deck.songName,
            createdAt: state.deck.createdAt,
          };
        }
      }),

    setSong: (song) =>
      set((state) => {
        if (state.deck) {
          state.deck.songId = song.id;
          state.deck.songName = song.name;
          state.deck.centerCharacter = song.centerCharacter;
          state.deck.participations = song.participations;
          state.deck.liveAnalyzerImageUrl = song.liveAnalyzerImageUrl;
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
            const parsed = JSON.parse(savedDeck);
            state.deck = parsed;
          } else {
            state.deck = createEmptyDeck();
          }
        }
      }),

    initializeDeck: () =>
      set((state) => {
        const currentDeckType = state.deck?.deckType;
        state.deck = createEmptyDeck(currentDeckType);
      }),
  }))
);
