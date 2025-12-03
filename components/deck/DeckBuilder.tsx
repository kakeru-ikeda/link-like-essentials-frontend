'use client';

import React, { useState } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { DeckSlot } from '@/components/deck/DeckSlot';
import { CardDetailView } from '@/components/deck/CardDetailView';
import { SideModal } from '@/components/common/SideModal';
import { Card } from '@/models/Card';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';
import {
  DECK_FRAME_105,
  getCharacterColor,
  getCharacterBackgroundColor,
} from '@/constants/characters';
import { canPlaceCardInSlot } from '@/constants/deckRules';

interface DeckBuilderProps {
  onSlotClick: (slotId: number) => void;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ onSlotClick }) => {
  const { deck, removeCard, toggleAceCard, swapCards } = useDeck();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [draggingSlotId, setDraggingSlotId] = useState<number | null>(null);

  const handleShowDetail = (card: Card): void => {
    setSelectedCardId(card.id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = (): void => {
    setIsDetailModalOpen(false);
    setSelectedCardId(null);
  };

  const handleDragStart = (slotId: number): void => {
    const slot = deck?.slots.find((s) => s.slotId === slotId);
    // カードがあるスロットのみドラッグ可能
    if (slot?.card) {
      setDraggingSlotId(slotId);
    }
  };

  const handleDragEnd = (): void => {
    setDraggingSlotId(null);
  };

  const handleDrop = (targetSlotId: number): void => {
    if (draggingSlotId !== null && draggingSlotId !== targetSlotId) {
      // スワップを実行
      swapCards(draggingSlotId, targetSlotId);
    }
    setDraggingSlotId(null);
  };

  const canDropToSlot = (targetSlotId: number): boolean => {
    if (draggingSlotId === null || draggingSlotId === targetSlotId) {
      return false;
    }

    const draggingSlot = deck?.slots.find((s) => s.slotId === draggingSlotId);
    if (!draggingSlot?.card) {
      return false;
    }

    // ドラッグ中のカードがターゲットスロットに配置可能かチェック
    const result = canPlaceCardInSlot(
      {
        characterName: draggingSlot.card.characterName,
        rarity: draggingSlot.card.rarity,
      },
      targetSlotId
    );

    return result.allowed;
  };

  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">デッキを読み込んでいます...</p>
      </div>
    );
  }

  // キャラクターごとにスロットをグループ化
  const characterGroups = DECK_FRAME_105.map((character) => {
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
    <>
      <div className="w-full max-w-4xl h-full flex items-center py-2">
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 auto-rows-fr">{characterGroups.map(({ character, slots }) => {
            const backgroundColor = getCharacterBackgroundColor(character, 0.25);
            
            return (
              <div 
                key={character} 
                className="flex flex-col h-full gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-3 rounded-lg backdrop-blur-sm"
                style={{
                  backgroundColor: backgroundColor,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              >
              {/* キャラクター名 */}
              <div className="text-center flex-shrink-0">
                <h3 className="text-[10px] sm:text-xs font-bold text-gray-700">{character}</h3>
              </div>
              
              {/* メインカード (最初のスロット) */}
              {slots[0] && (
                <DeckSlot
                  slot={slots[0]}
                  onSlotClick={onSlotClick}
                  onRemoveCard={removeCard}
                  onToggleAce={toggleAceCard}
                  onShowDetail={handleShowDetail}
                  isAce={deck.aceSlotId === slots[0].slotId}
                  isMain={true}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  isDragging={draggingSlotId === slots[0].slotId}
                  isDroppable={draggingSlotId !== null && canDropToSlot(slots[0].slotId)}
                />
              )}
              
              {/* サブカード (2枚目と3枚目のスロット) */}
              <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                {slots[1] && (
                  <div className="flex-1 max-w-[55%]">
                    <DeckSlot
                      slot={slots[1]}
                      onSlotClick={onSlotClick}
                      onRemoveCard={removeCard}
                      onToggleAce={toggleAceCard}
                      onShowDetail={handleShowDetail}
                      isAce={deck.aceSlotId === slots[1].slotId}
                      isMain={false}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop}
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
                      onRemoveCard={removeCard}
                      onToggleAce={toggleAceCard}
                      onShowDetail={handleShowDetail}
                      isAce={deck.aceSlotId === slots[2].slotId}
                      isMain={false}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop}
                      isDragging={draggingSlotId === slots[2].slotId}
                      isDroppable={draggingSlotId !== null && canDropToSlot(slots[2].slotId)}
                    />
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* カード詳細モーダル */}
      <SideModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        title="カード詳細"
        width="md"
      >
        {selectedCardId && <CardDetailView cardId={selectedCardId} />}
      </SideModal>
    </>
  );
};
