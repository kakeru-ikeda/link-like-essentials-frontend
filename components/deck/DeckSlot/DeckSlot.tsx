'use client';

import React, { useState } from 'react';
import { DeckSlot as DeckSlotType } from '@/models/Deck';
import { Card } from '@/models/Card';

interface DeckSlotProps {
  slot: DeckSlotType;
  onSlotClick: (slotId: number) => void;
  isMain?: boolean; // メインカードかサブカードかを判定
}

export const DeckSlot: React.FC<DeckSlotProps> = ({ 
  slot, 
  onSlotClick,
  isMain = false 
}) => {
  const [imageError, setImageError] = useState(false);

  // 横長のアスペクト比に変更
  const aspectRatio = isMain ? 'aspect-[16/10]' : 'aspect-[16/10]';
  const containerClass = isMain 
    ? `relative w-full ${aspectRatio} border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors bg-gray-50`
    : `relative w-full ${aspectRatio} border border-gray-300 rounded overflow-hidden hover:border-blue-500 transition-colors bg-gray-50`;

  return (
    <button
      onClick={() => onSlotClick(slot.slotId)}
      className={containerClass}
    >
      {slot.card ? (
        <div className="w-full h-full">
          {!imageError && slot.card.detail?.awakeAfterStorageUrl ? (
            <img
              src={slot.card.detail.awakeAfterStorageUrl}
              alt={slot.card.cardName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
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
    </button>
  );
};
