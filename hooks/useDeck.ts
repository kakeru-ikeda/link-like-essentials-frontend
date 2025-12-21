import { useEffect, useState } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { Card } from '@/models/Card';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';
import { DeckService } from '@/services/deckService';
import { LiveGrandPrixService } from '@/services/liveGrandPrixService';
import { LiveGrandPrixDetail } from '@/models/LiveGrandPrix';

export const useDeck = () => {
  const {
    deck,
    setDeck,
    setCardToSlot,
    swapCardSlots,
    setAceSlotId,
    setLimitBreakCount,
    clearDeck,
    setDeckType,
    setDeckName,
    setSong,
    setLiveGrandPrix,
    setLiveGrandPrixStage,
    setScore,
    setDeckMemo,
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
    // エースカードの場合は先に解除
    if (deck?.aceSlotId === slotId) {
      setAceSlotId(null);
    }
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

    // スワップ実行（atomic操作）
    swapCardSlots(slotId1, slotId2, validation.removedSlots);

    setLastError(null);
    saveDeckToLocal();
    return true;
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

  const updateDeckType = (newDeckType: DeckType): void => {
    // バリデーション（ビジネスロジック）
    const validation = DeckService.validateDeckTypeChange(deck, newDeckType);
    
    if (!validation.canChange) {
      return;
    }
    
    // 確認が必要な場合はダイアログ表示
    if (validation.requiresConfirmation && validation.message) {
      const confirmed = window.confirm(validation.message);
      if (!confirmed) {
        return;
      }
    }
    
    setDeckType(newDeckType);
    saveDeckToLocal();
  };

  const updateSong = (song: Partial<Song>): void => {
    setSong(song);
    saveDeckToLocal();
  };

  const updateLiveGrandPrix = (liveGrandPrixId: string, eventName: string): void => {
    setLiveGrandPrix(
      liveGrandPrixId || undefined,
      eventName || undefined
    );
    saveDeckToLocal();
  };

  const updateLiveGrandPrixStage = (detail: LiveGrandPrixDetail | null): void => {
    if (detail?.id && detail.stageName) {
      // ステージに関連する楽曲情報を自動設定（ビジネスロジック）
      const song = LiveGrandPrixService.transformStageDetailToSong(detail);
      
      // バリデーション（ビジネスロジック）
      const validation = DeckService.validateStageChange(deck, song?.deckType);
      
      // 確認が必要な場合はダイアログ表示
      if (validation.requiresConfirmation && validation.message) {
        const confirmed = window.confirm(validation.message);
        if (!confirmed) {
          return;
        }
      }
      
      setLiveGrandPrixStage(
        detail.id,
        detail.stageName,
        song
      );
    } else {
      // クリア時
      setLiveGrandPrixStage(undefined, undefined, undefined);
    }
    saveDeckToLocal();
  };


  const updateDeckName = (name: string): void => {
    setDeckName(name);
    saveDeckToLocal();
  };

  const updateDeckMemo = (memo: string): void => {
    setDeckMemo(memo);
    saveDeckToLocal();
  };

  const updateScore = (score: number | undefined): void => {
    setScore(score);
    saveDeckToLocal();
  };

  const updateLimitBreakCount = (slotId: number, count: number): void => {
    setLimitBreakCount(slotId, count);
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
    updateDeckName,
    updateDeckMemo,
    updateScore,
    updateSong,
    updateLiveGrandPrix,
    updateLiveGrandPrixStage,
    updateLimitBreakCount,
    clearAllCards,
    saveDeck,
    resetDeck,
    getLastError: () => lastError,
  };
};
