'use client';

import React from 'react';

interface AceBadgeProps {
  isAce: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  size?: 'small' | 'large' | 'xlarge';
}

export const AceBadge: React.FC<AceBadgeProps> = ({
  isAce,
  onToggle,
  disabled = false,
  size = 'large'
}) => {
  const sizeClass = size === 'xlarge' ? 'w-16 h-16' : size === 'large' ? 'w-8 h-8' : 'w-6 h-6';
  const iconSize = size === 'xlarge' ? 'w-10 h-10' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4';
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && onToggle) onToggle();
      }}
      disabled={disabled}
      className={`absolute bottom-1 right-1 z-20 ${sizeClass} rounded-full 
        ${isAce ? 'bg-yellow-400' : 'bg-gray-400 bg-opacity-50'} 
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
        transition-all shadow-lg flex items-center justify-center`}
      aria-label={isAce ? 'エース解除' : 'エースに設定'}
    >
      <svg
        className={`${iconSize} ${isAce ? 'text-yellow-900' : 'text-white'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
      </svg>
    </button>
  );
};
