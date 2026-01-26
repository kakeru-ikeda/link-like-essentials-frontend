import { logAnalyticsEvent } from '@/repositories/firebase/analytics';

export const logPageView = (url: string) => {
  const pageTitle = typeof document !== 'undefined' ? document.title : '';
  logAnalyticsEvent('page_view', {
    page_path: url,
    page_title: pageTitle,
  });
};

export const logCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
  logAnalyticsEvent(eventName, params);
};

export const logDeckCreated = (deckId: string, slotCount: number) => {
  logCustomEvent('deck_created', {
    deck_id: deckId,
    slot_count: slotCount,
  });
};

export const logDeckPublished = (deckId: string) => {
  logCustomEvent('deck_published', {
    deck_id: deckId,
  });
};

export const logDeckLiked = (deckId: string) => {
  logCustomEvent('deck_liked', {
    deck_id: deckId,
  });
};

export const logDeckCommented = (deckId: string) => {
  logCustomEvent('deck_commented', {
    deck_id: deckId,
  });
};

export const logDeckExported = (deckId: string, format: 'image' | 'screenshot') => {
  logCustomEvent('deck_exported', {
    deck_id: deckId,
    export_format: format,
  });
};

export const logLogin = (method: 'anonymous' | 'email' | 'upgrade') => {
  logCustomEvent('login', {
    method,
  });
};

export const logSignUp = (method: 'anonymous' | 'email') => {
  logCustomEvent('sign_up', {
    method,
  });
};
