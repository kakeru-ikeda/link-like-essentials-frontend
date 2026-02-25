'use client';

import React, { useState, useEffect } from 'react';
import type { DeckAnalysis } from '@/models/deck/DeckAnalysis';
import { SectionHeading } from '@/components/common/SectionHeading';
import { HelpTooltip } from '@/components/common/HelpTooltip';
import {
  formatExcludedReasons,
  getDrawFormula,
  getSectionSpecificDrawCards,
  type SectionKey,
} from '@/services/deck/deckAnalyzerViewService';

interface DrawAnalyzerPanelProps {
  analysis: DeckAnalysis;
}

export const DrawAnalyzerPanel: React.FC<DrawAnalyzerPanelProps> = ({
  analysis,
}) => {
  const [selectedAccessories, setSelectedAccessories] = useState<
    Map<string, number>
  >(new Map());
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

  const accessoryCount = Array.from(selectedAccessories.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  const setAccessoryCount = (key: string, count: number): void => {
    setSelectedAccessories((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, Math.max(0, count));
      return newMap;
    });
  };

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
    <div className="pb-3">
      <div className="space-y-3 flex-1 pb-2">
        <SectionHeading accent="emerald">ドロー枚数</SectionHeading>
        <div className="px-1 flex items-end gap-1.5 flex-wrap">
          <div>
            <div className="text-[10px] text-gray-700 mb-1">手札上限</div>
            <div className="text-xl font-bold leading-none text-gray-800">
              {handSize}
              <span className="text-sm">枚</span>
            </div>
          </div>
          <div className="pb-0.5 text-gray-400 text-lg font-bold">=</div>
          <div className="pb-0.5 text-gray-400 text-base font-medium">(</div>
          <div>
            <div className="text-[9px] text-purple-700 mb-1">ドロー枠</div>
            <div className="text-xl font-bold leading-none text-purple-800">
              {analysis.drawCount}
              <span className="text-sm">枚</span>
            </div>
          </div>
          {accessoryCount > 0 && (
            <>
              <div className="pb-0.5 text-gray-400 text-lg font-bold">+</div>
              <div>
                <div className="text-[9px] text-green-700 mb-1">トークン</div>
                <div className="text-xl font-bold leading-none text-green-700">
                  {accessoryCount}
                  <span className="text-sm">枚</span>
                </div>
              </div>
            </>
          )}
          <div className="pb-0.5 text-gray-400 text-lg font-bold">-</div>
          <div>
            <div className="text-[9px] text-orange-700 mb-1">スキル利用</div>
            <div className="text-xl font-bold leading-none text-orange-800">
              {useCardCount}
              <span className="text-sm">枚</span>
            </div>
          </div>
          <div className="pb-0.5 text-gray-400 text-base font-medium">)</div>
          <div className="pb-0.5 text-gray-400 text-lg font-bold">+</div>
          <div>
            <div className="text-[9px] text-blue-700 mb-1">アンドロー枠</div>
            <div className="text-xl font-bold leading-none text-blue-700 inline-flex items-baseline gap-1">
              <span>{mainFormula.uncertainSlots}</span>
              <span className="text-sm">枚</span>
              <span className="inline-flex items-center">
                <HelpTooltip
                  content={
                    undrawCards.length > 0 ? (
                      <div className="space-y-2">
                        <div>
                          ドロー枠が手札上限に満たない場合はアンドロー特性を持つカードでもドローされます。
                        </div>
                        <div>
                          <div className="font-semibold mb-1">
                            【アンドロー枠対象カード】
                          </div>
                          <div className="space-y-0.5">
                            {undrawCards.map((c, idx) => (
                              <div key={idx}>
                                ・[{c.cardName}] {c.characterName}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          上記から{mainFormula.uncertainSlots}
                          枚がドロー対象となります。
                        </div>
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
          <span className="text-gray-700 font-medium">手札上限枚数</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setHandSize((s) => Math.max(1, s - 1))}
              disabled={handSize <= 1}
              className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
            >
              −
            </button>
            <span className="text-xs font-bold text-gray-700 w-5 text-center">
              {handSize}
            </span>
            <button
              onClick={() => setHandSize((s) => Math.min(8, s + 1))}
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
            <span className="text-gray-500">({accessoryCount}枚)</span>
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
                      onClick={() => setAccessoryCount(key, count - 1)}
                      disabled={count <= 0}
                      className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold text-green-700 w-6 text-center">
                      {count}
                    </span>
                    <button
                      onClick={() => setAccessoryCount(key, count + 1)}
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
                  [{item.card.cardName}] {item.card.characterName}（
                  {formatExcludedReasons(item.reasons)}）
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
                        <span className="text-green-700">
                          {accessoryCount}枚
                        </span>
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
