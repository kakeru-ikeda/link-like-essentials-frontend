'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { useCardDetail } from '@/hooks/useCards';
import { RarityBadge } from '@/components/common/RarityBadge';
import { StyleTypeBadge } from '@/components/common/StyleTypeBadge';
import { FavoriteModeBadge } from '@/components/common/FavoriteModeBadge';
import { LimitedTypeBadge } from '@/components/common/LimitedTypeBadge';
import { Loading } from '@/components/common/Loading';
import { CardDetailSections } from '@/components/deck/CardDetailSections';
import { getCharacterColor } from '@/constants/characters';

interface CardDetailViewProps {
  cardId: string;
}

export const CardDetailView: React.FC<CardDetailViewProps> = ({ cardId }) => {
  const { card, loading, error } = useCardDetail(cardId);
  const [imageError, setImageError] = React.useState(false);
  const [isAwakeAfter, setIsAwakeAfter] = React.useState(true);
  const [imageLoading, setImageLoading] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">カード情報の取得に失敗しました</p>
          <p className="text-red-500 text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">カード情報が見つかりません</p>
        </div>
      </div>
    );
  }

  const characterColor = getCharacterColor(card.characterName);
  const currentImageUrl = isAwakeAfter 
    ? card.detail?.awakeAfterStorageUrl 
    : card.detail?.awakeBeforeStorageUrl;

  return (
    <div className="p-6 space-y-6">
      {/* カード画像 */}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border-2" style={{ borderColor: characterColor }}>
        {/* 覚醒切り替えボタン */}
        {card.detail?.awakeBeforeStorageUrl && card.detail?.awakeAfterStorageUrl && (
          <div className="absolute top-2 right-2 z-10 flex gap-1 bg-black/50 rounded-lg p-1">
            <button
              onClick={() => {
                // 既に「覚醒前」表示なら何もしない
                if (!isAwakeAfter) return;
                setImageLoading(true);
                setIsAwakeAfter(false);
                setImageError(false);
              }}
              disabled={!isAwakeAfter}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                !isAwakeAfter
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              覚醒前
            </button>
            <button
              onClick={() => {
                // 既に「覚醒後」表示なら何もしない
                if (isAwakeAfter) return;
                setImageLoading(true);
                setIsAwakeAfter(true);
                setImageError(false);
              }}
              disabled={isAwakeAfter}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                isAwakeAfter
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              覚醒後
            </button>
          </div>
        )}
        {!imageError && currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt={card.cardName}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">画像なし</p>
            </div>
          </div>
        )}
        {/* ローディングオーバーレイ */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loading />
          </div>
        )}
      </div>

      {/* カード名 */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{card.cardName}</h3>
        <p className="text-sm text-gray-600 mt-1">{card.characterName}</p>
      </div>

      {/* バッジ群 */}
      <div className="flex flex-wrap gap-2">
        <RarityBadge rarity={card.rarity} size="large" position="inline" />
        <StyleTypeBadge styleType={card.styleType} size="large" />
        {card.detail?.favoriteMode && (
          <FavoriteModeBadge favoriteMode={card.detail.favoriteMode} size="large" />
        )}
        {card.limited && (
          <LimitedTypeBadge 
            limitedType={card.limited}
            size="large"
          />
        )}
      </div>

      {/* 注意書き */}
      <div className="text-xs text-gray-500">
        ※ 性能とステータスは最大育成時の値です
      </div>

      {/* カード詳細セクション */}
      <CardDetailSections 
        card={card} 
        variant="full" 
        showStats={true}
        showAcquisition={true}
      />
    </div>
  );
};
