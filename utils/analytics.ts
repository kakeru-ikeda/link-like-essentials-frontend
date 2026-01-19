import { analytics } from '@/repositories/firebase/config';
import { logEvent as firebaseLogEvent } from 'firebase/analytics';

/**
 * ページビューを記録
 */
export const logPageView = (url: string) => {
  if (analytics) {
    firebaseLogEvent(analytics, 'page_view', {
      page_path: url,
      page_title: document.title,
    });
  }
};

/**
 * カスタムイベントを記録
 */
export const logCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

/**
 * デッキ作成イベント
 */
export const logDeckCreated = (deckId: string, characterCount: number) => {
  logCustomEvent('deck_created', {
    deck_id: deckId,
    character_count: characterCount,
  });
};

/**
 * デッキ公開イベント
 */
export const logDeckPublished = (deckId: string) => {
  logCustomEvent('deck_published', {
    deck_id: deckId,
  });
};

/**
 * デッキいいねイベント
 */
export const logDeckLiked = (deckId: string) => {
  logCustomEvent('deck_liked', {
    deck_id: deckId,
  });
};

/**
 * デッキコメント投稿イベント
 */
export const logDeckCommented = (deckId: string) => {
  logCustomEvent('deck_commented', {
    deck_id: deckId,
  });
};

/**
 * カードフィルター使用イベント
 */
export const logCardFiltered = (filterType: string, value: string) => {
  logCustomEvent('card_filtered', {
    filter_type: filterType,
    filter_value: value,
  });
};

/**
 * カード追加イベント
 */
export const logCardAdded = (cardId: string, slotId: number) => {
  logCustomEvent('card_added_to_deck', {
    card_id: cardId,
    slot_id: slotId,
  });
};

/**
 * デッキエクスポートイベント
 */
export const logDeckExported = (deckId: string, format: 'image' | 'screenshot') => {
  logCustomEvent('deck_exported', {
    deck_id: deckId,
    export_format: format,
  });
};

/**
 * ログインイベント
 */
export const logLogin = (method: 'anonymous' | 'email' | 'upgrade') => {
  logCustomEvent('login', {
    method,
  });
};

/**
 * サインアップイベント
 */
export const logSignUp = (method: 'anonymous' | 'email') => {
  logCustomEvent('sign_up', {
    method,
  });
};
