import { useEffect } from 'react';
import { useDeckTabsStore } from '@/store/deckTabsStore';
import { useDeckStore } from '@/store/deckStore';

/**
 * デッキタブ管理用カスタムフック
 * タブの追加・削除・切り替えを提供
 */
export const useDeckTabs = () => {
  const {
    tabs,
    activeTabId,
    addTab,
    deleteTab,
    switchTab,
    loadTabsFromLocal,
    saveTabsToLocal,
  } = useDeckTabsStore();

  const { deck, setDeck } = useDeckStore();

  // 初回マウント時にLocalStorageから読み込み
  useEffect(() => {
    loadTabsFromLocal();
  }, [loadTabsFromLocal]);

  // タブ情報が読み込まれたら、アクティブなデッキをdeckStoreに設定
  useEffect(() => {
    if (tabs.length > 0 && activeTabId) {
      const activeDeck = tabs.find((tab) => tab.id === activeTabId);
      if (activeDeck && activeDeck.id !== deck?.id) {
        setDeck(activeDeck);
      }
    }
  }, [tabs, activeTabId, deck?.id, setDeck]);

  /**
   * タブを追加
   */
  const handleAddTab = (): void => {
    addTab();
    saveTabsToLocal();
  };

  /**
   * タブを削除
   */
  const handleDeleteTab = (id: string): void => {
    deleteTab(id);
    saveTabsToLocal();
  };

  /**
   * タブを切り替え
   * 切り替え前に現在のデッキを保存
   */
  const handleSwitchTab = (id: string): void => {
    // 現在のデッキを保存してからタブ切り替え
    const currentDeck = useDeckStore.getState().deck;
    const { activeTabId: currentActiveTabId, updateCurrentTab } =
      useDeckTabsStore.getState();
    if (currentDeck && currentDeck.id === currentActiveTabId) {
      updateCurrentTab(currentDeck);
    }

    // タブを切り替え
    switchTab(id);
    saveTabsToLocal();
  };

  return {
    tabs: tabs.map((tab) => ({ id: tab.id, name: tab.name })),
    activeTabId,
    addTab: handleAddTab,
    deleteTab: handleDeleteTab,
    switchTab: handleSwitchTab,
  };
};
