'use client';

import React, { useState, useCallback } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { Checkbox } from '@/components/common/Checkbox';
import { CharacterDeckGroup } from '@/components/deck/CharacterDeckGroup';
import { getDeckSlotMapping, getDeckFrame } from '@/services/deckConfigService';
import type { CharacterName } from '@/config/characters';
import type { DeckSlotMapping } from '@/config/deckSlots';
import { canPlaceCardInSlot } from '@/services/deckRulesService';
import { SideModal } from '@/components/common/SideModal';
import { CardList } from '@/components/deck/CardList';
import { CurrentCardDisplay } from '@/components/deck/CurrentCardDisplay';
import { InProgressCardDisplay } from '@/components/deck/InProgressCardDisplay';
import { CardDetailView } from '@/components/deck/CardDetailView';
import { CardFilter } from '@/components/common/CardFilter';
import { FilterButton } from '@/components/common/FilterButton';
import { ActiveFilters } from '@/components/common/ActiveFilters';
import { useCards } from '@/hooks/useCards';
import { useCardStore } from '@/store/cardStore';
import { useSideModal } from '@/hooks/useSideModal';
import { useFilter } from '@/hooks/useFilter';
import type { Card } from '@/models/Card';
import type { DeckSlot } from '@/models/Deck';
import {
  filterCardsBySlot,
  getAssignedCardsForSlot,
} from '@/services/deckFilterService';
import { filterAvailableCards } from '@/services/characterFilterService';

export const DeckBuilder: React.FC = () => {
  const { deck, removeCard, toggleAceCard, swapCards, addCard, updateLimitBreakCount, isFriendSlotEnabled, setFriendSlotEnabled } = useDeck();
  const [draggingSlotId, setDraggingSlotId] = useState<number | null>(null);
  const [showLimitBreak, setShowLimitBreak] = useState<boolean>(false);

  const sideModal = useSideModal();
  const { setActiveFilter } = useCardStore((state) => ({
    setActiveFilter: state.setActiveFilter,
  }));

  const {
    filter,
    updateFilter,
    setFilter,
    resetFilter,
    clearFilterKey,
    countActiveFilters,
  } = useFilter();

  const deckSlots = deck?.slots ?? [];

  React.useEffect(() => {
    setActiveFilter(filter);
  }, [filter, setActiveFilter]);

  const handleDragStart = useCallback(
    (slotId: number): void => {
      const slot = deck?.slots.find((s) => s.slotId === slotId);
      if (slot?.card) {
        setDraggingSlotId(slotId);
      }
    },
    [deck?.slots]
  );

  const handleDragEnd = useCallback((): void => setDraggingSlotId(null), []);

  const handleDrop = useCallback(
    (targetSlotId: number): void => {
      if (draggingSlotId !== null && draggingSlotId !== targetSlotId)
        swapCards(draggingSlotId, targetSlotId);
      setDraggingSlotId(null);
    },
    [draggingSlotId, swapCards]
  );

  const canDropToSlot = useCallback(
    (targetSlotId: number): boolean => {
      if (draggingSlotId === null || draggingSlotId === targetSlotId) {
        return false;
      }
      const draggingSlot = deck?.slots.find((s) => s.slotId === draggingSlotId);
      if (!draggingSlot?.card) {
        return false;
      }
      const result = canPlaceCardInSlot(
        {
          characterName: draggingSlot.card.characterName,
          rarity: draggingSlot.card.rarity,
        },
        targetSlotId,
        deck?.deckType
      );
      return result.allowed;
    },
    [draggingSlotId, deck?.slots, deck?.deckType]
  );

  const { currentSlotCard, currentCharacterName, currentSlotType } =
    React.useMemo(() => {
      if (sideModal.currentSlotId === null || !deck) {
        return {
          currentSlotCard: null,
          currentCharacterName: undefined,
          currentSlotType: undefined,
        };
      }
      const slot = deck.slots.find((s) => s.slotId === sideModal.currentSlotId);
      const mapping = getDeckSlotMapping(deck.deckType);
      const slotMapping = mapping.find(
        (m) => m.slotId === sideModal.currentSlotId
      );
      return {
        currentSlotCard: slot?.card || null,
        currentCharacterName: slot?.characterName,
        currentSlotType: slotMapping?.slotType,
      };
    }, [sideModal.currentSlotId, deck]);

  const assignedCardIds = React.useMemo(() => {
    return deckSlots
      .filter((slot) => slot.slotId !== sideModal.currentSlotId && slot.card)
      .map((slot) => slot.card!.id);
  }, [deckSlots, sideModal.currentSlotId]);

  const assignedCards = React.useMemo(() => {
    if (sideModal.currentSlotId === null) return [];
    return getAssignedCardsForSlot(
      deckSlots,
      sideModal.currentSlotId,
      deck?.deckType
    );
  }, [deckSlots, sideModal.currentSlotId, deck?.deckType]);

  const filterForQuery = React.useMemo(() => {
    if (sideModal.currentSlotId === null) return undefined;
    return filter;
  }, [sideModal.currentSlotId, filter]);

  const { cards, loading } = useCards(
    filterForQuery,
    sideModal.currentSlotId === null
  );

  const filteredCards = React.useMemo(() => {
    if (sideModal.currentSlotId === null) return [];
    const availableCards = filterAvailableCards(
      cards,
      currentSlotCard?.id,
      assignedCardIds
    );
    return filterCardsBySlot(
      availableCards,
      sideModal.currentSlotId,
      deck?.deckType
    );
  }, [
    cards,
    currentSlotCard,
    assignedCardIds,
    sideModal.currentSlotId,
    deck?.deckType,
  ]);

  const handleSlotClick = useCallback(
    (slotId: number): void => {
      sideModal.openCardSearch(slotId);
      // キャラクター名を除外して初期化
      const { characterNames, ...filterWithoutCharacter } = filter;
      setFilter(filterWithoutCharacter);
    },
    [sideModal, filter, setFilter]
  );

  const handleShowDetail = useCallback(
    (cardId: string): void => {
      sideModal.openCardDetail(cardId);
    },
    [sideModal]
  );

  const handleSelectCard = useCallback(
    (card: Card): void => {
      if (sideModal.currentSlotId !== null) {
        const assignedSlot = deck?.slots.find(
          (slot) =>
            slot.card?.id === card.id && slot.slotId !== sideModal.currentSlotId
        );
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
    },
    [sideModal, deck?.slots, swapCards, addCard]
  );

  const handleRemoveCurrentCard = useCallback((): void => {
    if (sideModal.currentSlotId !== null) {
      removeCard(sideModal.currentSlotId);
      sideModal.closeCardSearch();
    }
  }, [sideModal, removeCard]);

  const handleCloseModal = useCallback((): void => {
    sideModal.closeCardSearch();
  }, [sideModal]);

  const handleApplyAndCloseFilter = useCallback((): void => {
    sideModal.closeFilter();
  }, [sideModal]);

  const handleKeywordChange = useCallback(
    (value: string): void => {
      updateFilter({ keyword: value || undefined });
    },
    [updateFilter]
  );

  const deckFrame = getDeckFrame(deck?.deckType);
  const deckMapping = getDeckSlotMapping(deck?.deckType);

  // フレンド枠のフィルタリング
  const filteredDeckFrame = isFriendSlotEnabled
    ? deckFrame
    : deckFrame.filter((character) => character !== 'フレンド');

  // スロット定義をキャラクターごとにコピーして、frameの出現順で消費しながらグループ化
  const slotMappingByCharacter = React.useMemo(() => {
    const mapping = new Map<CharacterName, DeckSlotMapping[]>();
    deckMapping.forEach((slot) => {
      const list = mapping.get(slot.characterName) ?? [];
      list.push(slot);
      mapping.set(slot.characterName, list);
    });
    mapping.forEach((list) => list.sort((a, b) => a.slotId - b.slotId));
    return mapping;
  }, [deckMapping]);

  const characterGroups = React.useMemo(() => {
    const mappingCopies = new Map<CharacterName, DeckSlotMapping[]>(
      Array.from(slotMappingByCharacter.entries()).map(([key, value]) => [
        key,
        [...value],
      ])
    );

    return filteredDeckFrame
      .map((character: CharacterName, idx) => {
        const mappings = mappingCopies.get(character);
        if (!mappings || mappings.length === 0) return null;

        const groupSize = character === 'フリー' ? Math.min(2, mappings.length) : Math.min(3, mappings.length);
        const groupMappings = mappings.splice(0, groupSize);
        if (groupMappings.length === 0) return null;

        const slots = groupMappings
          .map((mapping) => deckSlots.find((s) => s.slotId === mapping.slotId))
          .filter((slot): slot is DeckSlot => Boolean(slot));

        const key = `${character}-${groupMappings[0]?.slotId ?? idx}`;

        return { character, slots, row: groupMappings[0]?.row ?? 0, key };
      })
      .filter((group): group is { character: CharacterName; slots: DeckSlot[]; row: number; key: string } => group !== null);
  }, [deckSlots, filteredDeckFrame, slotMappingByCharacter]);

  const topRowGroups = characterGroups.filter((g) => g.row === 0);
  const middleRowGroups = characterGroups.filter((g) => g.row === 1);
  const bottomRowGroups = characterGroups.filter((g) => g.row === 2);

  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">デッキを読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* デッキグリッド */}
      <div className={`flex-1 w-full self-center py-2 px-2 overflow-x-auto pl-14 ${!isFriendSlotEnabled ? 'flex justify-center' : ''}`}>
        <div className="h-full flex flex-col gap-2 sm:gap-3 md:gap-4 justify-center" style={{ width: 'min(100%, 896px)' }}>
          {/* 上段 - 固定幅で並べ、フレンド有効時は4つ目がはみ出す */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {topRowGroups.map(({ character, slots, key }) => (
              <div 
                key={key} 
                className="flex-shrink-0" 
                style={{ width: character === 'フレンド' ? 'calc((90% - (2 * 0.5rem)) / 3 * 0.75)' : 'calc((90% - (2 * 0.5rem)) / 3)' }}
              >
                <CharacterDeckGroup
                  character={character}
                  slots={slots}
                  aceSlotId={deck.aceSlotId}
                  draggingSlotId={draggingSlotId}
                  isCenter={deck?.centerCharacter === character}
                  isSinger={deck?.participations?.includes(character) || false}
                  showLimitBreak={showLimitBreak}
                  onSlotClick={handleSlotClick}
                  onRemoveCard={removeCard}
                  onToggleAce={toggleAceCard}
                  onShowDetail={handleShowDetail}
                  onLimitBreakChange={updateLimitBreakCount}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  canDropToSlot={canDropToSlot}
                />
              </div>
            ))}
          </div>

          {/* 中段 */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {middleRowGroups.map(({ character, slots, key }) => (
              <div key={key} className="flex-shrink-0" style={{ width: 'calc((90% - (2 * 0.5rem)) / 3)' }}>
                <CharacterDeckGroup
                  character={character}
                  slots={slots}
                  aceSlotId={deck.aceSlotId}
                  draggingSlotId={draggingSlotId}
                  isCenter={deck?.centerCharacter === character}
                  isSinger={deck?.participations?.includes(character) || false}
                  showLimitBreak={showLimitBreak}
                  onSlotClick={handleSlotClick}
                  onRemoveCard={removeCard}
                  onToggleAce={toggleAceCard}
                  onShowDetail={handleShowDetail}
                  onLimitBreakChange={updateLimitBreakCount}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  canDropToSlot={canDropToSlot}
                />
              </div>
            ))}
          </div>

          {/* 下段 */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {bottomRowGroups.map(({ character, slots, key }) => (
              <div key={key} className="flex-shrink-0" style={{ width: 'calc((90% - (2 * 0.5rem)) / 3)' }}>
                <CharacterDeckGroup
                  character={character}
                  slots={slots}
                  aceSlotId={deck.aceSlotId}
                  draggingSlotId={draggingSlotId}
                  isCenter={deck?.centerCharacter === character}
                  isSinger={deck?.participations?.includes(character) || false}
                  showLimitBreak={showLimitBreak}
                  onSlotClick={handleSlotClick}
                  onRemoveCard={removeCard}
                  onToggleAce={toggleAceCard}
                  onShowDetail={handleShowDetail}
                  onLimitBreakChange={updateLimitBreakCount}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  canDropToSlot={canDropToSlot}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ツールバー */}
      <div className="w-full border-t border-gray-300 py-2 px-4 bg-gray-50 flex-shrink-0">
        <div className="flex gap-4">
          <Checkbox
            checked={isFriendSlotEnabled}
            onChange={setFriendSlotEnabled}
            label="フレンドカード枠有効"
          />
          <Checkbox
            checked={showLimitBreak}
            onChange={setShowLimitBreak}
            label="上限解放数を表示"
          />
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
              <button
                onClick={resetFilter}
                className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium"
              >
                リセット
              </button>
            )}
            <FilterButton
              activeCount={countActiveFilters()}
              onClick={() => sideModal.openFilter()}
            />
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <ActiveFilters
            filter={filter}
            clearFilterKey={clearFilterKey}
            updateFilter={updateFilter}
          />
          <div className="flex-1 overflow-y-auto">
            {currentSlotCard && currentCharacterName && (
              <CurrentCardDisplay
                card={currentSlotCard}
                characterName={currentCharacterName}
                onRemove={handleRemoveCurrentCard}
              />
            )}
            {assignedCards.length > 0 && (
              <InProgressCardDisplay
                cards={assignedCards}
                onSelectCard={handleSelectCard}
              />
            )}
            <CardList
              cards={filteredCards}
              loading={loading}
              onSelectCard={handleSelectCard}
            />
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
            >
              リセット
            </button>
            <button
              onClick={handleApplyAndCloseFilter}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition font-medium"
            >
              閉じる
            </button>
          </div>
        }
      >
        <CardFilter
          filter={filter}
          updateFilter={updateFilter}
          currentSlotId={sideModal.currentSlotId}
          deckType={deck?.deckType}
          onApply={handleApplyAndCloseFilter}
        />
      </SideModal>

      {/* Card detail modal */}
      <SideModal
        isOpen={sideModal.isCardDetailOpen}
        onClose={sideModal.closeCardDetail}
        title="カード詳細"
        width="md"
      >
        {sideModal.selectedCardId && (
          <CardDetailView cardId={sideModal.selectedCardId} />
        )}
      </SideModal>
    </div>
  );
};
