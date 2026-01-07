'use client';

import React from 'react';
import { LimitedType } from '@/models/enums';
import { LIMITED_TYPE_LABELS } from '@/mappers/enumMappers';
import { LIMITED_TYPE_COLORS } from '@/styles/colors';

interface LimitedTypeBadgeProps {
  limitedType: LimitedType;
  size?: 'small' | 'large';
}

export const LimitedTypeBadge: React.FC<LimitedTypeBadgeProps> = ({
  limitedType,
  size = 'large',
}) => {
  // 恒常は表示しない
  if (limitedType === LimitedType.PERMANENT) {
    return null;
  }

  const sizeClasses =
    size === 'large' ? 'px-2 py-1 text-xs' : 'px-1.5 py-0.5 text-[10px]';

  const backgroundColor = LIMITED_TYPE_COLORS[limitedType] || '#9ca3af';
  const label = LIMITED_TYPE_LABELS[limitedType] || limitedType;

  return (
    <span
      className={`${sizeClasses} font-medium rounded shadow-sm inline-block text-white`}
      style={{ backgroundColor }}
    >
      {label}
    </span>
  );
};
