'use client';

import React, { useState, useEffect } from 'react';
import { DeckTitle } from '@/components/deck/DeckTitle';
import { DeckTypeSelect } from '@/components/deck/DeckTypeSelect';
import { SongSelect } from '@/components/deck/SongSelect';
import { Button } from '@/components/common/Button';
import { CenterCardDisplay } from '@/components/deck/CenterCardDisplay';
import { LRCardsList } from '@/components/deck/LRCardsList';
import { TextAreaWithModal } from '@/components/common/TextAreaWithModal';
import { ActiveEventBadge } from '@/components/common/ActiveEventBadge';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';
import { useDeck } from '@/hooks/useDeck';
import { getCenterCard, getOtherLRCards } from '@/services/deckAnalysisService';
import { LiveGrandPrixService } from '@/services/liveGrandPrixService';
import { LiveGrandPrixSelect } from './LiveGrandPrixSelect';
import { LiveGrandPrixStageSelect } from './LiveGrandPrixStageSelect';
import { useLiveGrandPrixById, useActiveLiveGrandPrix } from '@/hooks/useLiveGrandPrix';
import { LiveGrandPrix, LiveGrandPrixDetail } from '@/models/LiveGrandPrix';
import { ExpansionPanel } from '@/components/common/ExpansionPanel';
import { EffectBadge } from '@/components/common/EffectBadge';

export const DeckDashboard: React.FC = () => {
  const { 
    deck, 
    updateDeckType, 
    updateDeckName, 
    updateDeckMemo, 
    updateSong,
    updateLiveGrandPrix,
    updateLiveGrandPrixStageWithConfirmation,
    clearAllCards,
    saveDeck
  } = useDeck();
  
  const [selectedDeckType, setSelectedDeckType] = useState<DeckType | undefined>(deck?.deckType);

  // ライブグランプリの詳細を取得（選択されている場合のみ）
  const { liveGrandPrix, loading: lgpLoading } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

  // 開催中のライブグランプリを取得
  const { activeLiveGrandPrix } = useActiveLiveGrandPrix();

  // 選択中のステージ詳細を取得
  const selectedStageDetail = React.useMemo(() => {
    if (!liveGrandPrix || !deck?.liveGrandPrixDetailId) return null;
    return liveGrandPrix.details.find((detail) => detail.id === deck.liveGrandPrixDetailId) || null;
  }, [liveGrandPrix, deck?.liveGrandPrixDetailId]);

  // センターカードを取得（ビジネスロジックはserviceに委譲）
  const centerCard = React.useMemo(() => getCenterCard(deck), [deck]);

  // センター以外のLRカードを取得（ビジネスロジックはserviceに委譲）
  const otherLRCards = React.useMemo(() => getOtherLRCards(deck, centerCard), [deck, centerCard]);

  // deckが変更されたら同期
  useEffect(() => {
    setSelectedDeckType(deck?.deckType);
  }, [deck?.deckType]);

  const handleDeckTypeChange = (newDeckType: DeckType): void => {
    const success = updateDeckType(newDeckType);
    
    if (success) {
      setSelectedDeckType(newDeckType);
    }
    // キャンセルされた場合は元の値を保持（useEffectで同期される）
  };

  const handleSongChange = (song: Partial<Song>): void => {
    updateSong(song);
  };

  const handleLiveGrandPrixChange = (event: Partial<LiveGrandPrix>): void => {
    if (event.id && event.eventName) {
      updateLiveGrandPrix(event.id, event.eventName);
    } else {
      // クリア時
      updateLiveGrandPrix('', '');
    }
  };

  const handleLiveGrandPrixStageChange = (detail: LiveGrandPrixDetail | null): void => {
    if (detail?.id && detail.stageName) {
      // ステージに関連する楽曲情報を自動設定（ビジネスロジックはserviceに委譲）
      const song = LiveGrandPrixService.transformStageDetailToSong(detail);
      
      // 確認付きで更新
      const success = updateLiveGrandPrixStageWithConfirmation(detail.id, detail.stageName, song);
      
      // デッキタイプも自動更新（確認がOKの場合のみ）
      if (success && song?.deckType) {
        setSelectedDeckType(song.deckType);
      }
    } else {
      // クリア時
      updateLiveGrandPrixStageWithConfirmation('', '');
    }
  };

  const clearDeck = (): void => {
    clearAllCards();
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg overflow-hidden">
      {/* タイトル＆ボタン */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <DeckTitle 
            title={deck?.name || '新しいデッキ'}
            onTitleChange={updateDeckName}
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="secondary" onClick={clearDeck}>
            クリア
          </Button>
          <Button onClick={saveDeck}>
            公開
          </Button>
        </div>
      </div>
      
      {/* デッキタイプ＆楽曲選択 */}
      <div className="flex gap-4">
        <DeckTypeSelect
          value={selectedDeckType}
          onChange={handleDeckTypeChange}
          className="w-40"
        />

        <SongSelect
          deckType={deck?.deckType}
          value={deck?.songId}
          onChange={handleSongChange}
          className="flex-1"
          disabled={!!deck?.liveGrandPrixDetailId && !!deck?.liveAnalyzerImageUrl}
        />
      </div>

      {/* ライブグランプリ選択 */}
      <ExpansionPanel 
        title={
          <div className="flex items-center gap-2">
            <span>ライブグランプリ設定</span>
            {activeLiveGrandPrix && <ActiveEventBadge />}
          </div>
        }
      >
        <div className="flex gap-4">
          <LiveGrandPrixSelect
            deckType={deck?.deckType}
            value={deck?.liveGrandPrixId}
            onChange={handleLiveGrandPrixChange}
            className="flex-1"
          />

          <LiveGrandPrixStageSelect
            details={liveGrandPrix?.details}
            value={deck?.liveGrandPrixDetailId}
            onChange={handleLiveGrandPrixStageChange}
            disabled={lgpLoading || !deck?.liveGrandPrixId}
            className="w-48"
          />
        </div>
      </ExpansionPanel>

      {/* ライブアナライザ */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="block text-sm font-medium text-gray-700">
            ライブアナライザ
          </label>
          {selectedStageDetail && (
            <div className="flex items-center gap-1">
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
        <div className="border border-gray-200 rounded-lg p-2">
          {deck?.liveAnalyzerImageUrl ? (
            <img
              src={deck.liveAnalyzerImageUrl}
              alt="ライブアナライザ"
              className="w-full h-auto rounded-lg border border-gray-300"
            />
          ) : (
            <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg text-gray-400">
              <div className="text-center">
                <div className="text-sm">楽曲未設定</div>
                <div className="text-xs mt-1">ライブアナライザが表示されます</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* センターカードのスペシャルアピール */}
      <div className="border border-gray-200 rounded-lg p-2">
        <CenterCardDisplay centerCard={centerCard} />
        <LRCardsList lrCards={otherLRCards} />
      </div>

      {/* チャート */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-gray-200 pt-3">
        <TextAreaWithModal
          value={deck?.memo || ''}
          onChange={updateDeckMemo}
          label="チャート"
          placeholder="チャートを入力..."
          rows={3}
          modalTitle="チャート"
          modalRows={15}
          className="flex-1"
        />
      </div>
    </div>
  );
};
