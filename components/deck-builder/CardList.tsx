import React from 'react';
import { Card } from '@/models/domain/Card';
import { CardListItem } from '@/components/deck-builder/CardListItem';
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
    <div className="flex flex-col px-2">
      {cards.map((card) => (
        <CardListItem key={card.id} card={card} onSelect={onSelectCard} />
      ))}
    </div>
  );
};
