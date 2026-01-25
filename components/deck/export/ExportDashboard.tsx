'use client';

import React from 'react';
import { useDeck } from '@/hooks/deck/useDeck';
import { useLiveGrandPrixById } from '@/hooks/features/useLiveGrandPrix';
import { Deck } from '@/models/domain/Deck';

interface ExportDashboardProps {
  deck?: Deck | null;
  variant?: 'default' | 'compact';
}

export const ExportDashboard: React.FC<ExportDashboardProps> = ({
  deck: deckProp,
  variant = 'default',
}) => {
  const { deck: deckFromStore } = useDeck();
  const deck = deckProp ?? deckFromStore;
  const isCompact = variant === 'compact';

  const gridTextSize = isCompact ? 'text-xs' : 'text-2xl';
  const headingSize = isCompact ? 'text-sm ' : 'text-3xl';
  const subHeadingSize = isCompact ? 'text-sm' : 'text-3xl';
  const badgeTextSize = isCompact ? 'text-[11px]' : 'text-xl';
  const chartTextSize = isCompact ? 'text-[11px]' : 'text-3xl';

  const aceInfo = React.useMemo(() => {
    if (!deck?.aceSlotId || !deck?.slots) return null;
    const aceSlot = deck.slots.find((slot) => slot.slotId === deck.aceSlotId);
    if (!aceSlot || !aceSlot.card) return null;
    return {
      characterName: aceSlot.card.characterName,
      cardName: aceSlot.card.cardName,
    };
  }, [deck?.aceSlotId, deck?.slots]);

  // ライブグランプリの詳細を取得（選択されている場合のみ）
  const { liveGrandPrix } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

  // 選択中のステージ詳細を取得
  const selectedStageDetail = React.useMemo(() => {
    if (!liveGrandPrix || !deck?.liveGrandPrixDetailId) return null;
    return (
      liveGrandPrix.details.find(
        (detail) => detail.id === deck.liveGrandPrixDetailId
      ) || null
    );
  }, [liveGrandPrix, deck?.liveGrandPrixDetailId]);

  if (!deck) return null;

  return (
    <div className="w-full space-y-4">
      {/* デッキ情報 */}
      <div className={`grid grid-cols-2 gap-4 ${gridTextSize}`}>
        <div>
          <span className={`${headingSize} font-semibold text-slate-700`}>
            楽曲:
          </span>
          <span className={`${headingSize} text-slate-600`}>
            {deck.songName || '未設定'}
          </span>
        </div>
        {deck.liveGrandPrixEventName && (
          <div className="col-span-2">
            <span className={`${headingSize} font-semibold text-slate-700`}>
              ライブグランプリ:
            </span>
            <span className={`${headingSize} text-slate-600`}>
              {deck.liveGrandPrixEventName}
              {deck.liveGrandPrixStageName
                ? ` ステージ${deck.liveGrandPrixStageName}`
                : ''}
            </span>
            {selectedStageDetail && (
              <div className="mt-3 space-y-2">
                {selectedStageDetail.specialEffect && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                    <span
                      className={`${subHeadingSize} font-semibold text-purple-800`}
                    >
                      ステージ効果:
                    </span>
                    <br />
                    <span
                      className={`${isCompact ? 'text-[11px]' : 'text-lg'} text-purple-700`}
                    >
                      {selectedStageDetail.specialEffect}
                    </span>
                  </div>
                )}
                {selectedStageDetail.sectionEffects.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <div
                      className={`${subHeadingSize} font-semibold text-blue-800 mb-1.5`}
                    >
                      セクション効果:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStageDetail.sectionEffects.map((section) => (
                        <div
                          key={section.id}
                          className={`bg-white border border-blue-300 rounded px-2 py-1 ${badgeTextSize}`}
                        >
                          <span className="font-medium text-blue-900">
                            {section.sectionName}:{' '}
                          </span>
                          <span className="text-blue-700">
                            {section.effect}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="col-span-2">
          <span className={`${headingSize} font-semibold text-slate-700`}>
            エースカード:
          </span>
          <span className={`${headingSize} text-slate-600`}>
            {aceInfo
              ? `[${aceInfo.cardName}] ${aceInfo.characterName}`
              : '未設定'}
          </span>
        </div>
        {deck.score && (
          <div>
            <span className={`${headingSize} font-semibold text-slate-700`}>
              参考スコア:
            </span>
            <span className={`${headingSize} text-slate-600`}>
              {deck.score} 兆 <span className="text-[0.85em]">LOVE</span>
            </span>
          </div>
        )}
      </div>

      {/* ライブアナライザ */}
      {deck.liveAnalyzerImageUrl && (
        <div>
          <h3 className={`${headingSize} font-semibold text-slate-700 mb-2`}>
            ライブアナライザ
          </h3>
          <img
            src={deck.liveAnalyzerImageUrl}
            alt="ライブアナライザ"
            crossOrigin="anonymous"
            className="w-full h-auto rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* チャート */}
      {deck.memo && (
        <div>
          <h3 className={`${headingSize} font-semibold text-slate-700 mb-2`}>
            チャート
          </h3>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <pre
              className={`${chartTextSize} text-slate-600 whitespace-pre-wrap font-mono`}
            >
              {deck.memo}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
