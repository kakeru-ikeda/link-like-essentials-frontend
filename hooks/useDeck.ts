import { useEffect, useState } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { Card } from '@/models/Card';
import { DeckType } from '@/models/enums';
import { DeckService } from '@/services/deckService';

export const useDeck = () => {
  const {
    deck,
    setDeck,
    setCardToSlot,
    setAceSlotId,
    clearAllSlots,
    setDeckType,
    setSong,
    saveDeckToLocal,
    loadDeckFromLocal,
    initializeDeck,
  } = useDeckStore();

  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    loadDeckFromLocal();
  }, [loadDeckFromLocal]);

  const addCard = (slotId: number, card: Card): boolean => {
    // バリデーション
    const validation = DeckService.validateCardPlacement(card, slotId, deck?.deckType);
    
    if (!validation.success) {
      setLastError(validation.error || 'カードを配置できません');
      return false;
    }

    // Store更新
    setCardToSlot(slotId, card);
    setLastError(null);
    saveDeckToLocal();
    return true;
  };

  const removeCard = (slotId: number): void => {
    setCardToSlot(slotId, null);
    saveDeckToLocal();
  };

  const swapCards = (slotId1: number, slotId2: number): boolean => {
    if (!deck) return false;

    // スワップ実行前のバリデーション
    const validation = DeckService.validateSwap(deck, slotId1, slotId2);
    
    if (!validation.success) {
      setLastError(validation.error || 'カードを入れ替えできません');
      return false;
    }

    // スワップ実行
    const slot1 = deck.slots.find((s) => s.slotId === slotId1);
    const slot2 = deck.slots.find((s) => s.slotId === slotId2);
    
    if (!slot1 || !slot2) return false;

    const tempCard = slot1.card;
    setCardToSlot(slotId1, slot2.card);
    setCardToSlot(slotId2, tempCard);

    // 制約違反のカードを剥がす
    validation.removedSlots.forEach((slotId) => {
      setCardToSlot(slotId, null);
      // エースカードだった場合は解除
      if (deck.aceSlotId === slotId) {
        setAceSlotId(null);
      }
    });

    setLastError(null);
    saveDeckToLocal();
    return true;
  };

  const clearAllCards = (): void => {
    clearAllSlots();
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
    if (!deck) return;

    // 既にエースの場合は解除
    if (DeckService.isAceCard(deck, slotId)) {
      setAceSlotId(null);
    } else {
      // カードがセットされている場合のみエースに設定
      if (DeckService.hasCardInSlot(deck, slotId)) {
        setAceSlotId(slotId);
      }
    }
    saveDeckToLocal();
  };

  const updateDeckType = (deckType: DeckType): boolean => {
    // デッキにカードが編成されているかチェック
    if (DeckService.hasCards(deck)) {
      const confirmed = window.confirm(
        'デッキタイプを変更すると、現在編成されているカードがすべてリセットされます。\n変更してもよろしいですか？'
      );
      
      if (!confirmed) {
        return false;
      }
    }
    
    setDeckType(deckType);
    saveDeckToLocal();
    return true;
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
    getLastError: () => lastError,
  };
};
