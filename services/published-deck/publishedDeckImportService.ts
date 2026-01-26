import { PublishedDeck } from '@/models/published-deck/PublishedDeck';
import { DeckService } from '@/services/deck/deckService';
import { useDeckStore } from '@/store/deckStore';
import { useDeckTabsStore } from '@/store/deckTabsStore';

/**
 * 公開デッキをローカルデッキとして取り込む
 * - 常に新しいタブとして追加し、そのタブをアクティブにする
 * - タブが未初期化の場合も新規タブを作成
 */
export const publishedDeckImportService = {
  async importToLocal(publishedDeck: PublishedDeck) {
    const compiled = await DeckService.compilePublishedDeck(publishedDeck);

    const deckStore = useDeckStore.getState();
    const tabsStore = useDeckTabsStore.getState();
    // 新しいデッキとして取り込む（IDを新規採番）
    const newDeck = {
      ...compiled,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tabsStore.addTabWithDeck(newDeck);
    tabsStore.saveTabsToLocal();

    deckStore.setDeck(newDeck);
    deckStore.saveDeckToLocal();

    return newDeck;
  },
};
