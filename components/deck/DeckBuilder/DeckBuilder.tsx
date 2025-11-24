'use client';

import React from 'react';
import { useDeck } from '@/hooks/useDeck';
import { DeckSlot } from '../DeckSlot';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';
import { CHARACTERS } from '@/constants/characters';

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

  // キャラクターごとにスロットをグループ化
  const characterGroups = CHARACTERS.map((character) => {
    const slots = DECK_SLOT_MAPPING
      .filter((m) => m.characterName === character)
      .sort((a, b) => a.slotId - b.slotId)
      .map((mapping) => deck.slots.find((s) => s.slotId === mapping.slotId))
      .filter((slot) => slot !== undefined);
    
    return {
      character,
      slots,
    };
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">デッキ編成</h2>
      <div className="grid grid-cols-3 gap-6 sm:gap-8">
        {characterGroups.map(({ character, slots }) => (
          <div key={character} className="flex flex-col space-y-2">
            {/* キャラクター名 */}
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold text-gray-700">{character}</h3>
            </div>
            
            {/* メインカード (最初のスロット) */}
            {slots[0] && (
              <DeckSlot
                slot={slots[0]}
                onSlotClick={onSlotClick}
                isMain={true}
              />
            )}
            
            {/* サブカード (2枚目と3枚目のスロット) */}
            <div className="grid grid-cols-2 gap-2">
              {slots[1] && (
                <DeckSlot
                  slot={slots[1]}
                  onSlotClick={onSlotClick}
                  isMain={false}
                />
              )}
              {slots[2] && (
                <DeckSlot
                  slot={slots[2]}
                  onSlotClick={onSlotClick}
                  isMain={false}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
