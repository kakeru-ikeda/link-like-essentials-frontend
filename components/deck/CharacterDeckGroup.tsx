'use client';

import React from 'react';
import { DeckSlot } from '@/components/deck/DeckSlot';
import { DeckSlot as DeckSlotType } from '@/models/Deck';
import { getCharacterBackgroundColor } from '@/constants/characters';

interface CharacterDeckGroupProps {
  character: string;
  slots: DeckSlotType[];
  aceSlotId: number | null;
  draggingSlotId: number | null;
  onSlotClick: (slotId: number) => void;
  onRemoveCard: (slotId: number) => void;
  onToggleAce: (slotId: number) => void;
  onShowDetail: (cardId: string) => void;
  onDragStart: (slotId: number) => void;
  onDragEnd: () => void;
  onDrop: (slotId: number) => void;
  canDropToSlot: (slotId: number) => boolean;
}

export const CharacterDeckGroup: React.FC<CharacterDeckGroupProps> = React.memo(
  ({
    character,
    slots,
    aceSlotId,
    draggingSlotId,
    onSlotClick,
    onRemoveCard,
    onToggleAce,
    onShowDetail,
    onDragStart,
    onDragEnd,
    onDrop,
    canDropToSlot,
  }) => {
    const backgroundColor = getCharacterBackgroundColor(character, 0.5);

    return (
      <div
        className="flex flex-col h-full gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-3 rounded-lg backdrop-blur-sm"
        style={{
          backgroundColor,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        }}
      >
        {/* Character name header */}
        <div className="text-center flex-shrink-0">
          <h3 className="text-[10px] sm:text-xs font-bold text-gray-700">{character}</h3>
        </div>

        {/* Main slot */}
        {slots[0] && (
          <DeckSlot
            slot={slots[0]}
            onSlotClick={onSlotClick}
            onRemoveCard={onRemoveCard}
            onToggleAce={onToggleAce}
            onShowDetail={onShowDetail}
            isAce={aceSlotId === slots[0].slotId}
            isMain={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
            isDragging={draggingSlotId === slots[0].slotId}
            isDroppable={draggingSlotId !== null && canDropToSlot(slots[0].slotId)}
          />
        )}

        {/* Sub slots (2 cards side by side) */}
        <div className="flex gap-1 sm:gap-1.5 md:gap-2">
          {slots[1] && (
            <div className="flex-1 max-w-[55%]">
              <DeckSlot
                slot={slots[1]}
                onSlotClick={onSlotClick}
                onRemoveCard={onRemoveCard}
                onToggleAce={onToggleAce}
                onShowDetail={onShowDetail}
                isAce={aceSlotId === slots[1].slotId}
                isMain={false}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                isDragging={draggingSlotId === slots[1].slotId}
                isDroppable={draggingSlotId !== null && canDropToSlot(slots[1].slotId)}
              />
            </div>
          )}
          {slots[2] && (
            <div className="flex-1 max-w-[48%]">
              <DeckSlot
                slot={slots[2]}
                onSlotClick={onSlotClick}
                onRemoveCard={onRemoveCard}
                onToggleAce={onToggleAce}
                onShowDetail={onShowDetail}
                isAce={aceSlotId === slots[2].slotId}
                isMain={false}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                isDragging={draggingSlotId === slots[2].slotId}
                isDroppable={draggingSlotId !== null && canDropToSlot(slots[2].slotId)}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.character !== nextProps.character) return false;
    if (prevProps.aceSlotId !== nextProps.aceSlotId) return false;
    if (prevProps.draggingSlotId !== nextProps.draggingSlotId) return false;

    // slots配列の各slotを比較（カードの有無、slotId、characterName）
    if (prevProps.slots.length !== nextProps.slots.length) return false;
    for (let i = 0; i < prevProps.slots.length; i++) {
      const prevSlot = prevProps.slots[i];
      const nextSlot = nextProps.slots[i];

      if (prevSlot.slotId !== nextSlot.slotId) return false;
      if (prevSlot.characterName !== nextSlot.characterName) return false;

      // カードの有無が変わった場合
      if ((prevSlot.card === null) !== (nextSlot.card === null)) return false;

      // 両方にカードがある場合、IDを比較
      if (prevSlot.card && nextSlot.card) {
        if (prevSlot.card.id !== nextSlot.card.id) return false;
      }
    }

    return true;
  }
);

CharacterDeckGroup.displayName = 'CharacterDeckGroup';
