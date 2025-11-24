'use client';

import React, { useState } from 'react';
import { DeckSlot as DeckSlotType } from '@/models/Deck';
import { Card } from '@/models/Card';

interface DeckSlotProps {
  slot: DeckSlotType;
  onSlotClick: (slotId: number) => void;
}

export const DeckSlot: React.FC<DeckSlotProps> = ({ slot, onSlotClick }) => {
  return (
    <button
      onClick={() => onSlotClick(slot.slotId)}
      className="relative w-full aspect-[3/4] border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors bg-gray-50"
    >
      {slot.card ? (
        <div className="w-full h-full">
          <img
            src={slot.card.cardUrl || '/placeholder-card.png'}
            alt={slot.card.cardName}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-white text-xs font-medium truncate">
              {slot.card.cardName}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg
            className="w-8 h-8 mb-2"
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
          <p className="text-xs font-medium">{slot.characterName}</p>
        </div>
      )}
    </button>
  );
};
