'use client';

import React, { useState } from 'react';
import { Card } from '@/models/Card';
import { CardListItem } from '@/components/deck/CardListItem';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CurrentCardDisplayProps {
  card: Card;
  characterName: string;
  onRemove: () => void;
}

export const CurrentCardDisplay: React.FC<CurrentCardDisplayProps> = ({
  card,
  characterName,
  onRemove,
}) => {
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  const handleToggleSection = (): void => {
    setIsSectionOpen(!isSectionOpen);
  };

  return (
    <div className="bg-blue-50 border-b border-blue-200 flex-shrink-0">
      {/* セクションヘッダー */}
      <button
        onClick={handleToggleSection}
        className="w-full px-4 py-2 hover:bg-blue-100 transition-colors text-left flex items-center justify-between"
      >
        <h3 className="text-sm font-bold text-gray-700">現在のカード</h3>
        <div className="flex-shrink-0">
          {isSectionOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </button>

      {/* カード表示 */}
      {isSectionOpen && (
        <div className="px-4 pb-4">
          <CardListItem card={card} onSelect={onRemove} variant="current" />
        </div>
      )}
    </div>
  );
};
