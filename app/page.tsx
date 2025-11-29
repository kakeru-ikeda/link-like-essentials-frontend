'use client';

import React, { useState } from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { CardList } from '@/components/deck/CardList';
import { CurrentCardDisplay } from '@/components/deck/CurrentCardDisplay';
import { SideModal } from '@/components/common/SideModal';
import { Button } from '@/components/common/Button';
import { useDeck } from '@/hooks/useDeck';
import { useCards } from '@/hooks/useCards';
import { Card } from '@/models/Card';
import { useCardStore } from '@/store/cardStore';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState<number | null>(null);
  const { deck, addCard, removeCard, swapCards, clearAllCards, saveDeck } = useDeck();
  const { filters, updateFilters } = useCardStore();

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

  // カード一覧を取得（キャラクターでフィルタリング）
  const { cards, loading } = useCards(
    currentCharacterName ? { characterName: currentCharacterName } : undefined
  );

  // 現在のカードを除外したカードリスト
  const filteredCards = React.useMemo(() => {
    if (!currentSlotCard) return cards;
    return cards.filter((card) => card.id !== currentSlotCard.id);
  }, [cards, currentSlotCard]);

  const handleSlotClick = (slotId: number): void => {
    setCurrentSlotId(slotId);
    setIsModalOpen(true);
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
      >
        <div className="flex flex-col h-full">
          {currentSlotCard && currentCharacterName && (
            <CurrentCardDisplay card={currentSlotCard} characterName={currentCharacterName} />
          )}
          <div className="flex-1 overflow-y-auto">
            <CardList
              cards={filteredCards}
              loading={loading}
              onSelectCard={handleSelectCard}
              assignedCardIds={assignedCardIds}
            />
          </div>
        </div>
      </SideModal>
    </div>
  );
}
