'use client';

import React, { useState } from 'react';
import { Card } from '@/models/Card';
import { RarityBadge } from '@/components/common/RarityBadge';
import { StyleTypeBadge } from '@/components/common/StyleTypeBadge';
import { FavoriteModeBadge } from '@/components/common/FavoriteModeBadge';
import { CardDetailSections } from '@/components/deck/CardDetailSections';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CurrentCardDisplayProps {
  card: Card;
  characterName: string;
}

export const CurrentCardDisplay: React.FC<CurrentCardDisplayProps> = ({
  card,
  characterName,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  const handleToggleDetail = (): void => {
    setIsDetailExpanded(!isDetailExpanded);
  };

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

      {/* メイン表示エリア */}
      {isSectionOpen && (
      <button
        onClick={handleToggleDetail}
        className="w-full px-4 pb-4 hover:bg-blue-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3 bg-white rounded-lg p-3">
          {/* カード画像サムネイル */}
          <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200">
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
                  className="w-6 h-6 text-gray-400"
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
              {card.styleType && (
                <StyleTypeBadge styleType={card.styleType} size="small" />
              )}
              {card.detail?.favoriteMode && card.detail.favoriteMode !== 'NONE' && (
                <FavoriteModeBadge favoriteMode={card.detail.favoriteMode} size="small" />
              )}
            </div>
            <h4 className="font-bold text-gray-900 text-sm truncate">{card.cardName}</h4>
          </div>

          {/* 展開アイコン */}
          <div className="flex-shrink-0">
            {isDetailExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>
      </button>
      )}

      {/* 展開エリア（詳細情報） */}
      {isSectionOpen && isDetailExpanded && card.detail && (
        <div className="px-4 pb-4 bg-blue-50">
          <CardDetailSections 
            card={card} 
            variant="compact"
            showStats={false}
            showAcquisition={false}
          />
        </div>
      )}
    </div>
  );
};
