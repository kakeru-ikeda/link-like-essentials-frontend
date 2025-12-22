import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Deck } from '@/models/Deck';
import { DeckType } from '@/models/enums';
import { getDeckSlotMapping } from '@/constants/deckConfig';

/**
 * デッキタブ管理専用ストア
 * 複数デッキのタブ切り替えを管理
 */
interface DeckTabsState {
  tabs: Deck[];
  activeTabId: string;
  addTab: () => void;
  deleteTab: (id: string) => void;
  switchTab: (id: string) => void;
  updateCurrentTab: (deck: Deck) => void;
  loadTabsFromLocal: () => void;
  saveTabsToLocal: () => void;
}

/**
 * 空のデッキを作成
 */
const createEmptyDeck = (deckType: DeckType = DeckType.TERM_105): Deck => {
  const mapping = getDeckSlotMapping(deckType);
  const slots = mapping.map((m) => ({
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

export const useDeckTabsStore = create<DeckTabsState>()(
  immer((set, get) => ({
    tabs: [],
    activeTabId: '',

    /**
     * 新しいタブを追加
     */
    addTab: () =>
      set((state) => {
        const newDeck = createEmptyDeck();
        // タブ配列を元にナンバリング
        const deckNumber = state.tabs.length + 1;
        newDeck.name = `デッキ${deckNumber}`;
        state.tabs.push(newDeck);
        state.activeTabId = newDeck.id;
      }),

    /**
     * タブを削除
     * 最後の1つは削除不可
     */
    deleteTab: (id: string) =>
      set((state) => {
        if (state.tabs.length <= 1) return;

        const index = state.tabs.findIndex((tab) => tab.id === id);
        if (index === -1) return;

        state.tabs.splice(index, 1);

        // アクティブタブが削除された場合は隣のタブに切り替え
        if (state.activeTabId === id) {
          const newIndex = Math.max(0, index - 1);
          state.activeTabId = state.tabs[newIndex]?.id ?? state.tabs[0]?.id ?? '';
        }
      }),

    /**
     * タブを切り替え
     */
    switchTab: (id: string) =>
      set((state) => {
        const tab = state.tabs.find((t) => t.id === id);
        if (tab) {
          state.activeTabId = id;
        }
      }),

    /**
     * 現在アクティブなタブの内容を更新
     * deckStoreから呼ばれる
     */
    updateCurrentTab: (deck: Deck) =>
      set((state) => {
        const index = state.tabs.findIndex((tab) => tab.id === state.activeTabId);
        if (index !== -1) {
          state.tabs[index] = deck;
        }
      }),

    /**
     * LocalStorageからタブ情報を読み込み
     */
    loadTabsFromLocal: () =>
      set((state) => {
        if (typeof window === 'undefined') return;

        const saved = localStorage.getItem('deckTabs');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            state.tabs = parsed.tabs ?? [];
            state.activeTabId = parsed.activeTabId ?? '';

            // タブが空の場合は初期タブを作成
            if (state.tabs.length === 0) {
              const initialDeck = createEmptyDeck();
              state.tabs = [initialDeck];
              state.activeTabId = initialDeck.id;
            }
          } catch (error) {
            console.error('Failed to load deck tabs:', error);
            // エラー時は初期タブを作成
            const initialDeck = createEmptyDeck();
            state.tabs = [initialDeck];
            state.activeTabId = initialDeck.id;
          }
        } else {
          // 初回起動時: 既存のdeckがあればそれを使用
          const existingDeck = localStorage.getItem('deck');
          if (existingDeck) {
            try {
              const deck = JSON.parse(existingDeck);
              state.tabs = [deck];
              state.activeTabId = deck.id;
            } catch (error) {
              const initialDeck = createEmptyDeck();
              state.tabs = [initialDeck];
              state.activeTabId = initialDeck.id;
            }
          } else {
            const initialDeck = createEmptyDeck();
            state.tabs = [initialDeck];
            state.activeTabId = initialDeck.id;
          }
        }
      }),

    /**
     * LocalStorageにタブ情報を保存
     */
    saveTabsToLocal: () => {
      const { tabs, activeTabId } = get();
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'deckTabs',
          JSON.stringify({ tabs, activeTabId })
        );
      }
    },
  }))
);
