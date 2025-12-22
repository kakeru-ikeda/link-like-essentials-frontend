import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Deck } from '@/models/Deck';
import { DeckTabsService } from '@/services/deckTabsService';

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

export const useDeckTabsStore = create<DeckTabsState>()(
  immer((set, get) => ({
    tabs: [],
    activeTabId: '',

    /**
     * 新しいタブを追加
     */
    addTab: () =>
      set((state) => {
        const newDeck = DeckTabsService.createEmptyDeck();
        // タブ配列を元にナンバリング
        newDeck.name = DeckTabsService.generateDeckName(state.tabs.length);
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
        const data = DeckTabsService.loadTabsFromLocal();
        state.tabs = data.tabs;
        state.activeTabId = data.activeTabId;
      }),

    /**
     * LocalStorageにタブ情報を保存
     */
    saveTabsToLocal: () => {
      const { tabs, activeTabId } = get();
      DeckTabsService.saveTabsToLocal({ tabs, activeTabId });
    },
  }))
);
