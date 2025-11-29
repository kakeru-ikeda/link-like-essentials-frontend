'use client';

import React from 'react';
import { LimitedType } from '@/models/enums';

interface LimitedTypeBadgeProps {
  limitedType: LimitedType;
  size?: 'small' | 'large';
}

// GraphQL ENUMから日本語表示へのマッピング
const LIMITED_TYPE_LABELS: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: '恒常',
  [LimitedType.LIMITED]: '限定',
  [LimitedType.BIRTHDAY_LIMITED]: '誕限定',
  [LimitedType.SPRING_LIMITED]: '春限定',
  [LimitedType.SUMMER_LIMITED]: '夏限定',
  [LimitedType.AUTUMN_LIMITED]: '秋限定',
  [LimitedType.WINTER_LIMITED]: '冬限定',
  [LimitedType.LEG_LIMITED]: 'LEG限定',
  [LimitedType.BATTLE_LIMITED]: '撃限定',
  [LimitedType.PARTY_LIMITED]: '宴限定',
  [LimitedType.ACTIVITY_LIMITED]: '活限定',
  [LimitedType.GRADUATE_LIMITED]: '卒限定',
  [LimitedType.LOGIN_BONUS]: 'ログボ',
  [LimitedType.REWARD]: '報酬',
};

// 限定タイプごとの色定義
const LIMITED_TYPE_COLORS: Record<LimitedType, string> = {
  [LimitedType.PERMANENT]: 'bg-gray-500 text-white',
  [LimitedType.LIMITED]: 'bg-amber-500 text-white',
  [LimitedType.BIRTHDAY_LIMITED]: 'bg-pink-500 text-white',
  [LimitedType.SPRING_LIMITED]: 'bg-green-400 text-white',
  [LimitedType.SUMMER_LIMITED]: 'bg-blue-400 text-white',
  [LimitedType.AUTUMN_LIMITED]: 'bg-orange-500 text-white',
  [LimitedType.WINTER_LIMITED]: 'bg-cyan-400 text-white',
  [LimitedType.LEG_LIMITED]: 'bg-purple-500 text-white',
  [LimitedType.BATTLE_LIMITED]: 'bg-red-600 text-white',
  [LimitedType.PARTY_LIMITED]: 'bg-red-400 text-white',
  [LimitedType.ACTIVITY_LIMITED]: 'bg-teal-500 text-white',
  [LimitedType.GRADUATE_LIMITED]: 'bg-indigo-500 text-white',
  [LimitedType.LOGIN_BONUS]: 'bg-emerald-500 text-white',
  [LimitedType.REWARD]: 'bg-yellow-600 text-white',
};

export const LimitedTypeBadge: React.FC<LimitedTypeBadgeProps> = ({
  limitedType,
  size = 'large',
}) => {
  // 恒常は表示しない
  if (limitedType === LimitedType.PERMANENT) {
    return null;
  }

  const sizeClasses = size === 'large'
    ? 'px-2 py-1 text-xs'
    : 'px-1.5 py-0.5 text-[10px]';

  const colorClass = LIMITED_TYPE_COLORS[limitedType] || 'bg-gray-500 text-white';
  const label = LIMITED_TYPE_LABELS[limitedType] || limitedType;

  return (
    <span
      className={`${sizeClasses} ${colorClass} font-medium rounded shadow-sm inline-block`}
    >
      {label}
    </span>
  );
};
