'use client';

import { useState, useCallback } from 'react';

interface SideModalState {
  // カード検索モーダル
  isCardSearchOpen: boolean;
  currentSlotId: number | null;
  
  // カード詳細モーダル
  isCardDetailOpen: boolean;
  selectedCardId: string | null;
  
  // フィルターモーダル
  isFilterOpen: boolean;
}

interface SideModalActions {
  // カード検索モーダル
  openCardSearch: (slotId: number) => void;
  closeCardSearch: () => void;
  
  // カード詳細モーダル
  openCardDetail: (cardId: string) => void;
  closeCardDetail: () => void;
  
  // フィルターモーダル
  openFilter: () => void;
  closeFilter: () => void;
}

export interface UseSideModalReturn extends SideModalState, SideModalActions {}

export function useSideModal(): UseSideModalReturn {
  const [state, setState] = useState<SideModalState>({
    isCardSearchOpen: false,
    currentSlotId: null,
    isCardDetailOpen: false,
    selectedCardId: null,
    isFilterOpen: false,
  });

  // カード検索モーダル
  const openCardSearch = useCallback((slotId: number): void => {
    setState((prev) => ({
      ...prev,
      isCardSearchOpen: true,
      currentSlotId: slotId,
    }));
  }, []);

  const closeCardSearch = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isCardSearchOpen: false,
      currentSlotId: null,
    }));
  }, []);

  // カード詳細モーダル
  const openCardDetail = useCallback((cardId: string): void => {
    setState((prev) => ({
      ...prev,
      isCardDetailOpen: true,
      selectedCardId: cardId,
    }));
  }, []);

  const closeCardDetail = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isCardDetailOpen: false,
      selectedCardId: null,
    }));
  }, []);

  // フィルターモーダル
  const openFilter = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isFilterOpen: true,
    }));
  }, []);

  const closeFilter = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isFilterOpen: false,
    }));
  }, []);

  return {
    ...state,
    openCardSearch,
    closeCardSearch,
    openCardDetail,
    closeCardDetail,
    openFilter,
    closeFilter,
  };
}
