'use client';

import React from 'react';
import { Tooltip } from '@/components/common/Tooltip';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  label?: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  tooltipClassName?: string;
  hideArrow?: boolean;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  label = '?',
  position = 'top',
  className,
  tooltipClassName,
  hideArrow = false,
}) => {
  return (
    <Tooltip
      content={content}
      position={position}
      className={className}
      tooltipClassName={tooltipClassName}
      hideArrow={hideArrow}
    >
      <span
        className={
          'inline-flex items-center justify-center w-5 h-5 text-sm font-bold text-white bg-cyan-400 rounded-full hover:bg-cyan-500 transition-colors'
        }
      >
        {label}
      </span>
    </Tooltip>
  );
};
