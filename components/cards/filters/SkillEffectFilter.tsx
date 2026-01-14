'use client';

import React from 'react';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import { Tooltip } from '@/components/common/Tooltip';
import { SkillEffectType, SkillSearchTarget } from '@/models/enums';
import {
  SKILL_EFFECT_LABELS,
  SKILL_SEARCH_TARGET_LABELS,
} from '@/mappers/enumMappers';
import { SKILL_EFFECT_DESCRIPTIONS } from '@/config/skillEffects';

interface SkillEffectFilterProps {
  selectedEffects: SkillEffectType[] | undefined;
  selectedTargets: SkillSearchTarget[] | undefined;
  onToggleEffect: (effect: SkillEffectType) => void;
  onToggleTarget: (target: SkillSearchTarget) => void;
}

export const SkillEffectFilter: React.FC<SkillEffectFilterProps> = ({
  selectedEffects,
  selectedTargets,
  onToggleEffect,
  onToggleTarget,
}) => {
  const skillEffectLabel = (effect: SkillEffectType) =>
    SKILL_EFFECT_LABELS[effect];
  const skillSearchTargetLabel = (skillSearchTarget: SkillSearchTarget) =>
    SKILL_SEARCH_TARGET_LABELS[skillSearchTarget];
  const skillEffectTooltip = (effect: SkillEffectType) =>
    SKILL_EFFECT_DESCRIPTIONS[effect];

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        スキル効果
      </label>
      {/* スキル効果の選択 */}
      <div className="mb-4">
        <MultiSelectFilter
          values={Object.values(SkillEffectType)}
          selectedValues={selectedEffects}
          onToggle={onToggleEffect}
          label={skillEffectLabel}
          color="#10b981" // emerald-500
          valueTooltip={skillEffectTooltip}
        />
      </div>

      {/* 検索範囲の選択 */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">
          検索範囲
        </label>
        <MultiSelectFilter
          values={Object.values(SkillSearchTarget)}
          selectedValues={selectedTargets}
          onToggle={onToggleTarget}
          label={skillSearchTargetLabel}
          color="#f97316" // orange-500
        />
      </div>
    </div>
  );
};
