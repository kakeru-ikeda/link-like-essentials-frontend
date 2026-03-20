'use client';

import React from 'react';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import { SkillEffectType, TraitEffectType } from '@/models/shared/enums';
import {
  SKILL_EFFECT_LABELS,
  TRAIT_EFFECT_LABELS,
} from '@/mappers/enumMappers';
import { SKILL_EFFECT_DESCRIPTIONS } from '@/config/skillEffects';
import { TRAIT_EFFECT_DESCRIPTIONS } from '@/config/traitEffects';
import {
  FILTER_COLOR_SKILL_EFFECT,
  FILTER_COLOR_TRAIT_EFFECT,
} from '@/styles/colors';
import { HelpTooltip } from '@/components/common/HelpTooltip';

interface TraitEffectFilterProps {
  selectedEffects: TraitEffectType[] | undefined;
  selectedChainSkillEffects: SkillEffectType[] | undefined;
  onToggleEffect: (effect: TraitEffectType) => void;
  onToggleChainSkillEffect: (effect: SkillEffectType) => void;
}

export const TraitEffectFilter: React.FC<TraitEffectFilterProps> = ({
  selectedEffects,
  selectedChainSkillEffects,
  onToggleEffect,
  onToggleChainSkillEffect,
}) => {
  const traitEffectLabel = (effect: TraitEffectType) =>
    TRAIT_EFFECT_LABELS[effect];
  const traitEffectTooltip = (effect: TraitEffectType) =>
    TRAIT_EFFECT_DESCRIPTIONS[effect];
  const skillEffectLabel = (effect: SkillEffectType) =>
    SKILL_EFFECT_LABELS[effect];
  const skillEffectTooltip = (effect: SkillEffectType) =>
    SKILL_EFFECT_DESCRIPTIONS[effect];
  const isChainFilterVisible =
    selectedEffects?.includes(TraitEffectType.CHAIN) ||
    Boolean(selectedChainSkillEffects?.length);

  return (
    <div className="p-4">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          特性効果
        </label>
        <HelpTooltip
          content="特性効果を選択して、該当するカードのみを表示します。検索対象は特性効果に記載されているテキストのみです。"
          className="ml-2 mb-3"
          size={4}
        />
      </div>
      <MultiSelectFilter
        values={Object.values(TraitEffectType)}
        selectedValues={selectedEffects}
        onToggle={onToggleEffect}
        label={traitEffectLabel}
        color={FILTER_COLOR_TRAIT_EFFECT}
        valueTooltip={traitEffectTooltip}
      />

      {isChainFilterVisible && (
        <div className="mt-4">
          <div className="flex items-center">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              チェイン発動元のスキル効果
            </label>
            <HelpTooltip
              content="チェイン特性の説明文に含まれる「どのスキル効果を使用した時に発動するか」を絞り込みます。"
              className="ml-2 mb-2"
              size={4}
            />
          </div>
          <MultiSelectFilter
            values={Object.values(SkillEffectType)}
            selectedValues={selectedChainSkillEffects}
            onToggle={onToggleChainSkillEffect}
            label={skillEffectLabel}
            color={FILTER_COLOR_SKILL_EFFECT}
            valueTooltip={skillEffectTooltip}
          />
        </div>
      )}
    </div>
  );
};
