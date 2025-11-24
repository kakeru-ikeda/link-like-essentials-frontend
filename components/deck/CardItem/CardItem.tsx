'use client';

import React from 'react';
import { Card } from '@/models/Card';

interface CardItemProps {
  card: Card;
  onSelect: (card: Card) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onSelect }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <button
      onClick={() => onSelect(card)}
      className="relative w-full aspect-[3/4] border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all bg-white"
    >
      {!imageError && card.detail?.awakeAfterStorageUrl ? (
        <img
          src={card.detail.awakeAfterStorageUrl}
          alt={card.cardName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-200">
          <div className="text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2"
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
            <p className="text-xs">画像なし</p>
          </div>
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-purple-600 rounded">
          {card.rarity}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="text-white text-sm font-medium truncate">
          {card.cardName}
        </p>
        <p className="text-white/80 text-xs">{card.characterName}</p>
      </div>
    </button>
  );
};
