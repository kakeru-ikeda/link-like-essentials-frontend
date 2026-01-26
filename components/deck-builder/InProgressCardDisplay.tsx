'use client';

import React, { useState } from 'react';
import { Card } from '@/models/domain/Card';
import { CardListItem } from '@/components/deck-builder/CardListItem';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InProgressCardDisplayProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
}

export const InProgressCardDisplay: React.FC<InProgressCardDisplayProps> = ({
  cards,
  onSelectCard,
}) => {
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const handleToggleSection = (): void => {
    setIsSectionOpen(!isSectionOpen);
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="bg-green-100 border-b border-green-200 flex-shrink-0">
      {/* セクションヘッダー */}
      <button
        onClick={handleToggleSection}
        className="w-full px-4 py-2 hover:bg-green-200 transition-colors text-left flex items-center justify-between"
      >
        <h3 className="text-sm font-bold text-gray-700">
          編成中のカード ({cards.length})
        </h3>
        <div className="flex-shrink-0">
          {isSectionOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </button>

      {/* カードリスト */}
      {isSectionOpen && (
        <div className="px-4 pb-4 space-y-2">
          {cards.map((card) => (
            <CardListItem 
              key={card.id}
              card={card} 
              onSelect={onSelectCard} 
              variant="inProgress" 
            />
          ))}
        </div>
      )}
    </div>
  );
};
