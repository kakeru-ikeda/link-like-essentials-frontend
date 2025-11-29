'use client';

import React from 'react';
import { StyleType } from '@/models/enums';

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
    
    switch (typeStr) {
      case 'PERFORMER':
      case StyleType.PERFORMER:
        return 'パフォーマー';
      case 'MOODMAKER':
      case StyleType.MOODMAKER:
        return 'ムードメーカー';
      case 'CHEERLEADER':
      case StyleType.CHEERLEADER:
        return 'チアリーダー';
      case 'TRICKSTER':
      case StyleType.TRICKSTER:
        return 'トリックスター';
      default:
        return String(type);
    }
  };

  // スタイルタイプに応じた背景色を取得
  const getStyleTypeColor = (type: StyleType | string): string => {
    const typeStr = typeof type === 'string' ? type.toUpperCase() : type;
    
    switch (typeStr) {
      case 'PERFORMER':
      case StyleType.PERFORMER:
        return 'bg-red-500 text-white';
      case 'MOODMAKER':
      case StyleType.MOODMAKER:
        return 'bg-yellow-500 text-white';
      case 'CHEERLEADER':
      case StyleType.CHEERLEADER:
        return 'bg-green-500 text-white';
      case 'TRICKSTER':
      case StyleType.TRICKSTER:
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
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
