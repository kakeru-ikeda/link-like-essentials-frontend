'use client';

import React, { useState } from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { CardList } from '@/components/deck/CardList';
import { CurrentCardDisplay } from '@/components/deck/CurrentCardDisplay';
import { CardFilterComponent } from '@/components/deck/CardFilter';
import { FilterButton } from '@/components/deck/FilterButton';
import { ActiveFilters } from '@/components/deck/ActiveFilters';
import { SideModal } from '@/components/common/SideModal';
import { Button } from '@/components/common/Button';
import { useDeck } from '@/hooks/useDeck';
import { useCards } from '@/hooks/useCards';
import { Card } from '@/models/Card';
import { CardFilter } from '@/models/Filter';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState<number | null>(null);
  const [cardFilter, setCardFilter] = useState<CardFilter>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { deck, addCard, removeCard, swapCards, clearAllCards, saveDeck } = useDeck();

  // 現在選択されているスロットのキャラクター名を取得
  const currentCharacterName = React.useMemo(() => {
    if (currentSlotId === null || !deck) return undefined;
    const slot = deck.slots.find((s) => s.slotId === currentSlotId);
    return slot?.characterName;
  }, [currentSlotId, deck]);

  // 現在選択されているスロットのカードを取得
  const currentSlotCard = React.useMemo(() => {
    if (currentSlotId === null || !deck) return null;
    const slot = deck.slots.find((s) => s.slotId === currentSlotId);
    return slot?.card || null;
  }, [currentSlotId, deck]);

  // 編成済みのカードIDリストを取得（現在のスロットを除く）
  const assignedCardIds = React.useMemo(() => {
    if (!deck) return [];
    return deck.slots
      .filter((slot) => slot.slotId !== currentSlotId && slot.card)
      .map((slot) => slot.card!.id);
  }, [deck, currentSlotId]);

  // カード一覧を取得（キャラクター + その他のフィルターでフィルタリング）
  // スロット未選択時はフェッチをスキップ
  const filterForQuery = React.useMemo(() => {
    if (currentSlotId === null) return undefined;
    
    // 現在のフィルターをベースにする
    const combinedFilter: CardFilter = { ...cardFilter };
    
    // フリー枠以外の場合、キャラクター名を強制的に追加
    if (currentCharacterName && currentCharacterName !== 'フリー') {
      combinedFilter.characterNames = [currentCharacterName];
    }
    
    return combinedFilter;
  }, [currentSlotId, currentCharacterName, cardFilter]);

  const { cards, loading } = useCards(
    filterForQuery,
    currentSlotId === null // スロット未選択ならスキップ
  );

  // 現在のカードを除外したカードリスト
  const filteredCards = React.useMemo(() => {
    if (!currentSlotCard) return cards;
    return cards.filter((card) => card.id !== currentSlotCard.id);
  }, [cards, currentSlotCard]);

  const handleSlotClick = (slotId: number): void => {
    setCurrentSlotId(slotId);
    setIsModalOpen(true);
    
    // フリー以外のキャラクター枠の場合、デフォルトでそのキャラクターのフィルターを設定
    const slot = deck?.slots.find((s) => s.slotId === slotId);
    if (slot?.characterName && slot.characterName !== 'フリー') {
      setCardFilter({ characterNames: [slot.characterName] });
    } else {
      setCardFilter({});
    }
  };

  const handleSelectCard = (card: Card): void => {
    if (currentSlotId !== null) {
      // 選択したカードが他のスロットに編成済みかチェック
      const assignedSlot = deck?.slots.find(
        (slot) => slot.card?.id === card.id && slot.slotId !== currentSlotId
      );

      if (assignedSlot) {
        // 編成済みの場合は入れ替え
        swapCards(currentSlotId, assignedSlot.slotId);
      } else {
        // 編成済みでない場合は通常追加
        addCard(currentSlotId, card);
      }

      setIsModalOpen(false);
      setCurrentSlotId(null);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setCurrentSlotId(null);
  };

  const handleApplyFilters = (filter: CardFilter): void => {
    setCardFilter(filter);
    setIsFilterModalOpen(false);
  };

  const handleClearFilter = (key: keyof CardFilter): void => {
    const newFilter = { ...cardFilter };
    
    // キャラクター名フィルターの場合、ロックされたキャラクター以外を削除
    if (key === 'characterNames' && currentCharacterName && currentCharacterName !== 'フリー') {
      newFilter.characterNames = [currentCharacterName];
    } else {
      delete newFilter[key];
    }
    
    setCardFilter(newFilter);
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex gap-4 px-4 py-2 min-h-0">
        {/* 左側: デッキビルダー */}
        <div className="w-3/5 min-h-0 flex items-start pt-4">
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
        title={`カードを選択 - ${currentCharacterName || ''}`}
        headerActions={
          <FilterButton
            activeCount={countActiveFilters()}
            onClick={() => setIsFilterModalOpen(true)}
          />
        }
      >
        <div className="flex flex-col h-full">
          {currentSlotCard && currentCharacterName && (
            <CurrentCardDisplay card={currentSlotCard} characterName={currentCharacterName} />
          )}

          {/* 選択中のフィルター表示 */}
          <ActiveFilters
            filter={cardFilter}
            onClearFilter={handleClearFilter}
            lockedCharacter={currentCharacterName !== 'フリー' ? currentCharacterName : undefined}
          />

          <div className="flex-1 overflow-y-auto">
            <CardList
              cards={filteredCards}
              loading={loading}
              onSelectCard={handleSelectCard}
              assignedCardIds={assignedCardIds}
            />
          </div>
        </div>

        {/* フィルターUIモーダル */}
        <CardFilterComponent
          onApplyFilters={handleApplyFilters}
          currentFilter={cardFilter}
          isFilterModalOpen={isFilterModalOpen}
          onCloseFilterModal={() => setIsFilterModalOpen(false)}
          lockedCharacter={currentCharacterName !== 'フリー' ? currentCharacterName : undefined}
        />
      </SideModal>
    </div>
  );
}
