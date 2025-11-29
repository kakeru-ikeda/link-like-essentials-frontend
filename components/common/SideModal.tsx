'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: 'sm' | 'md' | 'lg';
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
}: SideModalProps): JSX.Element | null {
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

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* サイドモーダル本体 */}
      <div
        className={`fixed top-0 right-0 h-full ${widthClasses[width]} bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col`}
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
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
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
