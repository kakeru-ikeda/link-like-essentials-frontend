'use client';

import React from 'react';
import { Card } from '@/models/Card';
import { getCharacterBackgroundColor } from '@/constants/characters';

interface CenterCardDisplayProps {
  centerCard: Card | null;
}

/**
 * センターカードのスペシャルアピール表示コンポーネント
 */
export const CenterCardDisplay: React.FC<CenterCardDisplayProps> = ({ centerCard }) => {
  if (!centerCard?.detail?.specialAppeal) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <div className="text-center">
          <div className="text-sm">センターカード未設定</div>
          <div className="text-xs mt-1">楽曲を選択し、対応するカードを編成してください</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="rounded-lg p-2"
        style={{ backgroundColor: getCharacterBackgroundColor(centerCard.characterName, 0.25) }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-gray-900">
            スペシャルアピール: {centerCard.detail.specialAppeal.name}
          </span>
          {centerCard.detail.specialAppeal.ap && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded whitespace-nowrap">
              AP {centerCard.detail.specialAppeal.ap}
            </span>
          )}
        </div>
        {centerCard.detail.specialAppeal.effect && (
          <p className="text-xs text-gray-600 whitespace-pre-line mt-1">
            {centerCard.detail.specialAppeal.effect}
          </p>
        )}
      </div>
    </div>
  );
};
