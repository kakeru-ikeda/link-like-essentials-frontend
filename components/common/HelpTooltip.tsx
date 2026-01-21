'use client';

import React from 'react';
import { Tooltip } from '@/components/common/Tooltip';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  label?: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  size?: number;
  hideArrow?: boolean;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  label = '?',
  position = 'top',
  className,
  size = 5,
  hideArrow = false,
}) => {
  return (
    <Tooltip content={content} position={position} hideArrow={hideArrow}>
      <span
        className={`inline-flex items-center justify-center font-bold text-white bg-cyan-400 rounded-full hover:bg-cyan-500 transition-colors align-middle flex-shrink-0 ${className}`}
        style={{
          width: `${size * 4}px`,
          height: `${size * 4}px`,
          fontSize: `${size * 2.4}px`,
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </Tooltip>
  );
};
