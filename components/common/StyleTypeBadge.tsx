'use client';

import React from 'react';
import { StyleType } from '@/models/enums';
import { STYLE_TYPE_LABELS, STYLE_TYPE_COLORS } from '@/constants/labels';

interface StyleTypeBadgeProps {
  styleType: StyleType | string;
  size?: 'small' | 'large';
}

export const StyleTypeBadge: React.FC<StyleTypeBadgeProps> = ({
  styleType,
  size = 'large',
}) => {
  // 英語のスタイルタイプを日本語に変換
  const getJapaneseStyleType = (type: StyleType | string): string => {
    const typeStr = typeof type === 'string' ? type.toUpperCase() : type;
    return STYLE_TYPE_LABELS[typeStr as StyleType] || String(type);
  };

  // スタイルタイプに応じた背景色を取得
  const getStyleTypeColor = (type: StyleType | string): string => {
    const typeStr = typeof type === 'string' ? type.toUpperCase() : type;
    return STYLE_TYPE_COLORS[typeStr as StyleType] || 'bg-gray-500 text-white';
  };

  const sizeClasses = size === 'large'
    ? 'px-2 py-1 text-xs'
    : 'px-1.5 py-0.5 text-[10px]';

  return (
    <span
      className={`${sizeClasses} ${getStyleTypeColor(styleType)} font-medium rounded shadow-sm inline-block`}
    >
      {getJapaneseStyleType(styleType)}
    </span>
  );
};
