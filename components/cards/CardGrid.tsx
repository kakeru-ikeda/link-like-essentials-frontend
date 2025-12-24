'use client';

import React, { useState } from 'react';
import { Card } from '@/models/Card';
import { getCharacterColor } from '@/constants/characters';

interface CardGridProps {
  cards: Card[];
  loading: boolean;
  onSelectCard: (card: Card) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, loading, onSelectCard }) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (cardId: string): void => {
    setImageErrors((prev) => new Set(prev).add(cardId));
  };

  const handleCardClick = (card: Card): void => {
    onSelectCard(card);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 text-lg">カードが見つかりませんでした</p>
          <p className="text-gray-400 text-sm mt-2">フィルター条件を変更してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const characterColor = getCharacterColor(card.characterName);
        return (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border-4"
            style={{ borderColor: characterColor }}
          >
            {/* カード画像 */}
            <div className="relative aspect-video bg-gray-100">
            {!imageErrors.has(card.id) && card.detail?.awakeAfterStorageUrl ? (
              <img
                src={card.detail.awakeAfterStorageUrl}
                alt={card.cardName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={() => handleImageError(card.id)}
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

        {/* ホバー時のオーバーレイ */}
        <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 pointer-events-none" />
      </button>
    );
  })}
    </div>
  );
};
