'use client';

import React from 'react';
import { StyleType } from '@/models/enums';
import { STYLE_TYPE_LABELS } from '@/mappers/enumMappers';
import { STYLE_TYPE_COLORS } from '@/styles/colors';

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
    return STYLE_TYPE_COLORS[typeStr as StyleType] || '#6b7280'; // デフォルトは gray-500
  };

  const sizeClasses =
    size === 'large' ? 'px-2 py-1 text-xs' : 'px-1.5 py-0.5 text-[10px]';

  const backgroundColor = getStyleTypeColor(styleType);

  return (
    <span
      className={`${sizeClasses} font-medium rounded shadow-sm inline-block text-white`}
      style={{ backgroundColor }}
    >
      {getJapaneseStyleType(styleType)}
    </span>
  );
};
