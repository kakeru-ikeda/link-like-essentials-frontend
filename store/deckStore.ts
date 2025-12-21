import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Deck, DeckSlot } from '@/models/Deck';
import { Card } from '@/models/Card';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';
import { getDeckSlotMapping } from '@/constants/deckConfig';
import { deckCloudService } from '@/services/deckCloudService';

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
  setLiveGrandPrix: (liveGrandPrixId: string, eventName: string) => void;
  setLiveGrandPrixStage: (detailId: string, stageName: string, song?: Partial<Song>) => void;
  setDeckMemo: (memo: string) => void;
  saveDeckToLocal: () => void;
  loadDeckFromLocal: () => void;
  initializeDeck: () => void;
  
  // クラウド保存関連
  saveToCloud: () => Promise<void>;
  loadFromCloud: (deckId: string) => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
  cloudError: string | null;
}

const createEmptyDeck = (deckType: DeckType = DeckType.TERM_105): Deck => {
  const mapping = getDeckSlotMapping(deckType);
  const slots: DeckSlot[] = mapping.map((m) => ({
    slotId: m.slotId,
    characterName: m.characterName,
    cardId: null,
  }));

  return {
    id: crypto.randomUUID(),
    name: '新しいデッキ',
    slots,
    aceSlotId: null,
    deckType,
    memo: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const useDeckStore = create<DeckState>()(
  immer((set, get) => ({
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
            slot.cardId = card?.id ?? null;
            slot.limitBreak = card ? (slot.limitBreak ?? 14) : undefined;
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
            // スワップ実行（card, cardId, limitBreakを全てスワップ）
            const tempCard = slot1.card;
            const tempCardId = slot1.cardId;
            const tempLimitBreak = slot1.limitBreak;
            
            slot1.card = slot2.card;
            slot1.cardId = slot2.cardId;
            slot1.limitBreak = slot2.limitBreak;
            
            slot2.card = tempCard;
            slot2.cardId = tempCardId;
            slot2.limitBreak = tempLimitBreak;

            // 制約違反のカードを剥がす
            removedSlots.forEach((slotId) => {
              const slot = state.deck!.slots.find((s) => s.slotId === slotId);
              if (slot) {
                slot.card = null;
                slot.cardId = null;
                slot.limitBreak = undefined;
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
            slot.limitBreak = validatedCount;
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
            slot.cardId = null;
            slot.limitBreak = undefined;
          });
          state.deck.aceSlotId = null;
          state.deck.songId = undefined;
          state.deck.songName = undefined;
          state.deck.centerCharacter = undefined;
          state.deck.participations = undefined;
          state.deck.liveAnalyzerImageUrl = undefined;
          state.deck.liveGrandPrixId = undefined;
          state.deck.liveGrandPrixDetailId = undefined;
          state.deck.liveGrandPrixEventName = undefined;
          state.deck.liveGrandPrixStageName = undefined;
          state.deck.memo = '';
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

    setLiveGrandPrix: (liveGrandPrixId, eventName) =>
      set((state) => {
        if (state.deck) {
          state.deck.liveGrandPrixId = liveGrandPrixId;
          state.deck.liveGrandPrixEventName = eventName;
          // ライブグランプリ変更時はステージ情報と楽曲情報をクリア
          state.deck.liveGrandPrixDetailId = undefined;
          state.deck.liveGrandPrixStageName = undefined;
          state.deck.songId = undefined;
          state.deck.songName = undefined;
          state.deck.centerCharacter = undefined;
          state.deck.participations = undefined;
          state.deck.liveAnalyzerImageUrl = undefined;
          state.deck.updatedAt = new Date().toISOString();
        }
      }),

    setLiveGrandPrixStage: (detailId, stageName, song) =>
      set((state) => {
        if (state.deck) {
          // デッキタイプが変更される場合、カードをクリア
          const isDeckTypeChanging = song?.deckType && 
                                     state.deck.deckType && 
                                     song.deckType !== state.deck.deckType;
          
          if (isDeckTypeChanging) {
            // カードをすべてクリア
            state.deck.slots.forEach((slot) => {
              slot.card = null;
              slot.cardId = null;
              slot.limitBreak = undefined;
            });
            state.deck.aceSlotId = null;
          }
          
          state.deck.liveGrandPrixDetailId = detailId;
          state.deck.liveGrandPrixStageName = stageName;
          // 楽曲情報が提供されていれば自動設定
          if (song) {
            state.deck.songId = song.id;
            state.deck.songName = song.songName;
            state.deck.centerCharacter = song.centerCharacter;
            state.deck.participations = song.participations;
            state.deck.liveAnalyzerImageUrl = song.liveAnalyzerImageUrl;
            // 楽曲のdeckTypeがあれば自動設定
            if (song.deckType) {
              state.deck.deckType = song.deckType;
            }
          }
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
            state.deck = JSON.parse(savedDeck);
          } else {
            state.deck = createEmptyDeck();
          }
        }
      }),

    initializeDeck: () =>
      set((state) => {
        const currentDeckType = state.deck?.deckType ?? DeckType.TERM_105;
        state.deck = createEmptyDeck(currentDeckType);
      }),

    // クラウド保存関連
    isSaving: false,
    isLoading: false,
    cloudError: null,

    saveToCloud: async () => {
      const { deck } = get();
      if (!deck) return;

      set((state) => {
        state.isSaving = true;
        state.cloudError = null;
      });

      try {
        const savedDeck = await deckCloudService.saveDeckToCloud(deck);
        set((state) => {
          state.deck = savedDeck;
          state.isSaving = false;
        });
      } catch (error) {
        set((state) => {
          state.isSaving = false;
          state.cloudError =
            error instanceof Error ? error.message : '保存に失敗しました';
        });
        throw error;
      }
    },

    loadFromCloud: async (deckId: string) => {
      set((state) => {
        state.isLoading = true;
        state.cloudError = null;
      });

      try {
        const loadedDeck = await deckCloudService.loadDeckFromCloud(deckId);
        set((state) => {
          state.deck = loadedDeck;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.cloudError =
            error instanceof Error ? error.message : '読み込みに失敗しました';
        });
        throw error;
      }
    },
  }))
);
