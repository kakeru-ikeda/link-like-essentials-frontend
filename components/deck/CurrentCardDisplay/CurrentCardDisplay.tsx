'use client';

import React, { useState } from 'react';
import { Card } from '@/models/Card';
import { RarityBadge } from '@/components/common/RarityBadge';
import { ApBadge } from '@/components/common/ApBadge';
import { StyleTypeBadge } from '@/components/common/StyleTypeBadge';
import { FavoriteModeBadge } from '@/components/common/FavoriteModeBadge';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (): void => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-blue-50 border-b border-blue-200 flex-shrink-0">
      {/* メイン表示エリア */}
      <button
        onClick={handleToggleExpand}
        className="w-full p-4 hover:bg-blue-100 transition-colors text-left"
      >
        <h3 className="text-sm font-bold text-gray-700 mb-2">現在のカード</h3>
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
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>
      </button>

      {/* 展開エリア（詳細情報） */}
      {isExpanded && card.detail && (
        <div className="px-4 pb-4 bg-blue-50">
          <div className="space-y-3">
            {/* スペシャルアピール */}
            {card.detail.specialAppeal && (
              <div className="bg-white rounded-lg p-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">スペシャルアピール</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-600">{card.detail.specialAppeal.name}</span>
                    {card.detail.specialAppeal.ap && (
                      <ApBadge ap={card.detail.specialAppeal.ap} position="inline" size="small" />
                    )}
                  </div>
                  {card.detail.specialAppeal.effect && (
                    <p className="text-xs text-gray-600 whitespace-pre-line">{card.detail.specialAppeal.effect}</p>
                  )}
                </div>
              </div>
            )}

            {/* スキル */}
            {card.detail.skill && (
              <div className="bg-white rounded-lg p-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">スキル</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">{card.detail.skill.name}</span>
                    {card.detail.skill.ap && (
                      <ApBadge ap={card.detail.skill.ap} position="inline" size="small" />
                    )}
                  </div>
                  {card.detail.skill.effect && (
                    <p className="text-xs text-gray-600 whitespace-pre-line">{card.detail.skill.effect}</p>
                  )}
                </div>
              </div>
            )}

            {/* 特性 */}
            {card.detail.trait && (
              <div className="bg-white rounded-lg p-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">特性</h4>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-600">{card.detail.trait.name}</span>
                  {card.detail.trait.effect && (
                    <p className="text-xs text-gray-600 whitespace-pre-line">{card.detail.trait.effect}</p>
                  )}
                </div>
              </div>
            )}

            {/* アクセサリー */}
            {card.detail.accessories && card.detail.accessories.length > 0 && (
              <div className="bg-white rounded-lg p-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">アクセサリー</h4>
                <div className="space-y-2">
                  {card.detail.accessories.map((accessory) => (
                    <div key={accessory.id} className="border-l-2 border-blue-500 pl-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-600">{accessory.name}</span>
                        {accessory.ap && (
                          <ApBadge ap={accessory.ap} position="inline" size="small" />
                        )}
                      </div>
                      {accessory.effect && (
                        <p className="text-xs text-gray-600 whitespace-pre-line mb-1">{accessory.effect}</p>
                      )}
                      {accessory.traitName && (
                        <div className="text-xs">
                          <span className="font-bold text-purple-700">{accessory.traitName}</span>
                          {accessory.traitEffect && (
                            <span className="text-gray-600 ml-1 whitespace-pre-line">: {accessory.traitEffect}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
