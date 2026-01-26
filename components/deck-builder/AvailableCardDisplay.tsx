'use client';

import React, { useState } from 'react';
import { Card } from '@/models/domain/Card';
import { CardList } from '@/components/deck-builder/CardList';

interface AvailableCardDisplayProps {
  cards: Card[];
  loading: boolean;
  onSelectCard: (card: Card) => void;
}

export const AvailableCardDisplay: React.FC<AvailableCardDisplayProps> = ({
  cards,
  loading,
  onSelectCard,
}) => {
  const headerLabel = loading
    ? '編成可能なカードを読み込み中...'
    : `編成可能なカード (${cards.length})`;

  return (
    <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="w-full px-4 py-2 text-left flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">{headerLabel}</h3>
        </div>
        <div className="px-2 pb-4">
          <CardList cards={cards} loading={loading} onSelectCard={onSelectCard} />
        </div>
    </div>
  );
};
