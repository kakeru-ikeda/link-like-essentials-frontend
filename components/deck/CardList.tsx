'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { CardListItem } from '@/components/deck/CardListItem';
import { Loading } from '@/components/common/Loading';

interface CardListProps {
  cards: Card[];
  loading: boolean;
  onSelectCard: (card: Card) => void;
  assignedCardIds?: string[];
}

export const CardList: React.FC<CardListProps> = ({
  cards,
  loading,
  onSelectCard,
  assignedCardIds = [],
}) => {
  if (loading) {
    return <Loading />;
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">カードが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-2">
      {cards.map((card) => (
        <CardListItem
          key={card.id}
          card={card}
          onSelect={onSelectCard}
          isAssigned={assignedCardIds.includes(card.id)}
        />
      ))}
    </div>
  );
};
