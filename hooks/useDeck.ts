import { useEffect } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { Card } from '@/models/Card';

export const useDeck = () => {
  const {
    deck,
    setDeck,
    addCardToSlot,
    removeCardFromSlot,
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

  return {
    deck,
    setDeck,
    addCard,
    removeCard,
    clearAllCards,
    saveDeck,
    resetDeck,
  };
};
