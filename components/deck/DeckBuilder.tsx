'use client';

import React, { useState } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { DeckSlot } from '@/components/deck/DeckSlot';
import { DECK_SLOT_MAPPING_105 } from '@/constants/deckConfig';
import { DECK_FRAME_105, getCharacterBackgroundColor } from '@/constants/characters';
import { canPlaceCardInSlot } from '@/constants/deckRules';
import { SideModal } from '@/components/common/SideModal';
import { CardList } from '@/components/deck/CardList';
import { CurrentCardDisplay } from '@/components/deck/CurrentCardDisplay';
import { InProgressCardDisplay } from '@/components/deck/InProgressCardDisplay';
import { CardDetailView } from '@/components/deck/CardDetailView';
import { CardFilter } from '@/components/deck/CardFilter';
import { FilterButton } from '@/components/deck/FilterButton';
import { ActiveFilters } from '@/components/deck/ActiveFilters';
import { useCards } from '@/hooks/useCards';
import { useCardStore } from '@/store/cardStore';
import { useSideModal } from '@/hooks/useSideModal';
import { useFilter } from '@/hooks/useFilter';
import type { Card } from '@/models/Card';
import { filterCardsBySlot, getAssignedCardsForSlot } from '@/services/deckFilterService';
import { filterAvailableCards } from '@/services/characterFilterService';

export const DeckBuilder: React.FC = () => {
  const { deck, removeCard, toggleAceCard, swapCards, addCard } = useDeck();
  const [draggingSlotId, setDraggingSlotId] = useState<number | null>(null);

  const sideModal = useSideModal();
  const { setActiveFilter } = useCardStore((state) => ({
    setActiveFilter: state.setActiveFilter,
  }));

  const { filter, updateFilter, setFilter, resetFilter, clearFilterKey, countActiveFilters } = useFilter();

  React.useEffect(() => {
    setActiveFilter(filter);
  }, [filter, setActiveFilter]);

  const handleDragStart = (slotId: number): void => {
    const slot = deck?.slots.find((s) => s.slotId === slotId);
    if (slot?.card) {
      setDraggingSlotId(slotId);
    }
  };

  const handleDragEnd = (): void => setDraggingSlotId(null);

  const handleDrop = (targetSlotId: number): void => {
    if (draggingSlotId !== null && draggingSlotId !== targetSlotId) swapCards(draggingSlotId, targetSlotId);
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
    const result = canPlaceCardInSlot(
      { characterName: draggingSlot.card.characterName, rarity: draggingSlot.card.rarity },
      targetSlotId
    );
    return result.allowed;
  };

  const { currentSlotCard, currentCharacterName, currentSlotType } = React.useMemo(() => {
    if (sideModal.currentSlotId === null || !deck) {
      return { 
        currentSlotCard: null,
        currentCharacterName: undefined,
        currentSlotType: undefined
      };
    }
    const slot = deck.slots.find((s) => s.slotId === sideModal.currentSlotId);
    const slotMapping = DECK_SLOT_MAPPING_105.find((m) => m.slotId === sideModal.currentSlotId);
    return { 
      currentSlotCard: slot?.card || null,
      currentCharacterName: slot?.characterName,
      currentSlotType: slotMapping?.slotType
    };
  }, [sideModal.currentSlotId, deck]);

  const assignedCardIds = React.useMemo(() => {
    if (!deck) return [];
    return deck.slots.filter((slot) => slot.slotId !== sideModal.currentSlotId && slot.card).map((slot) => slot.card!.id);
  }, [deck, sideModal.currentSlotId]);

  const assignedCards = React.useMemo(() => {
  if (!deck || sideModal.currentSlotId === null) return [];
  return getAssignedCardsForSlot(deck.slots, sideModal.currentSlotId);
}, [deck, sideModal.currentSlotId]);

  const filterForQuery = React.useMemo(() => {
    if (sideModal.currentSlotId === null) return undefined;
    return filter;
  }, [sideModal.currentSlotId, filter]);

  const { cards, loading } = useCards(filterForQuery, sideModal.currentSlotId === null);

  const filteredCards = React.useMemo(() => {
    if (sideModal.currentSlotId === null) return [];
    const availableCards = filterAvailableCards(cards, currentSlotCard?.id, assignedCardIds);
    return filterCardsBySlot(availableCards, sideModal.currentSlotId);
  }, [cards, currentSlotCard, assignedCardIds, sideModal.currentSlotId]);

  const handleSlotClick = (slotId: number): void => {
    sideModal.openCardSearch(slotId);
    // キャラクター名を除外して初期化
    const { characterNames, ...filterWithoutCharacter } = filter;
    setFilter(filterWithoutCharacter);
  };

  const handleSelectCard = (card: Card): void => {
    if (sideModal.currentSlotId !== null) {
      const assignedSlot = deck?.slots.find((slot) => slot.card?.id === card.id && slot.slotId !== sideModal.currentSlotId);
      if (assignedSlot) {
        swapCards(sideModal.currentSlotId, assignedSlot.slotId);
        sideModal.closeCardSearch();
      } else {
        const success = addCard(sideModal.currentSlotId, card);
        if (success) {
          sideModal.closeCardSearch();
        } else {
          const errorMessage = '編成できませんでした';
          alert(errorMessage);
        }
      }
    }
  };

  const handleRemoveCurrentCard = (): void => {
    if (sideModal.currentSlotId !== null) {
      removeCard(sideModal.currentSlotId);
      sideModal.closeCardSearch();
    }
  };

  const handleCloseModal = (): void => {
    sideModal.closeCardSearch();
  };

  const handleApplyAndCloseFilter = (): void => { 
    sideModal.closeFilter();
  };

  const handleKeywordChange = (value: string): void => {
    updateFilter({ keyword: value || undefined });
  };

  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">デッキを読み込んでいます...</p>
      </div>
    );
  }

  const characterGroups = DECK_FRAME_105.map((character) => {
    const slots = DECK_SLOT_MAPPING_105
      .filter((m) => m.characterName === character)
      .sort((a, b) => a.slotId - b.slotId)
      .map((mapping) => deck.slots.find((s) => s.slotId === mapping.slotId))
      .filter((slot) => slot !== undefined);
    return { character, slots };
  });

  return (
    <>
      <div className="w-full max-w-4xl h-full flex items-center py-2">
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 auto-rows-fr">{characterGroups.map(({ character, slots }) => {
            const backgroundColor = getCharacterBackgroundColor(character, 0.25);
            return (
              <div key={character} className="flex flex-col h-full gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-3 rounded-lg backdrop-blur-sm" style={{ backgroundColor, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}>
                <div className="text-center flex-shrink-0"><h3 className="text-[10px] sm:text-xs font-bold text-gray-700">{character}</h3></div>
                {slots[0] && (
                  <DeckSlot
                    slot={slots[0]}
                    onSlotClick={handleSlotClick}
                    onRemoveCard={removeCard}
                    onToggleAce={toggleAceCard}
                    onShowDetail={(id: string) => sideModal.openCardDetail(id)}
                    isAce={deck.aceSlotId === slots[0].slotId}
                    isMain={true}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    isDragging={draggingSlotId === slots[0].slotId}
                    isDroppable={draggingSlotId !== null && canDropToSlot(slots[0].slotId)}
                  />
                )}
                <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                  {slots[1] && (
                    <div className="flex-1 max-w-[55%]">
                      <DeckSlot 
                        slot={slots[1]} 
                        onSlotClick={handleSlotClick} 
                        onRemoveCard={removeCard} 
                        onToggleAce={toggleAceCard} 
                        onShowDetail={(id: string) => sideModal.openCardDetail(id)} 
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
                        onSlotClick={handleSlotClick} 
                        onRemoveCard={removeCard} 
                        onToggleAce={toggleAceCard} 
                        onShowDetail={(id: string) => sideModal.openCardDetail(id)} 
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

      {/* Card search modal */}
      <SideModal
        isOpen={sideModal.isCardSearchOpen}
        onClose={handleCloseModal}
        title={`${currentSlotType === 'main' ? 'メイン' : currentSlotType === 'side' ? 'サイド' : 'カードを選択'} - ${currentCharacterName || ''}`}
        width="md"
        keywordSearch={{
          value: filter.keyword || '',
          onChange: handleKeywordChange,
          placeholder: 'カード名やキャラクター名で検索...',
        }}
        headerActions={
          <div className="flex items-center gap-2">
            {countActiveFilters() > 0 && (
              <button onClick={resetFilter} className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium">リセット</button>
            )}
            <FilterButton activeCount={countActiveFilters()} onClick={() => sideModal.openFilter()} />
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <ActiveFilters filter={filter} clearFilterKey={clearFilterKey} />
          <div className="flex-1 overflow-y-auto">
            {currentSlotCard && currentCharacterName && (
              <CurrentCardDisplay card={currentSlotCard} characterName={currentCharacterName} onRemove={handleRemoveCurrentCard} />
            )}
            {assignedCards.length > 0 && (
              <InProgressCardDisplay cards={assignedCards} onSelectCard={handleSelectCard} />
            )}
            <CardList cards={filteredCards} loading={loading} onSelectCard={handleSelectCard} />
          </div>
        </div>
      </SideModal>

      {/* Filter modal */}
      <SideModal 
        isOpen={sideModal.isFilterOpen} 
        onClose={handleApplyAndCloseFilter} 
        title="絞り込み" 
        width="sm" 
        hideCloseButton={true} 
        zIndex={60} 
        headerActions={
          <div className="flex gap-2">
            <button 
              onClick={resetFilter} 
              className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium"
              >リセット
            </button>
            <button 
              onClick={handleApplyAndCloseFilter} 
              className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition font-medium"
              >閉じる
            </button>
          </div>
        }>
        <CardFilter 
          filter={filter}
          updateFilter={updateFilter}
          currentSlotId={sideModal.currentSlotId} 
          onApply={handleApplyAndCloseFilter} 
        />
      </SideModal>

      {/* Card detail modal */}
      <SideModal 
        isOpen={sideModal.isCardDetailOpen} 
        onClose={sideModal.closeCardDetail} 
        title="カード詳細" width="md"
      >
      {sideModal.selectedCardId && 
      <CardDetailView 
        cardId={sideModal.selectedCardId} 
      />}
      </SideModal>
    </>
  );
};
