'use client';

import React, { useState } from 'react';
import type {
  DeckAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';
import { SkillEffectType, TraitConditionType } from '@/models/shared/enums';
import { DeckAnalyzerCardItem } from '@/components/deck-builder/DeckAnalyzerCardItem';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Sparkles, Zap } from 'lucide-react';
import { SKILL_EFFECT_COLORS } from '@/styles/colors';

interface SkillsAnalyzerPanelProps {
  analysis: DeckAnalysis;
}

export const SkillsAnalyzerPanel: React.FC<SkillsAnalyzerPanelProps> = ({
  analysis,
}) => {
  const [selectedEffect, setSelectedEffect] = useState<SkillEffectType>(
    'HEART_CAPTURE' as SkillEffectType
  );

  const currentEffect = analysis.requiredEffects.find(
    (effect) => effect.effectType === selectedEffect
  );

  return (
    <div>
      <div className="border-b border-gray-100 pb-3 mb-3">
        <div className="grid grid-cols-4 gap-1.5">
          {analysis.requiredEffects.map((effect) => {
            const colors = SKILL_EFFECT_COLORS[effect.effectType];
            const isSelected = selectedEffect === effect.effectType;
            return (
              <button
                key={effect.effectType}
                onClick={() => setSelectedEffect(effect.effectType)}
                className="flex flex-col items-center justify-center rounded px-1.5 py-2 transition-colors border-2"
                style={{
                  borderColor: colors.border,
                  backgroundColor: isSelected ? colors.bg : '#ffffff',
                }}
              >
                <span
                  className="text-[8px] leading-tight text-center mb-0.5 w-full truncate px-0.5"
                  style={{ color: isSelected ? colors.text : colors.border }}
                >
                  {effect.label}
                </span>
                <span
                  className="flex items-baseline gap-0.5 text-lg font-bold leading-none"
                  style={{ color: isSelected ? '#ffffff' : '#3e3e3e' }}
                >
                  <span className="leading-none">{effect.totalUniqueCards}</span>
                  <span className="text-[9px] font-medium leading-none">枚</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {currentEffect && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <SectionHeading accent="rose">{currentEffect.label}</SectionHeading>
              <span className="text-xs font-medium text-blue-600">
                {currentEffect.totalUniqueCards}枚
              </span>
            </div>

            {currentEffect.skillMatches.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Zap className="w-3.5 h-3.5 text-yellow-500" />
                  <span>スキル ({currentEffect.skillMatches.length})</span>
                </div>
                <div className="space-y-1 pl-4">
                  {currentEffect.skillMatches.map((match, idx) => (
                    <DeckAnalyzerCardItem
                      key={`skill-${match.card.id}-${idx}`}
                      match={match as DetectedSkillEffect}
                      keywords={currentEffect.keywords}
                      showCondition
                      dense
                    />
                  ))}
                </div>
              </div>
            )}

            {currentEffect.traitMatches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>特性</span>
                </div>

                {currentEffect.traitMatches.map((group) => (
                  <div key={group.condition} className="space-y-1 pl-4">
                    <div
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${getConditionBadgeClassName(group.condition)}`}
                    >
                      {group.conditionLabel} ({group.items.length})
                    </div>
                    <div className="space-y-1">
                      {group.items.map((match, idx) => (
                        <DeckAnalyzerCardItem
                          key={`trait-${match.card.id}-${idx}`}
                          match={match as DetectedTraitEffect}
                          keywords={currentEffect.keywords}
                          showCondition
                          dense
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentEffect.totalUniqueCards === 0 && (
              <p className="text-xs text-gray-500 italic">
                該当するカードがありません
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const getConditionBadgeClassName = (condition: TraitConditionType): string => {
  switch (condition) {
    case TraitConditionType.DRAW:
      return 'bg-sky-50 text-sky-700';
    case TraitConditionType.HEART_COLLECT:
      return 'bg-rose-50 text-rose-700';
    case TraitConditionType.NONE:
      return 'bg-emerald-50 text-emerald-700';
    default:
      return 'bg-emerald-50 text-emerald-700';
  }
};
