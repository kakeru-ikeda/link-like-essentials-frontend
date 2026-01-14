'use client';

import React from 'react';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import { TraitEffectType } from '@/models/enums';
import { TRAIT_EFFECT_LABELS } from '@/mappers/enumMappers';
import { TRAIT_EFFECT_DESCRIPTIONS } from '@/config/traitEffects';
import { FILTER_COLOR_TRAIT_EFFECT } from '@/styles/colors';

interface TraitEffectFilterProps {
  selectedEffects: TraitEffectType[] | undefined;
  onToggleEffect: (effect: TraitEffectType) => void;
}

export const TraitEffectFilter: React.FC<TraitEffectFilterProps> = ({
  selectedEffects,
  onToggleEffect,
}) => {
  const traitEffectLabel = (effect: TraitEffectType) => TRAIT_EFFECT_LABELS[effect];
  const traitEffectTooltip = (effect: TraitEffectType) => TRAIT_EFFECT_DESCRIPTIONS[effect];

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        特性効果
      </label>
      <MultiSelectFilter
        values={Object.values(TraitEffectType)}
        selectedValues={selectedEffects}
        onToggle={onToggleEffect}
        label={traitEffectLabel}
        color={FILTER_COLOR_TRAIT_EFFECT}
        valueTooltip={traitEffectTooltip}
      />
    </div>
  );
};
