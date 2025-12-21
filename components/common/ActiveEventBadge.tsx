'use client';

import React from 'react';

interface ActiveEventBadgeProps {
  className?: string;
}

/**
 * 開催中イベントを示す目立つバッジ
 */
export const ActiveEventBadge: React.FC<ActiveEventBadgeProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg animate-pulse ${className}`}
    >
      ライグラ開催中！
    </span>
  );
};
