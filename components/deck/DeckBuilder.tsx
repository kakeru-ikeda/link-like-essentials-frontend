'use client';

import React from 'react';
import { useDeck } from '@/hooks/useDeck';
import { DeckSlot } from '@/components/deck/DeckSlot';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';
import { CHARACTERS } from '@/constants/characters';
import {
  getCharacterColor,
  getCharacterBackgroundColor,
} from '@/constants/characterColors';

interface DeckBuilderProps {
  onSlotClick: (slotId: number) => void;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ onSlotClick }) => {
  const { deck, removeCard, toggleAceCard } = useDeck();

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
    <div className="w-full max-w-4xl h-full flex items-center py-2">
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 auto-rows-fr">{characterGroups.map(({ character, slots }) => {
          const backgroundColor = getCharacterBackgroundColor(character, 0.25);
          
          return (
            <div 
              key={character} 
              className="flex flex-col space-y-0.5 sm:space-y-1 md:space-y-1.5 p-2 sm:p-3 rounded-lg backdrop-blur-sm"
              style={{
                backgroundColor: backgroundColor,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
            {/* キャラクター名 */}
            <div className="text-center mb-0.5">
              <h3 className="text-[10px] sm:text-xs font-bold text-gray-700">{character}</h3>
            </div>
            
            {/* メインカード (最初のスロット) */}
            {slots[0] && (
              <DeckSlot
                slot={slots[0]}
                onSlotClick={onSlotClick}
                onRemoveCard={removeCard}
                onToggleAce={toggleAceCard}
                isAce={deck.aceSlotId === slots[0].slotId}
                isMain={true}
              />
            )}
            
            {/* サブカード (2枚目と3枚目のスロット) */}
            <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
              {slots[1] && (
                <DeckSlot
                  slot={slots[1]}
                  onSlotClick={onSlotClick}
                  onRemoveCard={removeCard}
                  onToggleAce={toggleAceCard}
                  isAce={deck.aceSlotId === slots[1].slotId}
                  isMain={false}
                />
              )}
              {slots[2] && (
                <DeckSlot
                  slot={slots[2]}
                  onSlotClick={onSlotClick}
                  onRemoveCard={removeCard}
                  onToggleAce={toggleAceCard}
                  isAce={deck.aceSlotId === slots[2].slotId}
                  isMain={false}
                />
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
