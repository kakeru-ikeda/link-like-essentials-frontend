'use client';

import React from 'react';
import type {
  DeckAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';
import { DeckAnalyzerCardItem } from '@/components/deck-builder/DeckAnalyzerCardItem';
import { ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react';

interface DeckAnalyzerPanelProps {
  analysis: DeckAnalysis;
  isOpen: boolean;
  onToggle: () => void;
}

export const DeckAnalyzerPanel: React.FC<DeckAnalyzerPanelProps> = ({
  analysis,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">デッキ分析</span>
          <span className="text-sm text-gray-500">
            ({analysis.assignedSlots}/{analysis.totalSlots}枚編成中)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {analysis.requiredEffects.map((effect) => (
            <div key={effect.effectType} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {effect.label}
                </h3>
                <span className="text-sm font-medium text-blue-600">
                  {effect.totalUniqueCards}枚
                </span>
              </div>

              {effect.skillMatches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>スキル ({effect.skillMatches.length})</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    {effect.skillMatches.map((match, idx) => (
                      <DeckAnalyzerCardItem
                        key={`skill-${match.card.id}-${idx}`}
                        match={match as DetectedSkillEffect}
                        showCondition
                      />
                    ))}
                  </div>
                </div>
              )}

              {effect.traitMatches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>特性</span>
                  </div>

                  {effect.traitMatches.map((group) => (
                    <div key={group.condition} className="pl-6 space-y-2">
                      <div className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block">
                        {group.conditionLabel} ({group.items.length})
                      </div>
                      {group.items.map((match, idx) => (
                        <DeckAnalyzerCardItem
                          key={`trait-${match.card.id}-${idx}`}
                          match={match as DetectedTraitEffect}
                          showCondition
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {effect.totalUniqueCards === 0 && (
                <p className="text-sm text-gray-500 italic">
                  該当するカードがありません
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
