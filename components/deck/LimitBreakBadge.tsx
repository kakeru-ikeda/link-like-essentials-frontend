'use client';

import React from 'react';

interface LimitBreakBadgeProps {
  value: number;
  isMain?: boolean;
  variant?: 'default' | 'export';
  showControls?: boolean;
  onIncrease?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDecrease?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const LimitBreakBadge: React.FC<LimitBreakBadgeProps> = ({
  value,
  isMain = false,
  variant = 'default',
  showControls = false,
  onIncrease,
  onDecrease,
  min = 10,
  max = 14,
  className = '',
}) => {
  const canIncrease = onIncrease && value < max;
  const canDecrease = onDecrease && value > min;

  const badgeClassName =
    variant === 'export'
      ? `${isMain ? 'text-8xl px-5 py-3' : 'text-7xl px-4 py-2.5'} bg-black/50 text-white font-black rounded-xl tabular-nums shadow-2xl`
      : `${isMain ? 'text-5xl px-3.5 py-2.5' : 'text-3xl px-2 py-1'} bg-black/60 text-white font-black rounded-xl tabular-nums shadow-xl`;

  return (
    <div className={`flex items-center gap-1 pointer-events-none ${className}`}>
      <div className={badgeClassName}>
        {value.toString().padStart(2, '0')}
      </div>
      {showControls && (
        <div className="flex flex-col gap-1 pointer-events-auto justify-center self-center">
          <button
            type="button"
            onClick={onIncrease}
            disabled={!canIncrease}
            className="bg-white/90 hover:bg-white disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 rounded-full p-1 transition-colors shadow-lg"
            aria-label="上限解放数を増やす"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDecrease}
            disabled={!canDecrease}
            className="bg-white/90 hover:bg-white disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 rounded-full p-1 transition-colors shadow-lg"
            aria-label="上限解放数を減らす"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
