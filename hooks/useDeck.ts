import { useEffect } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { Card } from '@/models/Card';

export const useDeck = () => {
  const {
    deck,
    setDeck,
    addCardToSlot,
    removeCardFromSlot,
    setAceCard,
    clearAceCard,
    clearDeck,
    saveDeckToLocal,
    loadDeckFromLocal,
    initializeDeck,
  } = useDeckStore();

  useEffect(() => {
    loadDeckFromLocal();
  }, [loadDeckFromLocal]);

  const addCard = (slotId: number, card: Card): void => {
    addCardToSlot(slotId, card);
    saveDeckToLocal();
  };

  const removeCard = (slotId: number): void => {
    removeCardFromSlot(slotId);
    saveDeckToLocal();
  };

  const clearAllCards = (): void => {
    clearDeck();
    saveDeckToLocal();
  };

  const saveDeck = (): void => {
    saveDeckToLocal();
  };

  const resetDeck = (): void => {
    initializeDeck();
    saveDeckToLocal();
  };

  const toggleAceCard = (slotId: number): void => {
    if (deck?.aceSlotId === slotId) {
      // 既にエースの場合は解除
      clearAceCard();
    } else {
      // 新しくエースに設定（自動的に排他的）
      setAceCard(slotId);
    }
    saveDeckToLocal();
  };

  return {
    deck,
    setDeck,
    addCard,
    removeCard,
    toggleAceCard,
    clearAllCards,
    saveDeck,
    resetDeck,
  };
};
