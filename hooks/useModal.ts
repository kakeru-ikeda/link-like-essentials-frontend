'use client';

import { useState, useCallback } from 'react';

interface ModalState {
  // デッキ公開モーダル
  isPublishModalOpen: boolean;
}

interface ModalActions {
  // デッキ公開モーダル
  openPublishModal: () => void;
  closePublishModal: () => void;
}

export interface UseModalReturn extends ModalState, ModalActions {}

export function useModal(): UseModalReturn {
  const [state, setState] = useState<ModalState>({
    isPublishModalOpen: false,
  });

  // デッキ公開モーダル
  const openPublishModal = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isPublishModalOpen: true,
    }));
  }, []);

  const closePublishModal = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isPublishModalOpen: false,
    }));
  }, []);

  return {
    ...state,
    openPublishModal,
    closePublishModal,
  };
}

// 汎用的なモーダル状態管理フック
export function useSimpleModal(): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
} {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    open,
    close,
  };
}
