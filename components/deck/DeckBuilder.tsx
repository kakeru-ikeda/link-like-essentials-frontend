"use client";

import React, { useState } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { DeckSlot } from '@/components/deck/DeckSlot';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';
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
import { useModal } from '@/hooks/useModal';
import type { Card } from '@/models/Card';
import type { CardFilter as CardFilterType } from '@/models/Filter';
import { filterCardsBySlot } from '@/services/deckFilterService';

export const DeckBuilder: React.FC = () => {
  const { deck, removeCard, toggleAceCard, swapCards, addCard } = useDeck();
  const [draggingSlotId, setDraggingSlotId] = useState<number | null>(null);

  const modal = useModal();
  const { setActiveFilter, savedFilter, setSavedFilter } = useCardStore((state) => ({
    setActiveFilter: state.setActiveFilter,
    savedFilter: state.savedFilter,
    setSavedFilter: state.setSavedFilter,
  }));

  const [cardFilter, setCardFilter] = useState<CardFilterType>({});

  React.useEffect(() => {
    setActiveFilter(cardFilter);
  }, [cardFilter, setActiveFilter]);

  const handleDragStart = (slotId: number): void => {
    const slot = deck?.slots.find((s) => s.slotId === slotId);
    if (slot?.card) setDraggingSlotId(slotId);
  };

  const handleDragEnd = (): void => setDraggingSlotId(null);

  const handleDrop = (targetSlotId: number): void => {
    if (draggingSlotId !== null && draggingSlotId !== targetSlotId) swapCards(draggingSlotId, targetSlotId);
    setDraggingSlotId(null);
  };

  const canDropToSlot = (targetSlotId: number): boolean => {
    if (draggingSlotId === null || draggingSlotId === targetSlotId) return false;
    const draggingSlot = deck?.slots.find((s) => s.slotId === draggingSlotId);
    if (!draggingSlot?.card) return false;
    const result = canPlaceCardInSlot(
      { characterName: draggingSlot.card.characterName, rarity: draggingSlot.card.rarity },
      targetSlotId
    );
    return result.allowed;
  };

  const { currentSlotCard, currentCharacterName, currentSlotType } = React.useMemo(() => {
    if (modal.currentSlotId === null || !deck) return { currentSlotCard: null, currentCharacterName: undefined, currentSlotType: undefined };
    const slot = deck.slots.find((s) => s.slotId === modal.currentSlotId);
    const slotMapping = DECK_SLOT_MAPPING.find((m) => m.slotId === modal.currentSlotId);
    return { currentSlotCard: slot?.card || null, currentCharacterName: slot?.characterName, currentSlotType: slotMapping?.slotType };
  }, [modal.currentSlotId, deck]);

  const assignedCardIds = React.useMemo(() => {
    if (!deck) return [];
    return deck.slots.filter((slot) => slot.slotId !== modal.currentSlotId && slot.card).map((slot) => slot.card!.id);
  }, [deck, modal.currentSlotId]);

  const assignedCards = React.useMemo(() => {
    if (!deck || modal.currentSlotId === null) return [];
    return deck.slots
      .filter((slot) => slot.slotId !== modal.currentSlotId && slot.card)
      .map((slot) => slot.card!)
      .filter((card, index, self) => {
        if (self.findIndex((c) => c.id === card.id) !== index) return false;
        const validationResult = canPlaceCardInSlot({ characterName: card.characterName, rarity: card.rarity }, modal.currentSlotId!);
        return validationResult.allowed;
      });
  }, [deck, modal.currentSlotId]);

  const filterForQuery = React.useMemo(() => {
    if (modal.currentSlotId === null) return undefined;
    return cardFilter;
  }, [modal.currentSlotId, cardFilter]);

  const { cards, loading } = useCards(filterForQuery, modal.currentSlotId === null);

  const filteredCards = React.useMemo(() => {
    if (modal.currentSlotId === null) return [];
    const currentCardId = currentSlotCard?.id;
    const availableCards = cards.filter((card) => {
      if (currentCardId && card.id === currentCardId) return false;
      if (assignedCardIds.includes(card.id)) return false;
      return true;
    });
    return filterCardsBySlot(availableCards, modal.currentSlotId);
  }, [cards, currentSlotCard, assignedCardIds, modal.currentSlotId]);

  const handleSlotClick = (slotId: number): void => {
    modal.openCardSearch(slotId);
    const { characterNames, ...filterWithoutCharacter } = savedFilter || {};
    setCardFilter(filterWithoutCharacter);
  };

  const handleSelectCard = (card: Card): void => {
    if (modal.currentSlotId !== null) {
      const assignedSlot = deck?.slots.find((slot) => slot.card?.id === card.id && slot.slotId !== modal.currentSlotId);
      if (assignedSlot) {
        swapCards(modal.currentSlotId, assignedSlot.slotId);
        setSavedFilter(cardFilter);
        modal.closeCardSearch();
      } else {
        const success = addCard(modal.currentSlotId, card);
        if (success) {
          setSavedFilter(cardFilter);
          modal.closeCardSearch();
        } else {
          const errorMessage = '編成できませんでした';
          alert(errorMessage);
        }
      }
    }
  };

  const handleRemoveCurrentCard = (): void => {
    if (modal.currentSlotId !== null) {
      removeCard(modal.currentSlotId);
      setSavedFilter(cardFilter);
      modal.closeCardSearch();
    }
  };

  const handleCloseModal = (): void => {
    setSavedFilter(cardFilter);
    modal.closeCardSearch();
  };

  const handleFilterChange = (filter: CardFilterType): void => {
    setCardFilter(filter);
  };

  const handleResetFilters = (): void => { 
  setCardFilter({}); 
  setSavedFilter({}); 
  };

  const handleApplyAndCloseFilter = (): void => { 
  setSavedFilter(cardFilter); 
  modal.closeFilter(); 
  };

  const handleClearFilter = (key: keyof CardFilterType): void => {
    const newFilter = { ...cardFilter };
    delete newFilter[key];
    setCardFilter(newFilter);
    setSavedFilter(newFilter);
  };

  const countActiveFilters = (): number => {
    let count = 0;
    if (cardFilter.keyword) count++;
    if (cardFilter.rarities && cardFilter.rarities.length > 0) count += cardFilter.rarities.length;
    if (cardFilter.styleTypes && cardFilter.styleTypes.length > 0) count += cardFilter.styleTypes.length;
    if (cardFilter.limitedTypes && cardFilter.limitedTypes.length > 0) count += cardFilter.limitedTypes.length;
    if (cardFilter.favoriteModes && cardFilter.favoriteModes.length > 0) count += cardFilter.favoriteModes.length;
    if (cardFilter.characterNames && cardFilter.characterNames.length > 0) count += cardFilter.characterNames.length;
    if (cardFilter.skillEffects && cardFilter.skillEffects.length > 0) count += cardFilter.skillEffects.length;
    if (cardFilter.skillSearchTargets && cardFilter.skillSearchTargets.length > 0) count += cardFilter.skillSearchTargets.length;
    return count;
  };
  
  const handleClearAllFilters = (): void => { 
    setCardFilter({}); 
    setSavedFilter({});
  };

  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">デッキを読み込んでいます...</p>
      </div>
    );
  }

  const characterGroups = DECK_FRAME_105.map((character) => {
    const slots = DECK_SLOT_MAPPING
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
                    onShowDetail={(id: string) => modal.openCardDetail(id)}
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
                      <DeckSlot slot={slots[1]} onSlotClick={handleSlotClick} onRemoveCard={removeCard} onToggleAce={toggleAceCard} onShowDetail={(id: string) => modal.openCardDetail(id)} isAce={deck.aceSlotId === slots[1].slotId} isMain={false} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrop={handleDrop} isDragging={draggingSlotId === slots[1].slotId} isDroppable={draggingSlotId !== null && canDropToSlot(slots[1].slotId)} />
                    </div>
                  )}
                  {slots[2] && (
                    <div className="flex-1 max-w-[48%]">
                      <DeckSlot slot={slots[2]} onSlotClick={handleSlotClick} onRemoveCard={removeCard} onToggleAce={toggleAceCard} onShowDetail={(id: string) => modal.openCardDetail(id)} isAce={deck.aceSlotId === slots[2].slotId} isMain={false} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrop={handleDrop} isDragging={draggingSlotId === slots[2].slotId} isDroppable={draggingSlotId !== null && canDropToSlot(slots[2].slotId)} />
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
        isOpen={modal.isCardSearchOpen}
        onClose={handleCloseModal}
        title={`${currentSlotType === 'main' ? 'メイン' : currentSlotType === 'side' ? 'サイド' : 'カードを選択'} - ${currentCharacterName || ''}`}
        width="md"
        keywordSearch={{
          value: cardFilter.keyword || '',
          onChange: (value) => setCardFilter({ ...cardFilter, keyword: value || undefined }),
          placeholder: 'カード名やキャラクター名で検索...',
          storageKey: 'deck-card-search-keyword',
        }}
        headerActions={
          <div className="flex items-center gap-2">
            {countActiveFilters() > 0 && (
              <button onClick={handleClearAllFilters} className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium">リセット</button>
            )}
            <FilterButton activeCount={countActiveFilters()} onClick={() => modal.openFilter()} />
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <ActiveFilters filter={cardFilter} onClearFilter={handleClearFilter} />
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
      <SideModal isOpen={modal.isFilterOpen} onClose={modal.closeFilter} title="絞り込み" width="sm" hideCloseButton={true} zIndex={60} headerActions={<div className="flex gap-2"><button onClick={handleResetFilters} className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium">リセット</button><button onClick={handleApplyAndCloseFilter} className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition font-medium">フィルターを適用</button></div>}>
        <CardFilter currentFilter={cardFilter} currentSlotId={modal.currentSlotId} onFilterChange={handleFilterChange} onReset={handleResetFilters} onApply={handleApplyAndCloseFilter} />
      </SideModal>

      {/* Card detail modal */}
      <SideModal isOpen={modal.isCardDetailOpen} onClose={modal.closeCardDetail} title="カード詳細" width="md">
        {modal.selectedCardId && <CardDetailView cardId={modal.selectedCardId} />}
      </SideModal>
    </>
  );
};
