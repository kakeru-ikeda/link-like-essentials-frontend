import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Deck, DeckSlot } from '@/models/Deck';
import { Card } from '@/models/Card';
import { Song } from '@/models/Song';
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
  setLimitBreakCount: (slotId: number, count: number) => void;
  clearDeck: () => void;
  setDeckType: (deckType: DeckType) => void;
  setDeckName: (name: string) => void;
  setSong: (song: Partial<Song>) => void;
  setDeckMemo: (memo: string) => void;
  saveDeckToLocal: () => void;
  loadDeckFromLocal: () => void;
  initializeDeck: () => void;
}

const DECK_MEMO_TEMPLATE = '[1セク]\n\n[2セク]\n\n[3セク]\n\n[4セク]\n\n[5セク]\n\n';

const createEmptyDeck = (deckType?: DeckType): Deck => {
  const mapping = getDeckSlotMapping(deckType);
  const slots: DeckSlot[] = mapping.map((m) => ({
    slotId: m.slotId,
    characterName: m.characterName,
    card: null,
  }));

  // 全スロットの上限解放数をデフォルト14に設定
  const limitBreakCounts: { [slotId: number]: number } = {};
  mapping.forEach((m) => {
    limitBreakCounts[m.slotId] = 14;
  });

  return {
    id: crypto.randomUUID(),
    name: '新しいデッキ',
    slots,
    aceSlotId: null,
    limitBreakCounts,
    deckType,
    memo: DECK_MEMO_TEMPLATE,
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

    setLimitBreakCount: (slotId, count) =>
      set((state) => {
        if (state.deck) {
          const slot = state.deck.slots.find((s) => s.slotId === slotId);
          if (slot?.card) {
            // 1-14の範囲内に制限
            const validatedCount = Math.max(1, Math.min(14, count));
            state.deck.limitBreakCounts[slot.card.id] = validatedCount;
            state.deck.updatedAt = new Date().toISOString();
          }
        }
      }),

    clearDeck: () =>
      set((state) => {
        if (state.deck) {
          state.deck.name = '新しいデッキ';
          state.deck.slots.forEach((slot) => {
            slot.card = null;
          });
          state.deck.aceSlotId = null;
          state.deck.songId = undefined;
          state.deck.songName = undefined;
          state.deck.centerCharacter = undefined;
          state.deck.participations = undefined;
          state.deck.liveAnalyzerImageUrl = undefined;
          state.deck.memo = DECK_MEMO_TEMPLATE;
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

    setDeckName: (name) =>
      set((state) => {
        if (state.deck) {
          state.deck.name = name;
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    setSong: (song) =>
      set((state) => {
        if (state.deck) {
          state.deck.songId = song.id;
          state.deck.songName = song.songName;
          state.deck.centerCharacter = song.centerCharacter;
          state.deck.participations = song.participations;
          state.deck.liveAnalyzerImageUrl = song.liveAnalyzerImageUrl;
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    setDeckMemo: (memo) =>
      set((state) => {
        if (state.deck) {
          state.deck.memo = memo;
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
            
            // マイグレーション: limitBreakCounts が存在しない場合は追加
            if (!parsed.limitBreakCounts) {
              parsed.limitBreakCounts = {};
              parsed.slots.forEach((slot: DeckSlot) => {
                parsed.limitBreakCounts[slot.slotId] = 14;
              });
            }
            
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
