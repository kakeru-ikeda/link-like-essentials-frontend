'use client';

import React from 'react';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import { SkillEffectType, SkillSearchTarget } from '@/models/shared/enums';
import { SKILL_SEARCH_TARGET_LABELS } from '@/mappers/enumMappers';
import { useEffectKeywordsStore } from '@/store/effectKeywordsStore';
import {
  FILTER_COLOR_SKILL_EFFECT,
  FILTER_COLOR_SKILL_SEARCH_TARGET,
} from '@/styles/colors';
import { HelpTooltip } from '@/components/common/HelpTooltip';
import { ExpansionPanel } from '@/components/common/ExpansionPanel';
import { SkillMainEffectFilter } from '@/components/cards/filters/SkillMainEffectFilter';

interface SkillEffectFilterProps {
  selectedEffects: SkillEffectType[] | undefined;
  selectedTargets: SkillSearchTarget[] | undefined;
  onToggleEffect: (effect: SkillEffectType) => void;
  onToggleTarget: (target: SkillSearchTarget) => void;
  selectedMainEffects?: SkillEffectType[] | undefined;
  onToggleMainEffect?: (effect: SkillEffectType) => void;
}

export const SkillEffectFilter: React.FC<SkillEffectFilterProps> = ({
  selectedEffects,
  selectedTargets,
  onToggleEffect,
  onToggleTarget,
  selectedMainEffects,
  onToggleMainEffect,
}) => {
  const skillDescriptions = useEffectKeywordsStore((state) => state.skillDescriptions);
  const skillLabels = useEffectKeywordsStore((state) => state.skillLabels);
  const skillEffectTypes = useEffectKeywordsStore((state) => state.skillEffectTypes);

  const skillEffectLabel = (effect: SkillEffectType) => skillLabels[effect] ?? '';
  const skillSearchTargetLabel = (target: SkillSearchTarget) => SKILL_SEARCH_TARGET_LABELS[target];
  const skillEffectTooltip = (effect: SkillEffectType) => skillDescriptions[effect] ?? '';

  return (
    <div className="p-4">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          スキル効果
        </label>
        <HelpTooltip
          content="スキル効果を選択して、該当するカードのみを表示します。スキル文言全体を対象として検索します。"
          className="ml-2 mb-3"
          size={4}
        />
      </div>

      {/* スキル効果の選択 */}
      <div className="mb-4">
        <MultiSelectFilter
          values={skillEffectTypes}
          selectedValues={selectedEffects}
          onToggle={onToggleEffect}
          label={skillEffectLabel}
          color={FILTER_COLOR_SKILL_EFFECT}
          valueTooltip={skillEffectTooltip}
        />
      </div>

      {/* 検索範囲の選択 */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-2">
          検索範囲
        </label>
        <MultiSelectFilter
          values={Object.values(SkillSearchTarget)}
          selectedValues={selectedTargets}
          onToggle={onToggleTarget}
          label={skillSearchTargetLabel}
          color={FILTER_COLOR_SKILL_SEARCH_TARGET}
        />
      </div>

      {/* メイン効果検索 */}
      {onToggleMainEffect && (
        <ExpansionPanel
          title={
            <span className="flex items-center gap-1">
              メイン効果検索
              <HelpTooltip
                content="スキル文言の最初の文節で最初にヒットする効果を「メイン効果」として判定し、選択した効果に一致するカードのみを表示します。対象はスキル効果のみです。"
                size={4}
              />
            </span>
          }
          defaultExpanded={false}
        >
          <div className="pt-2">
            <SkillMainEffectFilter
              selectedEffects={selectedMainEffects}
              onToggleEffect={onToggleMainEffect}
            />
          </div>
        </ExpansionPanel>
      )}
    </div>
  );
};


