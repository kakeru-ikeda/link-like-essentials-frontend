'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DeckSlot as DeckSlotType } from '@/models/domain/Deck';
import { getCharacterColor } from '@/utils/colorUtils';
import { ApBadge } from '@/components/common/ApBadge';
import { RarityBadge } from '@/components/common/RarityBadge';
import { AceBadge } from '@/components/common/AceBadge';
import { LimitBreakBadge } from '@/components/deck/LimitBreakBadge';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';

interface DeckSlotProps {
  slot: DeckSlotType;
  onSlotClick: (slotId: number) => void;
  onRemoveCard?: (slotId: number) => void;
  onToggleAce?: (slotId: number) => void;
  onShowDetail?: (cardId: string) => void;
  onLimitBreakChange?: (slotId: number, count: number) => void;
  isAce?: boolean;
  isMain?: boolean; // メインカードかサブカードかを判定
  onDragStart?: (slotId: number) => void;
  onDragEnd?: () => void;
  onDrop?: (slotId: number) => void;
  isDragging?: boolean;
  isDroppable?: boolean;
  limitBreakCount?: number;
  showLimitBreak?: boolean;
  isPortrait?: boolean;
}

export const DeckSlot: React.FC<DeckSlotProps> = ({ 
  slot, 
  onSlotClick,
  onRemoveCard,
  onToggleAce,
  onShowDetail,
  onLimitBreakChange,
  isAce = false,
  isMain = false,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging = false,
  isDroppable = false,
  limitBreakCount = 14,
  showLimitBreak = false,
  isPortrait = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSpHoverActive, setIsSpHoverActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSp } = useResponsiveDevice();

  const shouldShowHoverActions = isHovered || (isSp && isSpHoverActive);

  // キャラクターカラーを取得（画像枠線用）
  const characterColor = getCharacterColor(slot.characterName);

  const containerClass = isPortrait
    ? `relative w-full aspect-[5/7] ${isMain ? 'border-2' : 'border'} border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors bg-white`
    : isMain
    ? `relative w-full aspect-[16/9] border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors bg-white`
    : `relative w-full aspect-[16/9] border border-gray-300 rounded overflow-hidden hover:border-blue-500 transition-colors bg-white`;

  const handleRemoveClick = (e: React.MouseEvent): void => {
    e.stopPropagation(); // スロットのクリックイベントを防ぐ
    if (onRemoveCard && slot.card) {
      onRemoveCard(slot.slotId);
    }
  };

  const handleDetailClick = (e: React.MouseEvent): void => {
    e.stopPropagation(); // スロットのクリックイベントを防ぐ
    if (onShowDetail && slot.card) {
      onShowDetail(slot.card.id);
    }
  };

  const handleSlotClick = (): void => {
    if (isSp && slot.card && !isSpHoverActive) {
      setIsSpHoverActive(true);
      return;
    }
    if (isSp) {
      setIsSpHoverActive(false);
    }
    onSlotClick(slot.slotId);
  };

  const handleLimitIncrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (onLimitBreakChange && limitBreakCount < 14) {
      onLimitBreakChange(slot.slotId, limitBreakCount + 1);
    }
  };

  const handleLimitDecrease = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (onLimitBreakChange && limitBreakCount > 1) {
      onLimitBreakChange(slot.slotId, limitBreakCount - 1);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    if (slot.card && onDragStart) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', slot.slotId.toString());
      onDragStart(slot.slotId);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    if (isDroppable) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (isDroppable && onDrop) {
      onDrop(slot.slotId);
    }
  };

  useEffect(() => {
    if (!isSp || !isSpHoverActive) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent): void => {
      if (!containerRef.current) return;
      const target = event.target as Node | null;
      if (target && !containerRef.current.contains(target)) {
        setIsSpHoverActive(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isSp, isSpHoverActive]);

  // ドラッグ中の透明度とドロップ可能時のハイライト
  const dragClass = isDragging ? 'opacity-50' : '';
  const dropClass = isDroppable 
    ? 'ring-4 ring-green-400 ring-offset-2 bg-green-50' 
    : '';
  const actionContainerClass = isSp ? 'flex-col gap-2' : 'flex-row gap-1';
  const actionButtonClass = isSp ? 'p-2' : 'p-1';
  const actionIconClass = isSp ? 'w-3 h-3' : 'w-3 h-3 sm:w-4 sm:h-4';

  const renderActionButton = (type: 'detail' | 'remove'): JSX.Element | null => {
    if (type === 'detail') {
      if (!onShowDetail) return null;
      return (
        <button
          key="detail"
          onClick={handleDetailClick}
          className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full ${actionButtonClass} transition-colors shadow-lg`}
          aria-label="カード詳細を表示"
        >
          <svg
            className={actionIconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      );
    }

    if (!onRemoveCard) return null;
    return (
      <button
        key="remove"
        onClick={handleRemoveClick}
        className={`bg-red-500 hover:bg-red-600 text-white rounded-full ${actionButtonClass} transition-colors shadow-lg`}
        aria-label="カードを削除"
      >
        <svg
          className={actionIconClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      draggable={!!slot.card}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleSlotClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${containerClass} ${dragClass} ${dropClass} cursor-pointer`}
    >
      {slot.card ? (
        <div className="w-full h-full relative">
          {/* 上部の表示エリア: 上限解放表示 or バッジ群 */}
          <div className="absolute top-1 left-1 z-20 flex items-center gap-1 pointer-events-none">
            {showLimitBreak ? (
              <LimitBreakBadge
                value={limitBreakCount}
                isMain={isMain}
                showControls={shouldShowHoverActions}
                onIncrease={handleLimitIncrease}
                onDecrease={handleLimitDecrease}
                min={1}
                max={14}
              />
            ) : (
              <>
                {slot.card.detail?.skill?.ap && (
                  <ApBadge 
                    ap={slot.card.detail.skill.ap}
                    favoriteMode={slot.card.detail.favoriteMode}
                    size={isMain ? 'large' : 'small'}
                  />
                )}
                <RarityBadge 
                  rarity={slot.card.rarity}
                  size={isMain ? 'large' : 'small'}
                />
              </>
            )}
          </div>

          {/* エースバッジ（ホバー時 or エース設定済みの場合のみ表示、フレンドカードは除外） */}
          {slot.slotId !== 99 && (shouldShowHoverActions || isAce) && (
            <AceBadge
              isAce={isAce}
              onToggle={() => onToggleAce?.(slot.slotId)}
              disabled={!slot.card}
              size={isMain ? 'large' : 'small'}
            />
          )}
          
          {/* ホバー時のボタングループ */}
          {shouldShowHoverActions && !(isSp && showLimitBreak) && (
            <div className={`absolute top-1 right-1 z-10 flex ${actionContainerClass}`}>
              {(
                isSp ? ['remove', 'detail'] : ['detail', 'remove']
              )
                .map((type) => renderActionButton(type as 'detail' | 'remove'))
                .filter(Boolean)}
            </div>
          )}
          
          {!imageError && slot.card.detail?.awakeAfterStorageUrl ? (
            <div
              className="relative w-full h-full border-2 overflow-hidden"
              style={{ borderColor: characterColor }}
            >
              <img
                src={slot.card.detail.awakeAfterStorageUrl}
                alt={slot.card.cardName}
                className={
                  isPortrait
                    ? 'absolute left-1/2 top-1/2 h-full w-auto max-w-none max-h-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover'
                    : 'w-full h-full object-cover object-center'
                }
                onError={() => setImageError(true)}
                draggable={false}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <div className="text-center text-gray-500">
                <svg
                  className={`${isMain ? 'w-12 h-12' : 'w-6 h-6'} mx-auto mb-1`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className={`${isMain ? 'text-xs' : 'text-[10px]'}`}>画像なし</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
            <p className={`text-white ${isMain ? 'text-xs' : 'text-[10px]'} font-medium truncate`}>
              {slot.card.cardName}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg
            className={`${isMain ? 'w-8 h-8' : 'w-4 h-4'} mb-1`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className={`${isMain ? 'text-xs' : 'text-[10px]'} font-medium`}>
            {isMain ? slot.characterName : 'SIDE'}
          </p>
        </div>
      )}
    </div>
  );
};
