'use client';

import React from 'react';
import { Tooltip } from '@/components/common/Tooltip';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  label?: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  tooltipWrapperClassName?: string;
  tooltipClassName?: string;
  className?: string;
  hideArrow?: boolean;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  label = '?',
  position = 'top',
  tooltipWrapperClassName,
  tooltipClassName,
  className = '',
  hideArrow = false,
}) => {
  return (
    <Tooltip
      content={content}
      position={position}
      className={tooltipWrapperClassName}
      tooltipClassName={tooltipClassName}
      hideArrow={hideArrow}
    >
      <span
        className={`inline-flex items-center justify-center w-5 h-5 text-sm font-bold text-white bg-cyan-400 rounded-full hover:bg-cyan-500 transition-colors ${className}`}
      >
        {label}
      </span>
    </Tooltip>
  );
};
