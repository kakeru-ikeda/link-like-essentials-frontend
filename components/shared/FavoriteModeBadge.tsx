'use client';

import React from 'react';

interface FavoriteModeBadgeProps {
  favoriteMode: string;
  size?: 'small' | 'large';
}

export const FavoriteModeBadge: React.FC<FavoriteModeBadgeProps> = ({
  favoriteMode,
  size = 'large',
}) => {
  // 英語のムードを日本語に変換
  const getJapaneseFavoriteMode = (mode: string): string => {
    const modeStr = mode.toUpperCase();
    
    switch (modeStr) {
      case 'HAPPY':
      case 'ハッピー':
        return 'ハッピー';
      case 'MELLOW':
      case 'メロウ':
        return 'メロウ';
      case 'NEUTRAL':
      case 'ニュートラル':
        return 'ニュートラル';
      default:
        return mode;
    }
  };

  // ムードに応じた背景色を取得
  const getFavoriteModeColor = (mode: string): string => {
    const modeStr = mode.toUpperCase();
    
    switch (modeStr) {
      case 'HAPPY':
      case 'ハッピー':
      case 'SMILE':
        return 'bg-pink-500 text-white';
      case 'MELLOW':
      case 'メロウ':
      case 'PURE':
        return 'bg-blue-500 text-white';
      case 'NEUTRAL':
      case 'ニュートラル':
      case 'COOL':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const sizeClasses = size === 'large'
    ? 'px-2 py-1 text-xs'
    : 'px-1.5 py-0.5 text-[10px]';

  return (
    <span
      className={`${sizeClasses} ${getFavoriteModeColor(favoriteMode)} font-medium rounded shadow-sm inline-block`}
    >
      {getJapaneseFavoriteMode(favoriteMode)}
    </span>
  );
};
