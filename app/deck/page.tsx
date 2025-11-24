'use client';

import React, { useState } from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { CardList } from '@/components/deck/CardList';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useDeck } from '@/hooks/useDeck';
import { useCards } from '@/hooks/useCards';
import { Card } from '@/models/Card';
import { useCardStore } from '@/store/cardStore';

export default function DeckPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState<number | null>(null);
  const { deck, addCard, removeCard, clearAllCards, saveDeck } = useDeck();
  const { filters, updateFilters } = useCardStore();

  // 現在選択されているスロットのキャラクター名を取得
  const currentCharacterName = React.useMemo(() => {
    if (currentSlotId === null || !deck) return undefined;
    const slot = deck.slots.find((s) => s.slotId === currentSlotId);
    return slot?.characterName;
  }, [currentSlotId, deck]);

  // カード一覧を取得（キャラクターでフィルタリング）
  const { cards, loading } = useCards(
    currentCharacterName ? { characterName: currentCharacterName } : undefined
  );

  const handleSlotClick = (slotId: number): void => {
    setCurrentSlotId(slotId);
    setIsModalOpen(true);
  };

  const handleSelectCard = (card: Card): void => {
    if (currentSlotId !== null) {
      addCard(currentSlotId, card);
      setIsModalOpen(false);
      setCurrentSlotId(null);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setCurrentSlotId(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">デッキビルダー</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={clearAllCards}>
              デッキをクリア
            </Button>
            <Button onClick={saveDeck}>保存</Button>
          </div>
        </div>

        <DeckBuilder onSlotClick={handleSlotClick} />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`カードを選択 - ${currentCharacterName || ''}`}
        >
          <CardList
            cards={cards}
            loading={loading}
            onSelectCard={handleSelectCard}
          />
        </Modal>
      </div>
    </main>
  );
}
