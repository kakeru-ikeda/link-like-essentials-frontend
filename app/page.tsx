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

export default function Home() {
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
  );
}
