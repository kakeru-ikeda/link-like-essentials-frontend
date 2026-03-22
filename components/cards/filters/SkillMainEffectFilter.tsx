'use client';

import React from 'react';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import { SkillEffectType } from '@/models/shared/enums';
import { useEffectKeywordsStore } from '@/store/effectKeywordsStore';
import { FILTER_COLOR_SKILL_EFFECT } from '@/styles/colors';

interface SkillMainEffectFilterProps {
  selectedEffects: SkillEffectType[] | undefined;
  onToggleEffect: (effect: SkillEffectType) => void;
}

export const SkillMainEffectFilter: React.FC<SkillMainEffectFilterProps> = ({
  selectedEffects,
  onToggleEffect,
}) => {
  const skillDescriptions = useEffectKeywordsStore((state) => state.skillDescriptions);
  const skillLabels = useEffectKeywordsStore((state) => state.skillLabels);
  const skillEffectTypes = useEffectKeywordsStore((state) => state.skillEffectTypes);

  const skillEffectLabel = (effect: SkillEffectType) => skillLabels[effect] ?? '';
  const skillEffectTooltip = (effect: SkillEffectType) => skillDescriptions[effect] ?? '';

  return (
    <MultiSelectFilter
      values={skillEffectTypes}
      selectedValues={selectedEffects}
      onToggle={onToggleEffect}
      label={skillEffectLabel}
      color={FILTER_COLOR_SKILL_EFFECT}
      valueTooltip={skillEffectTooltip}
    />
  );
};
