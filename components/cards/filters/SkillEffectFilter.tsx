import React from 'react';
import { MultiSelectFilter } from '@/components/common/filters/MultiSelectFilter';
import { Tooltip } from '@/components/common/Tooltip';
import {
  SkillEffectType,
  SkillSearchTarget,
  SKILL_EFFECT_LABELS,
  SKILL_SEARCH_TARGET_LABELS,
  SKILL_EFFECT_DESCRIPTIONS,
} from '@/constants/skillEffects';

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
          getLabel={(effect) => SKILL_EFFECT_LABELS[effect]}
          color="#043c78"
          renderCustomButton={(effect, isSelected, label) => (
            <Tooltip
              key={effect}
              content={SKILL_EFFECT_DESCRIPTIONS[effect]}
              position="top"
            >
              <button
                onClick={() => onToggleEffect(effect)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            </Tooltip>
          )}
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
          getLabel={(target) => SKILL_SEARCH_TARGET_LABELS[target]}
          color="#ee7800"
        />
      </div>
    </div>
  );
};
