'use client';

import React from 'react';
import { useAwakeState } from '@/hooks/card/useAwakeState';

interface AwakeToggleButtonProps {
  cardId: string;
  hasAwakeToggle: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const AwakeToggleButton: React.FC<AwakeToggleButtonProps> = ({
  cardId,
  hasAwakeToggle,
  className = '',
  onClick,
}) => {
  const { isAwakeAfter, setAwakeState } = useAwakeState(cardId);

  if (!hasAwakeToggle) return null;

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setAwakeState(!isAwakeAfter);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isAwakeAfter}
      className={`p-1 rounded-md transition-colors ${
        isAwakeAfter
          ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
          : 'bg-black/50 text-white hover:bg-black/70'
      } ${className}`}
      aria-label={isAwakeAfter ? '覚醒前イラストに切り替え' : '覚醒後イラストに切り替え'}
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    </button>
  );
};
