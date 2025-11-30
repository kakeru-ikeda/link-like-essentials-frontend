'use client';

import React, { useState } from 'react';
import { DeckSlot as DeckSlotType } from '@/models/Deck';
import { Card } from '@/models/Card';
import { getCharacterColor } from '@/constants/characters';
import { ApBadge } from '@/components/common/ApBadge';
import { RarityBadge } from '@/components/common/RarityBadge';
import { AceBadge } from '@/components/common/AceBadge';

interface DeckSlotProps {
  slot: DeckSlotType;
  onSlotClick: (slotId: number) => void;
  onRemoveCard?: (slotId: number) => void;
  onToggleAce?: (slotId: number) => void;
  onShowDetail?: (card: Card) => void;
  isAce?: boolean;
  isMain?: boolean; // メインカードかサブカードかを判定
}

export const DeckSlot: React.FC<DeckSlotProps> = ({ 
  slot, 
  onSlotClick,
  onRemoveCard,
  onToggleAce,
  onShowDetail,
  isAce = false,
  isMain = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // キャラクターカラーを取得（画像枠線用）
  const characterColor = getCharacterColor(slot.characterName);

  const aspectRatio = 'aspect-[16/9]';
  const containerClass = isMain 
    ? `relative w-full ${aspectRatio} border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors bg-white`
    : `relative w-full ${aspectRatio} border border-gray-300 rounded overflow-hidden hover:border-blue-500 transition-colors bg-white`;

  const handleRemoveClick = (e: React.MouseEvent): void => {
    e.stopPropagation(); // スロットのクリックイベントを防ぐ
    if (onRemoveCard && slot.card) {
      onRemoveCard(slot.slotId);
    }
  };

  const handleDetailClick = (e: React.MouseEvent): void => {
    e.stopPropagation(); // スロットのクリックイベントを防ぐ
    if (onShowDetail && slot.card) {
      onShowDetail(slot.card);
    }
  };

  const handleSlotClick = (): void => {
    onSlotClick(slot.slotId);
  };

  return (
    <div
      onClick={handleSlotClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${containerClass} cursor-pointer`}
    >
      {slot.card ? (
        <div className="w-full h-full relative">
          {/* AP表示 */}
          {slot.card.detail?.skill?.ap && (
            <ApBadge 
              ap={slot.card.detail.skill.ap}
              favoriteMode={slot.card.detail.favoriteMode}
              size={isMain ? 'large' : 'small'}
            />
          )}

          {/* レアリティ表示 */}
          <RarityBadge 
            rarity={slot.card.rarity}
            size={isMain ? 'large' : 'small'}
          />

          {/* エースバッジ（ホバー時 or エース設定済みの場合のみ表示） */}
          {(isHovered || isAce) && (
            <AceBadge
              isAce={isAce}
              onToggle={() => onToggleAce?.(slot.slotId)}
              disabled={!slot.card}
              size={isMain ? 'large' : 'small'}
            />
          )}
          
          {/* ホバー時のボタングループ */}
          {isHovered && (
            <div className="absolute top-1 right-1 z-10 flex gap-1">
              {/* 詳細ボタン */}
              {onShowDetail && (
                <button
                  onClick={handleDetailClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors shadow-lg"
                  aria-label="カード詳細を表示"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
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
              )}
              {/* 削除ボタン */}
              {onRemoveCard && (
                <button
                  onClick={handleRemoveClick}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-lg"
                  aria-label="カードを削除"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
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
              )}
            </div>
          )}
          
          {!imageError && slot.card.detail?.awakeAfterStorageUrl ? (
            <div 
              className="w-full h-full border-2"
              style={{ borderColor: characterColor }}
            >
              <img
                src={slot.card.detail.awakeAfterStorageUrl}
                alt={slot.card.cardName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
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
