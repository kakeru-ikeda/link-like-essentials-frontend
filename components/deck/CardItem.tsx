'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { RarityBadge } from '@/components/common/RarityBadge';
import { ApBadge } from '@/components/common/ApBadge';
import { StyleTypeBadge } from '@/components/common/StyleTypeBadge';
import { FavoriteModeBadge } from '@/components/common/FavoriteModeBadge';

interface CardItemProps {
  card: Card;
  onSelect: (card: Card) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onSelect }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <button
      onClick={() => onSelect(card)}
      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
    >
      {/* カード画像サムネイル */}
      <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
        {!imageError && card.detail?.awakeAfterStorageUrl ? (
          <img
            src={card.detail.awakeAfterStorageUrl}
            alt={card.cardName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <svg
              className="w-8 h-8 text-gray-400"
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

      {/* カード情報 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <RarityBadge rarity={card.rarity} position="inline" size="small" />
          {card.detail?.skill?.ap && (
            <ApBadge ap={card.detail.skill.ap} position="inline" size="small" />
          )}
          {card.styleType && (
            <StyleTypeBadge styleType={card.styleType} size="small" />
          )}
          {card.detail?.favoriteMode && card.detail.favoriteMode !== 'NONE' && (
            <FavoriteModeBadge favoriteMode={card.detail.favoriteMode} size="small" />
          )}
        </div>
        <h3 className="font-bold text-gray-900 truncate">{card.cardName}</h3>
        <p className="text-sm text-gray-600">{card.characterName}</p>
      </div>

      {/* 選択ボタン */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};
