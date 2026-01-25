'use client';

import React from 'react';
import { Tooltip } from './Tooltip';
import { LiveGrandPrixSectionEffect } from '@/models/features/LiveGrandPrix';

interface EffectBadgeProps {
  type: 'stage' | 'section';
  specialEffect?: string;
  sectionEffects?: LiveGrandPrixSectionEffect[];
  className?: string;
}

/**
 * ステージ効果・セクション効果を表示するバッジコンポーネント
 * ツールチップで詳細情報を表示
 */
export const EffectBadge: React.FC<EffectBadgeProps> = ({
  type,
  specialEffect,
  sectionEffects,
  className = '',
}) => {
  // ステージ効果のツールチップコンテンツ
  const renderStageEffectTooltip = (): React.ReactNode => {
    if (!specialEffect) {
      return <div className="text-xs">ステージ効果なし</div>;
    }
    return (
      <div className="text-xs whitespace-pre-wrap max-w-xs">
        {specialEffect}
      </div>
    );
  };

  // セクション効果のツールチップコンテンツ
  const renderSectionEffectsTooltip = (): React.ReactNode => {
    if (!sectionEffects || sectionEffects.length === 0) {
      return <div className="text-xs">セクション効果なし</div>;
    }
    
    // sectionOrderでソート
    const sortedEffects = [...sectionEffects].sort((a, b) => a.sectionOrder - b.sectionOrder);
    
    return (
      <div className="text-xs space-y-1 max-w-xs">
        {sortedEffects.map((section) => (
          <div key={section.id} className="border-b border-gray-600 pb-1 last:border-b-0 last:pb-0">
            <div className="font-semibold text-blue-300">{section.sectionName}</div>
            <div className="whitespace-pre-wrap text-gray-200">{section.effect}</div>
          </div>
        ))}
      </div>
    );
  };

  // バッジの表示内容
  const badgeContent = type === 'stage' ? 'ステージ効果' : 'セクション効果';
  
  // バッジの色
  const badgeColor = type === 'stage' 
    ? 'bg-purple-100 text-purple-800 border-purple-300' 
    : 'bg-blue-100 text-blue-800 border-blue-300';

  const tooltipContent = type === 'stage' 
    ? renderStageEffectTooltip() 
    : renderSectionEffectsTooltip();

  return (
    <Tooltip content={tooltipContent} position="top">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeColor} cursor-help ${className}`}
      >
        {badgeContent}
      </span>
    </Tooltip>
  );
};
