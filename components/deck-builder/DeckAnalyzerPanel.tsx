'use client';

import React, { useState, useEffect } from 'react';
import type {
  DeckAnalysis,
  DetectedSkillEffect,
  DetectedTraitEffect,
} from '@/models/deck/DeckAnalysis';
import { SkillEffectType, TraitConditionType } from '@/models/shared/enums';
import { DeckAnalyzerCardItem } from '@/components/deck-builder/DeckAnalyzerCardItem';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';
import { HelpTooltip } from '@/components/common/HelpTooltip';
import { SKILL_EFFECT_COLORS } from '@/styles/colors';
import {
  formatExcludedReasons,
  getDrawFormula,
  getSectionSpecificDrawCards,
  type SectionKey,
} from '@/services/deck/deckAnalyzerViewService';

interface DeckAnalyzerPanelProps {
  analysis: DeckAnalysis;
  isOpen: boolean;
  onToggle: () => void;
  /** タブ内に埋め込む場合 true。トグルボタン・ポップアップを使わずインライン表示にする */
  embedded?: boolean;
  /** 表示モード。draw: ドロー枚数のみ / skills: スキル内訳のみ / all: 両方(デフォルト) */
  mode?: 'draw' | 'skills' | 'all';
}

export const DeckAnalyzerPanel: React.FC<DeckAnalyzerPanelProps> = ({
  analysis,
  isOpen,
  onToggle,
  embedded = false,
  mode = 'all',
}) => {
  const { isSp } = useResponsiveDevice();
  const [selectedEffect, setSelectedEffect] = useState<SkillEffectType>(
    SkillEffectType.HEART_CAPTURE
  );

  const [selectedAccessories, setSelectedAccessories] = useState<Map<string, number>>(
    new Map()
  );

  const [handSize, setHandSize] = useState<number>(8);

  useEffect(() => {
    const newMap = new Map<string, number>();
    analysis.accessoryCards.forEach((info) => {
      const key = `${info.card.id}-${info.accessoryIndex}`;
      newMap.set(key, selectedAccessories.get(key) ?? 0);
    });
    setSelectedAccessories(newMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis.accessoryCards]);

  const accessoryCount = Array.from(selectedAccessories.values()).reduce((sum, count) => sum + count, 0);

  const setAccessoryCount = (key: string, count: number) => {
    setSelectedAccessories((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, Math.max(0, count));
      return newMap;
    });
  };

  const currentEffect = analysis.requiredEffects.find(
    (effect) => effect.effectType === selectedEffect
  );

  const shouldShowPanel = embedded || isSp || isOpen;

  return (
    <div className={`relative ${isSp || embedded ? 'w-full max-w-full' : 'inline-flex items-center'}`}>
      {!isSp && !embedded && (
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
            isOpen
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>デッキ分析</span>
          <span className="text-xs text-gray-500">
            {analysis.assignedSlots}/{analysis.totalSlots}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      {shouldShowPanel && (
        <div className={`${
          embedded
            ? 'w-full'
            : isSp
            ? 'w-full max-w-full'
            : 'absolute right-0 bottom-full z-30 mb-2 w-[min(90vw,420px)]'
        }`}>
          {!isSp && !embedded && (
            <div className="absolute -bottom-2 right-4 h-3 w-3 rotate-45 border-r border-b border-gray-200 bg-white" />
          )}
          <div className={`overflow-y-auto ${
            embedded
              ? 'w-full'
              : `rounded-lg border border-gray-200 bg-white shadow-lg ${isSp ? 'max-h-[80vh]' : 'h-[750px]'}`
          }`}>
            {!embedded && (
              <div className="sticky top-0 z-10 bg-white flex items-center justify-between border-b border-gray-100 px-3 py-2">
                <div className="text-sm font-semibold text-gray-800">デッキ分析</div>
                <div className="text-xs text-gray-500">
                  {analysis.assignedSlots}/{analysis.totalSlots}枚編成中
                </div>
              </div>
            )}

            {(mode === 'all' || mode === 'draw') && analysis.assignedSlots > 0 && (
              <div className={mode === 'all' ? 'border-b border-gray-100 px-3 py-2' : 'px-0 py-0'}>
                <DrawCountSummary
                  analysis={analysis}
                  accessoryCount={accessoryCount}
                  selectedAccessories={selectedAccessories}
                  onSetAccessoryCount={setAccessoryCount}
                  handSize={handSize}
                  onHandSizeChange={setHandSize}
                />
              </div>
            )}

            {(mode === 'all' || mode === 'skills') && (
              <>
            <div className="border-b border-gray-100 px-3 py-2">
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

            <div className="space-y-4 px-3 py-3">
              {currentEffect && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <SectionHeading accent="rose">
                      {currentEffect.label}
                    </SectionHeading>
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
                            className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${getConditionBadgeClassName(
                              group.condition
                            )}`}
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
              </>
            )}
          </div>
        </div>
      )}
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

/**
 * ドロー枚数サマリー
 */
const DrawCountSummary: React.FC<{
  analysis: DeckAnalysis;
  accessoryCount: number;
  selectedAccessories: Map<string, number>;
  onSetAccessoryCount: (key: string, count: number) => void;
  handSize: number;
  onHandSizeChange: (size: number) => void;
}> = ({ analysis, accessoryCount, selectedAccessories, onSetAccessoryCount, handSize, onHandSizeChange }) => {
  const sections = [
    {
      label: 'セクション1',
      key: 'section1',
      drawCount: analysis.drawCountBySection.section1,
    },
    {
      label: 'セクション2',
      key: 'section2',
      drawCount: analysis.drawCountBySection.section2,
    },
    {
      label: 'セクション3',
      key: 'section3',
      drawCount: analysis.drawCountBySection.section3,
    },
    {
      label: 'セクション4',
      key: 'section4',
      drawCount: analysis.drawCountBySection.section4,
    },
    {
      label: 'セクション5',
      key: 'section5',
      drawCount: analysis.drawCountBySection.section5,
    },
    {
      label: 'フィーバー',
      key: 'sectionFever',
      drawCount: analysis.drawCountBySection.sectionFever,
    },
  ] satisfies Array<{ label: string; key: SectionKey; drawCount: number }>;

  const useCardCount = 1;
  const mainFormula = getDrawFormula(
    analysis.drawCount,
    handSize,
    useCardCount,
    accessoryCount
  );

  const undrawCards = analysis.excludedCards
    .filter((item) => item.reasons.includes('UN_DRAW'))
    .map((item) => item.card);

  return (
    <div className="pb-3 border-b border-gray-200">
      <div className="space-y-3 flex-1 pb-2">
        <SectionHeading accent="emerald">
          ドロー枚数
        </SectionHeading>
        <div className="px-1 flex items-end gap-1.5 flex-wrap">
          <div>
            <div className="text-[10px] text-gray-700 mb-1">
              手札上限
            </div>
            <div className="text-xl font-bold leading-none text-gray-800">
              {handSize}<span className="text-sm">枚</span>
            </div>
          </div>
          <div className="pb-0.5 text-gray-400 text-lg font-bold">=</div>
          <div className="pb-0.5 text-gray-400 text-base font-medium">(</div>
          <div>
            <div className="text-[9px] text-purple-700 mb-1">
              ドロー枠
            </div>
            <div className="text-xl font-bold leading-none text-purple-800">
              {analysis.drawCount}<span className="text-sm">枚</span>
            </div>
          </div>
          {accessoryCount > 0 && (
            <>
              <div className="pb-0.5 text-gray-400 text-lg font-bold">+</div>
              <div>
                <div className="text-[9px] text-green-700 mb-1">
                  トークン
                </div>
                <div className="text-xl font-bold leading-none text-green-700">
                  {accessoryCount}<span className="text-sm">枚</span>
                </div>
              </div>
            </>
          )}
          <div className="pb-0.5 text-gray-400 text-lg font-bold">-</div>
          <div>
            <div className="text-[9px] text-orange-700 mb-1">
              スキル利用
            </div>
            <div className="text-xl font-bold leading-none text-orange-800">
              {useCardCount}<span className="text-sm">枚</span>
            </div>
          </div>
          <div className="pb-0.5 text-gray-400 text-base font-medium">)</div>
          <div className="pb-0.5 text-gray-400 text-lg font-bold">+</div>
          <div>
            <div className="text-[9px] text-blue-700 mb-1">
              アンドロー枠
            </div>
            <div className="text-xl font-bold leading-none text-blue-700 inline-flex items-baseline gap-1">
              <span>{mainFormula.uncertainSlots}</span>
              <span className="text-sm">枚</span>
              <span className="inline-flex items-center">
                <HelpTooltip
                  content={
                    undrawCards.length > 0 ? (
                      <div className="space-y-2">
                        <div>ドロー枠が手札上限に満たない場合はアンドロー特性を持つカードでもドローされます。</div>
                        <div>
                          <div className="font-semibold mb-1">【アンドロー枠対象カード】</div>
                          <div className="space-y-0.5">
                            {undrawCards.map((c, idx) => (
                              <div key={idx}>・[{c.cardName}] {c.characterName}</div>
                            ))}
                          </div>
                        </div>
                        <div>上記から{mainFormula.uncertainSlots}枚がドロー対象となります。</div>
                      </div>
                    ) : (
                      'ドロー枠が手札上限に満たない場合はアンドロー特性を持つカードでもドローされます。'
                    )
                  }
                  size={4}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[11px] leading-tight text-gray-600 py-2 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-gray-700 font-medium">手札上限枚数</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onHandSizeChange(Math.max(1, handSize - 1))}
              disabled={handSize <= 1}
              className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
            >
              −
            </button>
            <span className="text-xs font-bold text-gray-700 w-5 text-center">
              {handSize}
            </span>
            <button
              onClick={() => onHandSizeChange(Math.min(8, handSize + 1))}
              disabled={handSize >= 8}
              className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>
      {analysis.accessoryCards.length > 0 && (
        <div className="text-[11px] leading-tight text-gray-600 py-2 space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-green-700 font-medium">トークンカード</span>
            <span className="text-gray-500">
              ({accessoryCount}枚)
            </span>
          </div>
          <div className="space-y-1">
            {analysis.accessoryCards.map((info) => {
              const key = `${info.card.id}-${info.accessoryIndex}`;
              const count = selectedAccessories.get(key) ?? 1;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-[11px] font-medium text-gray-800 truncate">
                      {info.accessory.name}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      [{info.card.cardName}] {info.card.characterName}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => onSetAccessoryCount(key, count - 1)}
                      disabled={count <= 0}
                      className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold text-green-700 w-6 text-center">
                      {count}
                    </span>
                    <button
                      onClick={() => onSetAccessoryCount(key, count + 1)}
                      className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="text-[11px] leading-tight text-gray-600 py-2 space-y-1">
        <div className="flex flex-wrap gap-1.5">
          {analysis.excludedCards.length === 0 ? (
            <span className="text-gray-500">除外対象なし</span>
          ) : (
            <div>
              <div>除外枠</div>
              {analysis.excludedCards.map((item) => (
                <span
                  key={item.card.id}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700"
                >
                  [{item.card.cardName}] {item.card.characterName}（{formatExcludedReasons(item.reasons)}）
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <SectionHeading accent="purple" size="xs">
          セクション別詳細
        </SectionHeading>
        <div className="space-y-1">
          {sections.map((section) => {
            const sectionFormula = getDrawFormula(
              section.drawCount,
              handSize,
              useCardCount,
              accessoryCount
            );
            const sectionSpecificDrawCards = getSectionSpecificDrawCards(
              analysis,
              section.key
            );
            return (
              <div
                key={section.label}
                className="rounded-md border border-purple-100 bg-white px-2.5 py-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-600">
                    {section.label}
                  </span>
                  <span className="text-[11px] font-medium text-purple-700">
                    (
                    <span
                      className={
                        section.drawCount > analysis.drawCount
                          ? 'text-red-600'
                          : 'text-purple-700'
                      }
                    >
                      {section.drawCount}枚
                    </span>
                    {accessoryCount > 0 && (
                      <>
                        <span className="text-gray-400"> + </span>
                        <span className="text-green-700">{accessoryCount}枚</span>
                      </>
                    )}
                    <span className="text-gray-400"> - </span>
                    <span className="text-orange-800">{useCardCount}枚</span>
                    <span className="text-gray-400">) + </span>
                    <span className="text-blue-700">
                      {sectionFormula.uncertainSlots}枚
                    </span>
                  </span>
                </div>
                {sectionSpecificDrawCards.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sectionSpecificDrawCards.map((card) => (
                      <span
                        key={card.id}
                        className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] text-orange-700"
                      >
                        [{card.cardName}] {card.characterName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


