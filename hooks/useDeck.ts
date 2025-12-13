import { useEffect } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { Card } from '@/models/Card';
import { DeckType } from '@/models/enums';

export const useDeck = () => {
  const {
    deck,
    setDeck,
    addCardToSlot,
    removeCardFromSlot,
    swapCards: swapCardsInDeck,
    setAceCard,
    clearAceCard,
    clearDeck,
    setDeckType,
    setSong,
    saveDeckToLocal,
    loadDeckFromLocal,
    initializeDeck,
    getLastError,
  } = useDeckStore();

  useEffect(() => {
    loadDeckFromLocal();
  }, [loadDeckFromLocal]);

  const addCard = (slotId: number, card: Card): boolean => {
    const success = addCardToSlot(slotId, card);
    if (success) {
      saveDeckToLocal();
    }
    return success;
  };

  const removeCard = (slotId: number): void => {
    removeCardFromSlot(slotId);
    saveDeckToLocal();
  };

  const swapCards = (slotId1: number, slotId2: number): boolean => {
    const success = swapCardsInDeck(slotId1, slotId2);
    if (success) {
      saveDeckToLocal();
    }
    return success;
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

  const updateDeckType = (deckType: DeckType): void => {
    setDeckType(deckType);
    saveDeckToLocal();
  };

  const updateSong = (songId: string, songName: string): void => {
    setSong(songId, songName);
    saveDeckToLocal();
  };

  return {
    deck,
    setDeck,
    addCard,
    removeCard,
    swapCards,
    toggleAceCard,
    updateDeckType,
    updateSong,
    clearAllCards,
    saveDeck,
    resetDeck,
    getLastError,
  };
};
