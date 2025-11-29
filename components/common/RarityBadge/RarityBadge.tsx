'use client';

import React from 'react';
import { Rarity } from '@/models/enums';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'small' | 'large';
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ 
  rarity, 
  size = 'large' 
}) => {
  // レアリティに応じた背景色とグラデーションを取得
  const getRarityStyle = (rarity: Rarity): string => {
    switch (rarity) {
      case Rarity.UR:
        return 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900';
      case Rarity.SR:
        return 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white';
      case Rarity.R:
        return 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white';
      case Rarity.DR:
        return 'bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white';
      case Rarity.BR:
        return 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white';
      case Rarity.LR:
        return 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const sizeClasses = size === 'large' 
    ? 'px-2 py-1 text-xs' 
    : 'px-1.5 py-0.5 text-[10px]';

  return (
    <div className="absolute top-8 left-1 z-20 pointer-events-none">
      <div 
        className={`${sizeClasses} ${getRarityStyle(rarity)} font-bold rounded shadow-lg`}
      >
        {rarity}
      </div>
    </div>
  );
};
