'use client';

import React, { useState } from 'react';
import { Card } from '@/models/Card';
import { RarityBadge } from '@/components/common/RarityBadge';
import { StyleTypeBadge } from '@/components/common/StyleTypeBadge';
import { FavoriteModeBadge } from '@/components/common/FavoriteModeBadge';
import { LimitedTypeBadge } from '@/components/common/LimitedTypeBadge';
import { getCharacterColor } from '@/utils/colorUtils';

interface CardListViewProps {
  cards: Card[];
  loading: boolean;
  onClickCard: (card: Card) => void;
}

export const CardListView: React.FC<CardListViewProps> = ({ cards, loading, onClickCard }) => {
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});

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
          <p className="text-gray-400 text-sm mt-2">フィルター条件を変更してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {cards.map((card) => {
        const characterColor = getCharacterColor(card.characterName);
        const showFallback = errorMap[card.id] || !card.detail?.awakeAfterStorageUrl;

        return (
          <button
            key={card.id}
            onClick={() => onClickCard(card)}
            className="w-full bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all text-left overflow-hidden"
            aria-label={`カード: ${card.cardName}`}
            style={{ borderLeftColor: characterColor, borderLeftWidth: '6px' }}
          >
            <div className="flex items-stretch">
              <div className="w-28 sm:w-36 bg-gray-100 h-full relative">
                {!showFallback ? (
                  <img
                    src={card.detail?.awakeAfterStorageUrl}
                    alt={card.cardName}
                    className="w-full h-full object-cover"
                    onError={() => setErrorMap((prev) => ({ ...prev, [card.id]: true }))}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[84px]">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 p-3 sm:p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1 flex-wrap">
                  <RarityBadge rarity={card.rarity} position="inline" size="small" />
                  {card.styleType && <StyleTypeBadge styleType={card.styleType} size="small" />}
                  {card.detail?.favoriteMode && card.detail.favoriteMode !== 'NONE' && (
                    <FavoriteModeBadge favoriteMode={card.detail.favoriteMode} size="small" />
                  )}
                  <LimitedTypeBadge limitedType={card.limited} size="small" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">{card.cardName}</p>
                  <p className="text-xs sm:text-xs text-gray-600">{card.characterName}</p>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
