'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: 'sm' | 'md' | 'lg';
  headerActions?: React.ReactNode;
}

const widthClasses = {
  sm: 'w-[30%]',
  md: 'w-[40%]',
  lg: 'w-[50%]',
};

export function SideModal({
  isOpen,
  onClose,
  children,
  title,
  width = 'md',
  headerActions,
}: SideModalProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [shouldMount, setShouldMount] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // マウント・アンマウント制御
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShouldMount(true);
      // 次のフレームでアニメーション開始
      const visibleTimer = setTimeout(() => setIsVisible(true), 10);
      // アニメーション完了
      const animatingTimer = setTimeout(() => setIsAnimating(false), 310);
      return () => {
        clearTimeout(visibleTimer);
        clearTimeout(animatingTimer);
      };
    } else if (shouldMount) {
      setIsAnimating(true);
      // 閉じるとき: まずアニメーション状態を解除
      setIsVisible(false);
      // アニメーション完了後にアンマウント
      const mountTimer = setTimeout(() => setShouldMount(false), 300);
      const animatingTimer = setTimeout(() => setIsAnimating(false), 310);
      return () => {
        clearTimeout(mountTimer);
        clearTimeout(animatingTimer);
      };
    }
  }, [isOpen, shouldMount]);

  // アニメーション中の閉じる操作を防ぐ
  const handleClose = (): void => {
    if (!isAnimating) {
      onClose();
    }
  };

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // モーダル表示中はスクロール無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldMount) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* サイドモーダル本体 */}
      <div
        className={`fixed top-0 right-0 h-full ${widthClasses[width]} bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'side-modal-title' : undefined}
      >
        {/* ヘッダー */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 id="side-modal-title" className="text-xl font-bold text-gray-900">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              {headerActions}
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="閉じる"
                disabled={isAnimating}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* コンテンツエリア（スクロール可能） */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
