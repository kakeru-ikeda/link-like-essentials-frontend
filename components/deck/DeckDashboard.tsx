'use client';

import React, { useState, useEffect } from 'react';
import { DeckTitle } from '@/components/deck/DeckTitle';
import { DeckTypeSelect } from '@/components/deck/DeckTypeSelect';
import { SongSelect } from '@/components/deck/SongSelect';
import { CenterCardDisplay } from '@/components/deck/CenterCardDisplay';
import { LRCardsList } from '@/components/deck/LRCardsList';
import { Checkbox } from '@/components/common/Checkbox';
import { TextAreaWithModal } from '@/components/common/TextAreaWithModal';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';
import { useDeck } from '@/hooks/useDeck';
import { getCenterCard, getOtherLRCards } from '@/services/deckAnalysisService';
import { LiveGrandPrixSelect } from './LiveGrandPrixSelect';
import { LiveGrandPrixStageSelect } from './LiveGrandPrixStageSelect';
import { useLiveGrandPrixById } from '@/hooks/useLiveGrandPrix';
import { LiveGrandPrix, LiveGrandPrixDetail } from '@/models/LiveGrandPrix';
import { ExpansionPanel } from '@/components/common/ExpansionPanel';

interface DeckDashboardProps {
  showLimitBreak: boolean;
  onShowLimitBreakChange: (value: boolean) => void;
}

export const DeckDashboard: React.FC<DeckDashboardProps> = ({ showLimitBreak, onShowLimitBreakChange }) => {
  const { 
    deck, 
    updateDeckType, 
    updateDeckName, 
    updateDeckMemo, 
    updateSong,
    updateLiveGrandPrix,
    updateLiveGrandPrixStageWithConfirmation
  } = useDeck();
  
  const [selectedDeckType, setSelectedDeckType] = useState<DeckType | undefined>(deck?.deckType);

  // ライブグランプリの詳細を取得（選択されている場合のみ）
  const { liveGrandPrix, loading: lgpLoading } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

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

  const handleLiveGrandPrixStageChange = (detail: LiveGrandPrixDetail): void => {
    if (detail.id && detail.stageName) {
      // ステージに関連する楽曲情報を自動設定
      // GraphQLレスポンスではcategoryフィールドとして来る
      const songData = detail.song as any;
      const deckType = songData?.category || songData?.deckType;
      
      const song = detail.song ? {
        id: detail.song.id,
        songName: detail.song.songName,
        centerCharacter: detail.song.centerCharacter,
        participations: detail.song.participations,
        liveAnalyzerImageUrl: detail.song.liveAnalyzerImageUrl,
        deckType: deckType,
      } : undefined;
      
      // 確認付きで更新
      const success = updateLiveGrandPrixStageWithConfirmation(detail.id, detail.stageName, song);
      
      // デッキタイプも自動更新（確認がOKの場合のみ）
      if (success && deckType) {
        setSelectedDeckType(deckType);
      }
    } else {
      // クリア時
      updateLiveGrandPrixStageWithConfirmation('', '');
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg overflow-hidden">
      <DeckTitle 
        title={deck?.name || '新しいデッキ'}
        onTitleChange={updateDeckName}
      />
      
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
      <ExpansionPanel title="ライブグランプリ設定">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ライブアナライザ
        </label>
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

      {/* 上限解放表示切替 - 最下部に固定 */}
      <div className="border-t border-gray-200 pt-3 mt-auto">
        <Checkbox
          checked={showLimitBreak}
          onChange={onShowLimitBreakChange}
          label="上限解放数を表示"
        />
      </div>
    </div>
  );
};
