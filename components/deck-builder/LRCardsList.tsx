'use client';

import React from 'react';
import { Card } from '@/models/domain/Card';
import { LRCardBadge } from '@/components/deck-builder/LRCardBadge';

interface LRCardsListProps {
  lrCards: Card[];
}

/**
 * LRカード一覧表示コンポーネント
 */
export const LRCardsList: React.FC<LRCardsListProps> = ({ lrCards }) => {
  if (lrCards.length === 0) return null;

  return (
    <div className="pt-2 border-t border-gray-200">
      <div className="text-xs text-gray-500 mb-2">編成されているLRカード:</div>
      <div className="flex flex-wrap gap-1">
        {lrCards.map((card) => (
          <LRCardBadge key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};
