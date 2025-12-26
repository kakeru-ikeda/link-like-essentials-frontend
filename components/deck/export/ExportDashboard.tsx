'use client';

import React from 'react';
import Image from 'next/image';
import { useDeck } from '@/hooks/useDeck';
import { getCenterCard, getOtherLRCards } from '@/services/deckAnalysisService';
import { CenterCardDisplay } from '@/components/deck/CenterCardDisplay';
import { LRCardsList } from '@/components/deck/LRCardsList';
import { EffectBadge } from '@/components/common/EffectBadge';
import { useLiveGrandPrixById } from '@/hooks/useLiveGrandPrix';

export const ExportDashboard: React.FC = () => {
  const { deck } = useDeck();

  // ライブグランプリの詳細を取得（選択されている場合のみ）
  const { liveGrandPrix } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

  // 選択中のステージ詳細を取得
  const selectedStageDetail = React.useMemo(() => {
    if (!liveGrandPrix || !deck?.liveGrandPrixDetailId) return null;
    return liveGrandPrix.details.find((detail) => detail.id === deck.liveGrandPrixDetailId) || null;
  }, [liveGrandPrix, deck?.liveGrandPrixDetailId]);

  // センターカードを取得
  const centerCard = React.useMemo(() => getCenterCard(deck), [deck]);

  // センター以外のLRカードを取得
  const otherLRCards = React.useMemo(() => getOtherLRCards(deck, centerCard), [deck, centerCard]);

  if (!deck) return null;

  return (
    <div className="w-full space-y-4">
      {/* デッキ情報 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold text-slate-700">デッキタイプ: </span>
          <span className="text-slate-600">{deck.deckType || '未設定'}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">楽曲: </span>
          <span className="text-slate-600">{deck.songName || '未設定'}</span>
        </div>
        {deck.liveGrandPrixEventName && (
          <div className="col-span-2">
            <span className="font-semibold text-slate-700">ライブグランプリ: </span>
            <span className="text-slate-600">{deck.liveGrandPrixEventName}</span>
            {selectedStageDetail && (
              <div className="mt-1 flex items-center gap-1">
                <EffectBadge
                  type="stage"
                  specialEffect={selectedStageDetail.specialEffect}
                />
                <EffectBadge
                  type="section"
                  sectionEffects={selectedStageDetail.sectionEffects}
                />
              </div>
            )}
          </div>
        )}
        {deck.score && (
          <div>
            <span className="font-semibold text-slate-700">参考スコア: </span>
            <span className="text-slate-600">{deck.score} 兆</span>
          </div>
        )}
      </div>

      {/* ライブアナライザ */}
      {deck.liveAnalyzerImageUrl && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">ライブアナライザ</h3>
          <img
            src={deck.liveAnalyzerImageUrl}
            alt="ライブアナライザ"
            crossOrigin="anonymous"
            className="w-full h-auto rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* LRカード情報 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">LRカード</h3>
        <div className="border border-gray-200 rounded-lg p-3">
          <CenterCardDisplay centerCard={centerCard} />
          <LRCardsList lrCards={otherLRCards} />
        </div>
      </div>

      {/* チャート */}
      {deck.memo && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">チャート</h3>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono">
              {deck.memo}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
