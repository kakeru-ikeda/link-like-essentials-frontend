'use client';

import React, { useState, useEffect } from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { CardList } from '@/components/deck/CardList';
import { CurrentCardDisplay } from '@/components/deck/CurrentCardDisplay';
import { InProgressCardDisplay } from '@/components/deck/InProgressCardDisplay';
import { CardFilterComponent } from '@/components/deck/CardFilter';
import { FilterButton } from '@/components/deck/FilterButton';
import { ActiveFilters } from '@/components/deck/ActiveFilters';
import { SideModal } from '@/components/common/SideModal';
import { Button } from '@/components/common/Button';
import { useDeck } from '@/hooks/useDeck';
import { useCards } from '@/hooks/useCards';
import { useCardStore } from '@/store/cardStore';
import { Card } from '@/models/Card';
import { CardFilter } from '@/models/Filter';
import { filterCardsBySlot } from '@/services/deckFilterService';
import { canPlaceCardInSlot } from '@/constants/deckRules';
import { DECK_SLOT_MAPPING } from '@/constants/deckConfig';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState<number | null>(null);
  const [cardFilter, setCardFilter] = useState<CardFilter>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { deck, addCard, removeCard, swapCards, clearAllCards, saveDeck, getLastError } = useDeck();
  const { setActiveFilter, savedFilter, setSavedFilter } = useCardStore((state) => ({
    setActiveFilter: state.setActiveFilter,
    savedFilter: state.savedFilter,
    setSavedFilter: state.setSavedFilter,
  }));

  // フィルタが変更されたらactiveFilterを更新
  useEffect(() => {
    setActiveFilter(cardFilter);
  }, [cardFilter, setActiveFilter]);

  // 現在選択されているスロットのカード、キャラクター名、スロットタイプを取得
  const { currentSlotCard, currentCharacterName, currentSlotType } = React.useMemo(() => {
    if (currentSlotId === null || !deck) {
      return { currentSlotCard: null, currentCharacterName: undefined, currentSlotType: undefined };
    }
    const slot = deck.slots.find((s) => s.slotId === currentSlotId);
    const slotMapping = deck ? DECK_SLOT_MAPPING.find((m) => m.slotId === currentSlotId) : undefined;
    return {
      currentSlotCard: slot?.card || null,
      currentCharacterName: slot?.characterName,
      currentSlotType: slotMapping?.slotType,
    };
  }, [currentSlotId, deck]);

  // 編成済みのカードIDリストを取得（現在のスロットを除く）
  const assignedCardIds = React.useMemo(() => {
    if (!deck) return [];
    return deck.slots
      .filter((slot) => slot.slotId !== currentSlotId && slot.card)
      .map((slot) => slot.card!.id);
  }, [deck, currentSlotId]);

  // 編成済みのカードリストを取得（現在のスロットに配置可能なカードのみ表示）
  const assignedCards = React.useMemo(() => {
    if (!deck || currentSlotId === null) return [];
    
    return deck.slots
      .filter((slot) => {
        if (slot.slotId === currentSlotId || !slot.card) return false;
        return true;
      })
      .map((slot) => slot.card!)
      .filter((card, index, self) => {
        // 重複を除外
        if (self.findIndex((c) => c.id === card.id) !== index) return false;
        
        // 現在のスロットに配置可能かチェック
        const validationResult = canPlaceCardInSlot(
          { characterName: card.characterName, rarity: card.rarity },
          currentSlotId
        );
        return validationResult.allowed;
      });
  }, [deck, currentSlotId]);

  // カード一覧を取得（キャラクター + その他のフィルターでフィルタリング）
  // スロット未選択時はフェッチをスキップ
  const filterForQuery = React.useMemo(() => {
    if (currentSlotId === null) return undefined;
    
    // 現在のフィルターをそのまま使用（キャラクター制限は後でクライアント側で適用）
    return cardFilter;
  }, [currentSlotId, cardFilter]);

  const { cards, loading } = useCards(
    filterForQuery,
    currentSlotId === null // スロット未選択ならスキップ
  );

  // 現在のカードと編成中のカードを除外 + スロットの編成ルールでフィルタリング
  const filteredCards = React.useMemo(() => {
    if (currentSlotId === null) return [];
    
    // 現在のスロットのカードIDを除外
    const currentCardId = currentSlotCard?.id;
    
    // 1. 編成中のカードを除外
    const availableCards = cards.filter((card) => {
      if (currentCardId && card.id === currentCardId) return false;
      if (assignedCardIds.includes(card.id)) return false;
      return true;
    });
    
    // 2. スロットの編成ルールに従ってフィルタリング
    return filterCardsBySlot(availableCards, currentSlotId);
  }, [cards, currentSlotCard, assignedCardIds, currentSlotId]);

  const handleSlotClick = (slotId: number): void => {
    setCurrentSlotId(slotId);
    setIsModalOpen(true);
    
    // 保存されたフィルターを使用するが、キャラクターフィルタだけはクリア
    const { characterNames, ...filterWithoutCharacter } = savedFilter;
    setCardFilter(filterWithoutCharacter);
  };

  const handleSelectCard = (card: Card): void => {
    if (currentSlotId !== null) {
      // 選択したカードが他のスロットに編成済みかチェック
      const assignedSlot = deck?.slots.find(
        (slot) => slot.card?.id === card.id && slot.slotId !== currentSlotId
      );

      if (assignedSlot) {
        // 編成済みの場合は入れ替え（制約違反するカードは自動的に剥がれる）
        swapCards(currentSlotId, assignedSlot.slotId);
        setIsModalOpen(false);
        setCurrentSlotId(null);
      } else {
        // 編成済みでない場合は通常追加（編成ルールチェック付き）
        const success = addCard(currentSlotId, card);
        
        if (success) {
          setIsModalOpen(false);
          setCurrentSlotId(null);
        } else {
          // エラーメッセージを表示
          const errorMessage = getLastError() || '編成できませんでした';
          alert(errorMessage);
        }
      }
    }
  };

  const handleRemoveCurrentCard = (): void => {
    if (currentSlotId !== null) {
      removeCard(currentSlotId);
      setIsModalOpen(false);
      setCurrentSlotId(null);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setCurrentSlotId(null);
    setCardFilter(cardFilter);
    setSavedFilter(cardFilter);
  };

  const handleApplyFilters = (filter: CardFilter): void => {
    setCardFilter(filter);
    setSavedFilter(filter);
    setIsFilterModalOpen(false);
  };

  const handleClearFilter = (key: keyof CardFilter): void => {
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex gap-4 px-4 py-2 min-h-0">
        {/* 左側: デッキビルダー */}
        <div className="w-3/5 min-h-0 flex items-start">
          <DeckBuilder onSlotClick={handleSlotClick} />
        </div>

        {/* 右側: 今後使用するエリア + ボタン */}
        <div className="flex-1 flex flex-col gap-4 pt-4">
          {/* 今後使用するエリア */}
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">今後使用予定</p>
          </div>
          
          {/* ボタン */}
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={clearAllCards}>
              デッキをクリア
            </Button>
            <Button onClick={saveDeck}>保存</Button>
          </div>
        </div>
      </div>

      <SideModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${currentSlotType === 'main' ? 'メイン' : currentSlotType === 'side' ? 'サイド' : 'カードを選択'} - ${currentCharacterName || ''}`}
        width="md"
        keywordSearch={{
          value: cardFilter.keyword || '',
          onChange: (value) => setCardFilter({ ...cardFilter, keyword: value || undefined }),
          placeholder: 'カード名やキャラクター名で検索...',
        }}
        headerActions={
          <div className="flex items-center gap-2">
            {countActiveFilters() > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium"
              >
                リセット
              </button>
            )}
            <FilterButton
              activeCount={countActiveFilters()}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
        }
      >
        <div className="flex flex-col h-full">
          {/* 選択中のフィルター表示 */}
          <ActiveFilters
            filter={cardFilter}
            onClearFilter={handleClearFilter}
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

        {/* フィルターUIモーダル */}
        <CardFilterComponent
          onApplyFilters={handleApplyFilters}
          currentFilter={cardFilter}
          isFilterModalOpen={isFilterModalOpen}
          onCloseFilterModal={() => setIsFilterModalOpen(false)}
          currentSlotId={currentSlotId}
        />
      </SideModal>
    </div>
  );
}
