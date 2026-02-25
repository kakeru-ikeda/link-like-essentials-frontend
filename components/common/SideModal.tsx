'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { KeywordSearchInput } from '@/components/common/KeywordSearchInput';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  headerActions?: React.ReactNode;
  hideCloseButton?: boolean;
  keywordSearch?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  zIndex?: number; // z-indexを外部から指定可能に
}

const widthClasses = {
  sm: 'w-[30%]',
  md: 'w-[45%]',
  lg: 'w-[55%]',
  xl: 'w-[65%]',
  full: 'w-[75%]',
};

export function SideModal({
  isOpen,
  onClose,
  children,
  title,
  width = 'md',
  headerActions,
  hideCloseButton = false,
  keywordSearch,
  zIndex = 40,
}: SideModalProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [shouldMount, setShouldMount] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const { isSp } = useResponsiveDevice();

  // クライアントサイドでマウントされたことを確認
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!shouldMount || !mounted) return null;

  const modalWidthClass = isSp ? 'w-full' : widthClasses[width];

  const modalContent = (
    <>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* サイドモーダル本体 */}
      <div
        className={`fixed top-0 right-0 h-full ${modalWidthClass} bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: zIndex + 10 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'side-modal-title' : undefined}
      >
        {/* ヘッダー */}
        {title && (
          <div className="border-b border-gray-200 flex-shrink-0">
            {/* SP表示: タイトル+Xボタン / headerActionsを別行に */}
            <div className="sm:hidden px-6 py-4">
              <div className="flex flex-row items-center justify-between gap-3 mb-3">
                <h2
                  id="side-modal-title"
                  className="text-xl font-bold text-gray-900 flex-shrink min-w-0 truncate"
                >
                  {title}
                </h2>
                {!hideCloseButton && (
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="閉じる"
                    disabled={isAnimating}
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              {headerActions && (
                <div className="flex items-center">{headerActions}</div>
              )}
            </div>

            {/* PC表示: タイトル、headerActions、Xボタンを1行に */}
            <div className="hidden sm:flex items-center justify-between px-6 py-4 gap-3">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <div className="flex items-center gap-2">
                {headerActions}
                {!hideCloseButton && (
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="閉じる"
                    disabled={isAnimating}
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* キーワード検索 */}
            {keywordSearch && (
              <div className="px-6 pb-4">
                <KeywordSearchInput
                  value={keywordSearch.value}
                  onChange={keywordSearch.onChange}
                  placeholder={keywordSearch.placeholder}
                />
              </div>
            )}
          </div>
        )}

        {/* コンテンツエリア（スクロール可能） */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
