'use client';

import React from 'react';
import { Card } from '@/models/Card';

interface CardItemProps {
  card: Card;
  onSelect: (card: Card) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(card)}
      className="relative w-full aspect-[3/4] border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all bg-white"
    >
      <img
        src={card.cardUrl || '/placeholder-card.png'}
        alt={card.cardName}
        className="w-full h-full object-cover"
      />
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
