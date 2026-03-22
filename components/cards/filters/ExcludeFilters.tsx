'use client';

import React from 'react';
import type { CardFilter as CardFilterType } from '@/models/shared/Filter';
import { SkillEffectType, SkillSearchTarget, TraitEffectType } from '@/models/shared/enums';
import { SkillEffectFilter } from '@/components/cards/filters/SkillEffectFilter';
import { TraitEffectFilter } from '@/components/cards/filters/TraitEffectFilter';
import { ExpansionPanel } from '@/components/common/ExpansionPanel';
import { FilterWrapper } from '@/components/common/filters/FilterWrapper';
import { HelpTooltip } from '@/components/common/HelpTooltip';
import { toggleFilterList } from '@/services/card/cardFilterService';

interface ExcludeFiltersProps {
  filter: CardFilterType;
  updateFilter: (updates: Partial<CardFilterType>) => void;
}

export const ExcludeFilters: React.FC<ExcludeFiltersProps> = ({
  filter,
  updateFilter,
}) => {
  const toggleExcludeSkillEffect = (effect: SkillEffectType): void => {
    updateFilter(toggleFilterList(filter, 'excludeSkillEffects', effect));
  };

  const toggleExcludeSkillSearchTarget = (target: SkillSearchTarget): void => {
    updateFilter(toggleFilterList(filter, 'excludeSkillSearchTargets', target));
  };

  const toggleExcludeSkillMainEffect = (effect: SkillEffectType): void => {
    updateFilter(toggleFilterList(filter, 'excludeSkillMainEffects', effect));
  };

  const toggleExcludeTraitEffect = (effect: TraitEffectType): void => {
    updateFilter(toggleFilterList(filter, 'excludeTraitEffects', effect));
  };

  return (
    <ExpansionPanel
      title={
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
            除外
          </span>
          除外検索
          <HelpTooltip
            content="選択した条件に一致するカードを検索結果から除外します。"
            size={4}
          />
        </span>
      }
      defaultExpanded={false}
    >
      <div className="pt-2 space-y-2">
        {/* スキル効果除外 */}
        <FilterWrapper>
          <SkillEffectFilter
            selectedEffects={filter.excludeSkillEffects}
            selectedTargets={filter.excludeSkillSearchTargets}
            onToggleEffect={toggleExcludeSkillEffect}
            onToggleTarget={toggleExcludeSkillSearchTarget}
            selectedMainEffects={filter.excludeSkillMainEffects}
            onToggleMainEffect={toggleExcludeSkillMainEffect}
          />
        </FilterWrapper>

        {/* 特性効果除外 */}
        <FilterWrapper>
          <TraitEffectFilter
            selectedEffects={filter.excludeTraitEffects}
            onToggleEffect={toggleExcludeTraitEffect}
          />
        </FilterWrapper>
      </div>
    </ExpansionPanel>
  );
};
