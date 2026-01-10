'use client';

import React, { useState, useEffect } from 'react';
import { DeckTitle } from '@/components/deck/DeckTitle';
import { DeckTypeSelect } from '@/components/deck/DeckTypeSelect';
import { SongSelect } from '@/components/deck/SongSelect';
import { Button } from '@/components/common/Button';
import { CenterCardDisplay } from '@/components/deck/CenterCardDisplay';
import { LRCardsList } from '@/components/deck/LRCardsList';
import { ExpandableTextArea } from '@/components/common/ExpandableTextArea';
import { ActiveEventBadge } from '@/components/common/ActiveEventBadge';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';
import { useDeck } from '@/hooks/useDeck';
import { getCenterCard, getOtherLRCards } from '@/services/deckAnalysisService';
import { LiveGrandPrixSelect } from './LiveGrandPrixSelect';
import { LiveGrandPrixStageSelect } from './LiveGrandPrixStageSelect';
import { useLiveGrandPrixById, useActiveLiveGrandPrix } from '@/hooks/useLiveGrandPrix';
import { LiveGrandPrix, LiveGrandPrixDetail } from '@/models/LiveGrandPrix';
import { ExpansionPanel } from '@/components/common/ExpansionPanel';
import { EffectBadge } from '@/components/common/EffectBadge';
import { DeckPublishModal } from '@/components/deck/DeckPublishModal';
import { DeckPublishSuccessDialog } from '@/components/deck/DeckPublishSuccessDialog';
import { useModal } from '@/hooks/useModal';
import { PublishedDeck } from '@/models/PublishedDeck';

export const DeckDashboard: React.FC = () => {
  const { 
    deck, 
    updateDeckType, 
    updateDeckName, 
    updateDeckMemo, 
    updateScore,
    updateSong,
    updateLiveGrandPrix,
    updateLiveGrandPrixStage,
    clearAllCards,
  } = useDeck();
  
  const { isPublishModalOpen, openPublishModal, closePublishModal } = useModal();
  const [selectedDeckType, setSelectedDeckType] = useState<DeckType | undefined>(deck?.deckType);
  const [publishSuccessLink, setPublishSuccessLink] = useState<string | null>(null);
  const [publishSuccessUnlisted, setPublishSuccessUnlisted] = useState<boolean>(false);
  const [publishSuccessName, setPublishSuccessName] = useState<string | null>(null);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);

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
    updateDeckType(newDeckType);
    setSelectedDeckType(newDeckType);
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
    updateLiveGrandPrixStage(detail);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === '') {
      updateScore(undefined);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        updateScore(numValue);
      }
    }
  };

  const clearDeck = (): void => {
    clearAllCards();
  };

  const handlePublished = (publishedDeck: PublishedDeck): void => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const deckPath = `/decks/${publishedDeck.id}`;
    const fullUrl = baseUrl ? `${baseUrl}${deckPath}` : deckPath;
    setPublishSuccessLink(fullUrl);
    setPublishSuccessUnlisted(publishedDeck.isUnlisted);
    setPublishSuccessName(publishedDeck.deck.name);
    setSuccessDialogOpen(true);
  };

  const handleCloseSuccessDialog = (): void => {
    setSuccessDialogOpen(false);
    setPublishSuccessLink(null);
    setPublishSuccessUnlisted(false);
    setPublishSuccessName(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg overflow-hidden min-w-0">
      {/* タイトル＆ボタン */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <DeckTitle 
            title={deck?.name || '新しいデッキ'}
            onTitleChange={updateDeckName}
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="secondary" onClick={clearDeck}>
            クリア
          </Button>
          <Button onClick={openPublishModal} className="bg-green-600 hover:bg-green-700 disabled:bg-green-400">
            公開
          </Button>
        </div>
      </div>
      
      {/* デッキタイプ＆楽曲選択 */}
      <div className="flex gap-4 min-w-0">
        <DeckTypeSelect
          value={selectedDeckType}
          onChange={handleDeckTypeChange}
          className="w-40 flex-shrink-0"
        />

        <SongSelect
          deckType={deck?.deckType}
          value={deck?.songId}
          onChange={handleSongChange}
          className="flex-1 min-w-0"
          disabled={!!deck?.liveGrandPrixDetailId}
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
        <div className="flex gap-4 min-w-0">
          <LiveGrandPrixSelect
            deckType={deck?.deckType}
            value={deck?.liveGrandPrixId}
            onChange={handleLiveGrandPrixChange}
            className="flex-1 min-w-0"
          />

          <LiveGrandPrixStageSelect
            details={liveGrandPrix?.details}
            value={deck?.liveGrandPrixDetailId}
            onChange={handleLiveGrandPrixStageChange}
            disabled={lgpLoading || !deck?.liveGrandPrixId}
            className="w-48 flex-shrink-0"
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

      {/* 参考スコア */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          参考スコア
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="1"
            value={deck?.score ?? ''}
            onChange={handleScoreChange}
            placeholder="0"
            className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 pointer-events-none font-medium">
            兆
          </div>
        </div>
      </div>

      {/* チャート */}
      <div className="flex-1 flex flex-col min-h-0 border-gray-200">
        <ExpandableTextArea
          value={deck?.memo || ''}
          onChange={updateDeckMemo}
          label="チャート"
          placeholder="チャートを入力..."
          rows={3}
          modalTitle="チャート"
          modalRows={15}
          className="flex-1"
          template={`[1セク]\n\n[2セク]\n\n[3セク]\n\n[4セク]\n\n[5セク]\n`}
        />
      </div>

      {/* 公開確認モーダル */}
      <DeckPublishModal
        isOpen={isPublishModalOpen}
        onClose={closePublishModal}
        onPublished={handlePublished}
      />

      <DeckPublishSuccessDialog
        isOpen={isSuccessDialogOpen}
        shareUrl={publishSuccessLink}
        isUnlisted={publishSuccessUnlisted}
        deckName={publishSuccessName}
        onClose={handleCloseSuccessDialog}
      />
    </div>
  );
};
