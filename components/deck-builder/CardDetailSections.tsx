'use client';

import React from 'react';
import { Card } from '@/models/domain/Card';
import { HighlightText } from '@/components/common/HighlightText';
import { useCardHighlight } from '@/hooks/card/useCardHighlight';

interface CardDetailSectionsProps {
  card: Card;
  variant?: 'full' | 'compact';
  showStats?: boolean;
  showAcquisition?: boolean;
}

export const CardDetailSections: React.FC<CardDetailSectionsProps> = ({
  card,
  variant = 'full',
  showStats = false,
  showAcquisition = false,
}) => {
  const isCompact = variant === 'compact';
  const { highlightKeywords } = useCardHighlight();
  const skillSectionKeywords = [...highlightKeywords.general, ...highlightKeywords.skillTargets];
  const traitSectionKeywords = [
    ...highlightKeywords.general,
    ...highlightKeywords.traitTargets,
    ...highlightKeywords.skillTargets,
  ];

  // スタイルクラス定義
  const sectionClass = isCompact
    ? 'bg-white rounded-lg p-3'
    : 'border border-gray-200 rounded-lg p-4';

  const baseTitleClass = isCompact
    ? 'text-sm font-bold mb-2'
    : 'text-sm font-semibold mb-2';

  const nameClass = isCompact
    ? 'text-xs font-bold'
    : 'text-base font-medium';

  const effectClass = isCompact
    ? 'text-xs text-gray-600 whitespace-pre-line'
    : 'text-sm text-gray-600 whitespace-pre-line';

  const apBadgeClass = 'px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded whitespace-nowrap';

  const containerClass = isCompact ? 'space-y-3' : 'space-y-6';

  return (
    <div className={containerClass}>
      {/* ステータス */}
      {showStats && card.detail?.stats && (
        <div className={sectionClass}>
          <h4 className={`${baseTitleClass} text-gray-700`}>ステータス</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between bg-pink-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">スマイル</span>
              <span className="text-lg font-bold text-pink-600">{card.detail.stats.smile.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-blue-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">ピュア</span>
              <span className="text-lg font-bold text-blue-600">{card.detail.stats.pure.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-purple-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">クール</span>
              <span className="text-lg font-bold text-purple-600">{card.detail.stats.cool.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 rounded px-3 py-2">
              <span className="text-sm text-gray-700">メンタル</span>
              <span className="text-lg font-bold text-green-600">{card.detail.stats.mental.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* スペシャルアピール */}
      {card.detail?.specialAppeal && (
        <div className={sectionClass}>
          <h4 className={`${baseTitleClass} text-green-600`}>スペシャルアピール</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`${nameClass} ${isCompact ? 'text-green-600' : 'text-gray-900 font-bold'}`}>
                <HighlightText text={card.detail.specialAppeal.name} keywords={skillSectionKeywords} />
              </span>
              {card.detail.specialAppeal.ap && (
                <span className={apBadgeClass}>AP {card.detail.specialAppeal.ap}</span>
              )}
            </div>
            {card.detail.specialAppeal.effect && (
              <p className={`${effectClass} ${isCompact ? '' : 'mt-1'}`}>
                <HighlightText text={card.detail.specialAppeal.effect} keywords={skillSectionKeywords} />
              </p>
            )}
          </div>
        </div>
      )}

      {/* スキル */}
      {card.detail?.skill && (
        <div className={sectionClass}>
          <h4 className={`${baseTitleClass} text-blue-600`}>スキル</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`${nameClass} ${isCompact ? 'text-blue-600' : 'text-gray-900 font-bold'}`}>
                <HighlightText text={card.detail.skill.name} keywords={skillSectionKeywords} />
              </span>
              {card.detail.skill.ap && (
                <span className={apBadgeClass}>AP {card.detail.skill.ap}</span>
              )}
            </div>
            {card.detail.skill.effect && (
              <p className={`${effectClass} ${isCompact ? '' : 'mt-1'}`}>
                <HighlightText text={card.detail.skill.effect} keywords={skillSectionKeywords} />
              </p>
            )}
          </div>
        </div>
      )}

      {/* 特性 */}
      {card.detail?.trait && (
        <div className={sectionClass}>
          <h4 className={`${baseTitleClass} text-purple-600`}>特性</h4>
          <div className="space-y-1">
            <span className={`${nameClass} ${isCompact ? 'text-purple-600' : 'text-gray-900 font-bold'}`}>
              <HighlightText text={card.detail.trait.name} keywords={traitSectionKeywords} />
            </span>
            {card.detail.trait.effect && (
              <p className={`${effectClass} ${isCompact ? '' : 'mt-1'}`}>
                <HighlightText text={card.detail.trait.effect} keywords={traitSectionKeywords} />
              </p>
            )}
          </div>
        </div>
      )}

      {/* トークン */}
      {((card.accessories && card.accessories.length > 0) || (card.detail?.accessories && card.detail.accessories.length > 0)) && (
        <div className={sectionClass}>
          <h4 className={`${baseTitleClass} text-orange-600`}>トークン</h4>
          <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
            {(card.accessories || card.detail?.accessories || []).map((accessory) => (
              <div
                key={accessory.id}
                className={isCompact ? 'border-l-2 border-blue-500 pl-2' : 'bg-gray-50 rounded p-3'}
              >
                <div className={`flex items-${isCompact ? 'center' : 'start'} ${isCompact ? 'gap-2 mb-1' : 'justify-between gap-2 mb-1'}`}>
                  <p className={`${isCompact ? 'text-xs font-bold text-blue-600' : 'text-sm font-medium text-blue-600'}`}>
                    <HighlightText text={accessory.name} keywords={skillSectionKeywords} />
                  </p>
                  {accessory.ap && (
                    <span className={apBadgeClass}>AP {accessory.ap}</span>
                  )}
                </div>
                {accessory.effect && (
                  <p className={`${isCompact ? 'text-xs text-gray-600 whitespace-pre-line mb-1' : 'text-xs text-gray-600 mt-1'}`}>
                    <HighlightText text={accessory.effect} keywords={skillSectionKeywords} />
                  </p>
                )}
                {accessory.traitName && (
                  <div className={isCompact ? 'text-xs' : 'mt-2 pt-2 border-t border-gray-200'}>
                    <p className={isCompact ? 'font-bold text-purple-700' : 'text-xs font-medium text-purple-700'}>
                      <HighlightText text={accessory.traitName} keywords={traitSectionKeywords} />
                    </p>
                    {accessory.traitEffect && (
                      <p className={`${isCompact ? 'text-gray-600 ml-1 whitespace-pre-line' : 'text-xs text-gray-600 mt-1'}`}>
                        <HighlightText text={isCompact ? `: ${accessory.traitEffect}` : accessory.traitEffect} keywords={traitSectionKeywords} />
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 入手方法 */}
      {showAcquisition && card.detail?.acquisitionMethod && (
        <div className={sectionClass}>
          <h4 className={`${baseTitleClass} text-gray-700`}>入手方法</h4>
          <p className="text-sm text-gray-600">{card.detail.acquisitionMethod}</p>
        </div>
      )}

      {/* 実装日 */}
      {showAcquisition && card.releaseDate && (
        <div className={sectionClass}>
          <h4 className={`${baseTitleClass} text-gray-700`}>実装日</h4>
          <p className="text-sm text-gray-600">{new Date(card.releaseDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};
