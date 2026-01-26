'use client';

import React from 'react';

interface VerticalBadgeProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 縦書きバッジコンポーネント
 */
export const VerticalBadge: React.FC<VerticalBadgeProps> = ({ text, icon, className = '', size = 'small' }) => {
  const sizeClasses = {
    small: 'px-1 py-2 text-xs min-w-[24px]',
    medium: 'px-2 py-3 text-sm min-w-[32px]',
    large: 'px-3 py-4 text-lg min-w-[48px]',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-md shadow-md ${sizeClasses[size]} ${className || 'bg-gradient-to-b from-yellow-400 to-yellow-500'}`}
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
      }}
    >
      {icon && <span className="text-white text-sm">{icon}</span>}
      <span className="text-white font-bold tracking-wider">{text}</span>
    </div>
  );
};
