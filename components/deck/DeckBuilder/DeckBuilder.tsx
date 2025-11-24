'use client';

import React from 'react';
import { useDeck } from '@/hooks/useDeck';
import { DeckSlot } from '../DeckSlot';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';

interface DeckBuilderProps {
  onSlotClick: (slotId: number) => void;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ onSlotClick }) => {
  const { deck } = useDeck();

  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">デッキを読み込んでいます...</p>
      </div>
    );
  }

  const rows = [
    DECK_SLOT_MAPPING.filter((m) => m.row === 0),
    DECK_SLOT_MAPPING.filter((m) => m.row === 1),
    DECK_SLOT_MAPPING.filter((m) => m.row === 2),
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">デッキ編成</h2>
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-2 sm:gap-4">
            {row.map((mapping) => {
              const slot = deck.slots.find((s) => s.slotId === mapping.slotId);
              if (!slot) return null;
              return (
                <DeckSlot
                  key={slot.slotId}
                  slot={slot}
                  onSlotClick={onSlotClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
