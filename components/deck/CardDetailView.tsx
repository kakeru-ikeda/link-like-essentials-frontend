'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { useCardDetail } from '@/hooks/useCards';
import { RarityBadge } from '@/components/common/RarityBadge';
import { StyleTypeBadge } from '@/components/common/StyleTypeBadge';
import { FavoriteModeBadge } from '@/components/common/FavoriteModeBadge';
import { LimitedTypeBadge } from '@/components/common/LimitedTypeBadge';
import { Loading } from '@/components/common/Loading';
import { getCharacterColor } from '@/constants/characterColors';

interface CardDetailViewProps {
  cardId: string;
}

export const CardDetailView: React.FC<CardDetailViewProps> = ({ cardId }) => {
  const { card, loading, error } = useCardDetail(cardId);
  const [imageError, setImageError] = React.useState(false);

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

  return (
    <div className="p-6 space-y-6">
      {/* カード画像 */}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border-2" style={{ borderColor: characterColor }}>
        {!imageError && card.detail?.awakeAfterStorageUrl ? (
          <img
            src={card.detail.awakeAfterStorageUrl}
            alt={card.cardName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
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

      {/* ステータス */}
      {card.detail?.stats && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">ステータス</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between bg-pink-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">スマイル</span>
              <span className="text-lg font-bold text-pink-600">{card.detail.stats.smile.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-blue-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">ピュア</span>
              <span className="text-lg font-bold text-blue-600">{card.detail.stats.pure.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-purple-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">クール</span>
              <span className="text-lg font-bold text-purple-600">{card.detail.stats.cool.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">メンタル</span>
              <span className="text-lg font-bold text-green-600">{card.detail.stats.mental.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* スペシャルアピール */}
      {card.detail?.specialAppeal && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">スペシャルアピール</h4>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-base font-medium text-gray-900">{card.detail.specialAppeal.name}</p>
              {card.detail.specialAppeal.effect && (
                <p className="text-sm text-gray-600 mt-1">{card.detail.specialAppeal.effect}</p>
              )}
            </div>
            {card.detail.specialAppeal.ap && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded whitespace-nowrap">
                AP {card.detail.specialAppeal.ap}
              </span>
            )}
          </div>
        </div>
      )}

      {/* スキル */}
      {card.detail?.skill && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">スキル</h4>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-base font-medium text-gray-900">{card.detail.skill.name}</p>
              {card.detail.skill.effect && (
                <p className="text-sm text-gray-600 mt-1">{card.detail.skill.effect}</p>
              )}
            </div>
            {card.detail.skill.ap && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                AP {card.detail.skill.ap}
              </span>
            )}
          </div>
        </div>
      )}

      {/* トレイト */}
      {card.detail?.trait && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">特性</h4>
          <p className="text-base font-medium text-gray-900">{card.detail.trait.name}</p>
          {card.detail.trait.effect && (
            <p className="text-sm text-gray-600 mt-1">{card.detail.trait.effect}</p>
          )}
        </div>
      )}

      {/* アクセサリー */}
      {card.accessories && card.accessories.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">アクセサリー</h4>
          <div className="space-y-3">
            {card.accessories.map((accessory) => (
              <div key={accessory.id} className="bg-gray-50 rounded p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900">{accessory.name}</p>
                  {accessory.ap && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded whitespace-nowrap">
                      AP {accessory.ap}
                    </span>
                  )}
                </div>
                {accessory.effect && (
                  <p className="text-xs text-gray-600 mt-1">{accessory.effect}</p>
                )}
                {accessory.traitName && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700">{accessory.traitName}</p>
                    {accessory.traitEffect && (
                      <p className="text-xs text-gray-600 mt-1">{accessory.traitEffect}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 入手方法 */}
      {card.detail?.acquisitionMethod && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">入手方法</h4>
          <p className="text-sm text-gray-600">{card.detail.acquisitionMethod}</p>
        </div>
      )}
    </div>
  );
};
