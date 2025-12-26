import React from 'react';
import { Card } from '@/models/Card';
import { CardGridItem } from './CardGridItem';

interface CardGridProps {
  cards: Card[];
  loading: boolean;
  onSelectCard: (card: Card) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  loading,
  onSelectCard,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 text-lg">カードが見つかりませんでした</p>
          <p className="text-gray-400 text-sm mt-2">
            フィルター条件を変更してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <CardGridItem key={card.id} card={card} onSelect={onSelectCard} />
      ))}
    </div>
  );
};
