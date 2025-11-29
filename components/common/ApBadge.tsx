'use client';

import React from 'react';

interface ApBadgeProps {
  ap: string;
  favoriteMode?: string;
  size?: 'small' | 'large';
  position?: 'absolute' | 'inline';
}

export const ApBadge: React.FC<ApBadgeProps> = ({ 
  ap, 
  favoriteMode,
  size = 'large',
  position = 'absolute'
}) => {
  // ムードに応じたAP背景色を取得
  const getApBackgroundColor = (mode?: string): string => {
    if (!mode) return 'bg-blue-600';
    
    const lowerMode = mode.toLowerCase();
    if (lowerMode.includes('happy') || lowerMode.includes('ハッピー')) {
      return 'bg-pink-500';
    } else if (lowerMode.includes('mellow') || lowerMode.includes('メロウ')) {
      return 'bg-blue-500';
    } else if (lowerMode.includes('neutral') || lowerMode.includes('ニュートラル')) {
      return 'bg-green-500';
    }
    return 'bg-blue-600'; // デフォルト
  };

  const sizeClasses = size === 'large' 
    ? 'px-2 py-1 text-xs' 
    : 'px-1.5 py-0.5 text-[10px]';

  const positionClasses = position === 'absolute'
    ? 'absolute top-1 left-1 z-20 pointer-events-none bg-opacity-75 shadow-lg'
    : 'inline-block shadow-sm';

  return (
    <span 
      className={`${sizeClasses} ${positionClasses} ${getApBackgroundColor(favoriteMode)} text-white font-bold rounded`}
    >
      {ap}
    </span>
  );
};
