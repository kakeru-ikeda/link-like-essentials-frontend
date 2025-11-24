'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { CardItem } from '../CardItem';
import { Loading } from '@/components/common/Loading';

interface CardListProps {
  cards: Card[];
  loading: boolean;
  onSelectCard: (card: Card) => void;
}

export const CardList: React.FC<CardListProps> = ({
  cards,
  loading,
  onSelectCard,
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onSelect={onSelectCard} />
      ))}
    </div>
  );
};
