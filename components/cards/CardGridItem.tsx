'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { getCharacterColor } from '@/constants/characters';

interface CardGridItemProps {
  card: Card;
  onClick: (card: Card) => void;
}

export const CardGridItem: React.FC<CardGridItemProps> = ({
  card,
  onClick,
}) => {
  const characterColor = getCharacterColor(card.characterName);

  return (
    <button
      onClick={() => onClick(card)}
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border-4"
      style={{ borderColor: characterColor }}
      aria-label={`カード: ${card.cardName}`}
    >
      {/* カード画像 */}
      <div className="relative aspect-video bg-gray-100">
        {card.detail?.awakeAfterStorageUrl ? (
          <img
            src={card.detail.awakeAfterStorageUrl}
            alt={card.cardName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-12 h-12 text-gray-300"
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
          </div>
        )}

        {/* ホバー時のカード情報オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
          <p className="text-xs font-bold text-white line-clamp-2 mb-1">
            {card.cardName}
          </p>
          <p className="text-xs text-white/90">{card.characterName}</p>
        </div>
      </div>
    </button>
  );
};
