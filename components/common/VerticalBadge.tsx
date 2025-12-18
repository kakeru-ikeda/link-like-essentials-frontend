'use client';

import React from 'react';

interface VerticalBadgeProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * 縦書きバッジコンポーネント
 */
export const VerticalBadge: React.FC<VerticalBadgeProps> = ({ text, icon, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 px-1 py-2 rounded-md shadow-md ${className || 'bg-gradient-to-b from-yellow-400 to-yellow-500'}`}
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
        minWidth: '24px',
      }}
    >
      {icon && <span className="text-white text-sm">{icon}</span>}
      <span className="text-white text-xs font-bold tracking-wider">{text}</span>
    </div>
  );
};
