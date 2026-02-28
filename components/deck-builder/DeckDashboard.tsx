'use client';

import React, { useState, useEffect } from 'react';
import { DeckTitle } from '@/components/deck-builder/DeckTitle';
import { DeckTypeSelect } from '@/components/deck-builder/DeckTypeSelect';
import { SongSelect } from '@/components/deck-builder/SongSelect';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { CenterCardDisplay } from '@/components/deck-builder/CenterCardDisplay';
import { LRCardsList } from '@/components/deck-builder/LRCardsList';
import { ExpandableTextArea } from '@/components/common/ExpandableTextArea';
import { ActiveEventBadge } from '@/components/shared/ActiveEventBadge';
import { Song } from '@/models/song/Song';
import { DeckType } from '@/models/shared/enums';
import { useDeck } from '@/hooks/deck/useDeck';
import {
  getCenterCard,
  getOtherLRCards,
} from '@/services/deck/deckAnalysisService';
import { DeckService } from '@/services/deck/deckService';
import { DeckSlotMapping } from '@/config/deckSlots';
import { LiveGrandPrixSelect } from './LiveGrandPrixSelect';
import { LiveGrandPrixStageSelect } from './LiveGrandPrixStageSelect';
import { GradeChallengeSelect } from './GradeChallengeSelect';
import { GradeChallengeStageSelect } from './GradeChallengeStageSelect';
import {
  useLiveGrandPrixById,
  useActiveLiveGrandPrix,
} from '@/hooks/deck/useLiveGrandPrix';
import {
  LiveGrandPrix,
  LiveGrandPrixDetail,
} from '@/models/live-grand-prix/LiveGrandPrix';
import { useGradeChallengeById } from '@/hooks/deck/useGradeChallenge';
import {
  GradeChallenge,
  GradeChallengeDetail,
} from '@/models/grade-challenge/GradeChallenge';
import { EffectBadge } from '@/components/shared/EffectBadge';
import { DeckPublishModal } from '@/components/deck-publish/DeckPublishModal';
import { DeckPublishSuccessDialog } from '@/components/deck-publish/DeckPublishSuccessDialog';
import { useModal } from '@/hooks/ui/useModal';
import { PublishedDeck } from '@/models/published-deck/PublishedDeck';
import { HelpTooltip } from '@/components/common/HelpTooltip';
import { useDeckAnalysis } from '@/hooks/deck/useDeckAnalysis';
import { DrawAnalyzerPanel } from '@/components/deck-builder/DrawAnalyzerPanel';
import { SkillsAnalyzerPanel } from '@/components/deck-builder/SkillsAnalyzerPanel';
import { DeckDashboardTabs } from '@/components/deck-builder/DeckDashboardTabs';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Settings, FileText, Layers, Sparkles } from 'lucide-react';
import {
  EVENT_COLOR_GRADE_CHALLENGE,
  EVENT_COLOR_LIVE_GRAND_PRIX,
} from '@/styles/colors';
import { hexToRgba } from '@/utils/colorUtils';
import { scoreFromParts, scoreToParts } from '@/utils/scoreUtils';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';

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
    updateGradeChallenge,
    updateGradeChallengeStage,
    clearAllCards,
  } = useDeck();

  const { isPublishModalOpen, openPublishModal, closePublishModal } =
    useModal();
  const [selectedDeckType, setSelectedDeckType] = useState<
    DeckType | undefined
  >(deck?.deckType);
  const [publishSuccessLink, setPublishSuccessLink] = useState<string | null>(
    null
  );
  const [publishSuccessUnlisted, setPublishSuccessUnlisted] =
    useState<boolean>(false);
  const [publishSuccessName, setPublishSuccessName] = useState<string | null>(
    null
  );
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [isMainSlotWarningOpen, setMainSlotWarningOpen] =
    useState<boolean>(false);
  const [eventType, setEventType] = useState<
    'liveGrandPrix' | 'gradeChallenge'
  >(deck?.gradeChallengeId ? 'gradeChallenge' : 'liveGrandPrix');
  const [unfilledMainSlots, setUnfilledMainSlots] = useState<DeckSlotMapping[]>(
    []
  );
  const [activeTabId, setActiveTabId] = useState<string>('settings');
  const [scoreKei, setScoreKei] = useState<number>(0);
  const [scoreCho, setScoreCho] = useState<number>(0);

  const { analysis } = useDeckAnalysis(deck ?? null);
  const { isSp } = useResponsiveDevice();
  const isEventStageMissing = Boolean(
    (deck?.liveGrandPrixId && !deck?.liveGrandPrixDetailId) ||
      (deck?.gradeChallengeId && !deck?.gradeChallengeDetailId)
  );
  const eventTypeColors = {
    liveGrandPrix: EVENT_COLOR_LIVE_GRAND_PRIX,
    gradeChallenge: EVENT_COLOR_GRADE_CHALLENGE,
  } as const;

  // ライブグランプリの詳細を取得（選択されている場合のみ）
  const { liveGrandPrix, loading: lgpLoading } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

  // グレードチャレンジの詳細を取得（選択されている場合のみ）
  const { gradeChallenge, loading: gcLoading } = useGradeChallengeById(
    deck?.gradeChallengeId || '',
    !deck?.gradeChallengeId
  );

  // 開催中のライブグランプリを取得
  const { activeLiveGrandPrix } = useActiveLiveGrandPrix();

  // 開催中イベントバッジ表示判定
  const hasActiveEvent = Boolean(activeLiveGrandPrix);

  // 選択中のステージ詳細を取得
  const selectedLiveGrandPrixDetail = React.useMemo(() => {
    if (!liveGrandPrix || !deck?.liveGrandPrixDetailId) return null;
    return (
      liveGrandPrix.details.find(
        (detail) => detail.id === deck.liveGrandPrixDetailId
      ) || null
    );
  }, [liveGrandPrix, deck?.liveGrandPrixDetailId]);

  const selectedGradeChallengeDetail = React.useMemo(() => {
    if (!gradeChallenge || !deck?.gradeChallengeDetailId) return null;
    return (
      gradeChallenge.details.find(
        (detail) => detail.id === deck.gradeChallengeDetailId
      ) || null
    );
  }, [gradeChallenge, deck?.gradeChallengeDetailId]);

  const selectedEventDetail = React.useMemo<
    LiveGrandPrixDetail | GradeChallengeDetail | null
  >(() => {
    return eventType === 'gradeChallenge'
      ? selectedGradeChallengeDetail
      : selectedLiveGrandPrixDetail;
  }, [eventType, selectedGradeChallengeDetail, selectedLiveGrandPrixDetail]);

  // センターカードを取得（ビジネスロジックはserviceに委譲）
  const centerCard = React.useMemo(() => getCenterCard(deck), [deck]);

  // センター以外のLRカードを取得（ビジネスロジックはserviceに委譲）
  const otherLRCards = React.useMemo(
    () => getOtherLRCards(deck, centerCard),
    [deck, centerCard]
  );

  // deckが変更されたら同期
  useEffect(() => {
    setSelectedDeckType(deck?.deckType);
  }, [deck?.deckType]);

  // スコアを京・兆に分解して同期
  useEffect(() => {
    const { kei, cho } = scoreToParts(deck?.score ?? 0);
    setScoreKei(kei);
    setScoreCho(cho);
  }, [deck?.score]);

  // 既存のイベント選択に合わせてタブを同期
  useEffect(() => {
    if (deck?.gradeChallengeId) {
      setEventType('gradeChallenge');
      return;
    }
    if (deck?.liveGrandPrixId) {
      setEventType('liveGrandPrix');
    }
  }, [deck?.gradeChallengeId, deck?.liveGrandPrixId]);

  const handleEventTypeChange = (
    nextType: 'liveGrandPrix' | 'gradeChallenge'
  ): void => {
    setEventType(nextType);
    if (nextType === 'gradeChallenge') {
      updateLiveGrandPrix('', '');
      updateLiveGrandPrixStage(null);
      return;
    }
    updateGradeChallenge('', '');
    updateGradeChallengeStage(null);
  };

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

  const handleLiveGrandPrixStageChange = (
    detail: LiveGrandPrixDetail | null
  ): void => {
    updateLiveGrandPrixStage(detail);
  };

  const handleGradeChallengeChange = (event: Partial<GradeChallenge>): void => {
    if (event.id && event.title) {
      updateGradeChallenge(event.id, event.title);
    } else {
      // クリア時
      updateGradeChallenge('', '');
    }
  };

  const handleGradeChallengeStageChange = (
    detail: GradeChallengeDetail | null
  ): void => {
    updateGradeChallengeStage(detail);
  };

  const handleKeiChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const newKei = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(newKei) || newKei < 0) return;
    setScoreKei(newKei);
    const total = scoreFromParts(newKei, scoreCho);
    updateScore(total === 0 ? undefined : total);
  };

  const handleChoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const newCho = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(newCho) || newCho < 0 || newCho > 9999) return;
    setScoreCho(newCho);
    const total = scoreFromParts(scoreKei, newCho);
    updateScore(total === 0 ? undefined : total);
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

  const handleOpenPublishModal = (): void => {
    const emptyMainSlots = DeckService.getUnfilledMainSlots(deck);
    const isDefaultDeckName = deck?.name?.startsWith('デッキ');
    const isSongNotSelected = !deck?.songId;

    if (
      emptyMainSlots.length > 0 ||
      isDefaultDeckName ||
      isSongNotSelected ||
      isEventStageMissing
    ) {
      setUnfilledMainSlots(emptyMainSlots);
      setMainSlotWarningOpen(true);
      return;
    }

    openPublishModal();
  };

  const handleCloseMainSlotWarning = (): void => {
    setMainSlotWarningOpen(false);
    setUnfilledMainSlots([]);
  };

  const DASHBOARD_TABS = [
    {
      id: 'settings',
      label: 'デッキ',
      icon: <Settings className="w-3.5 h-3.5" />,
      color: 'blue' as const,
    },
    {
      id: 'chart',
      label: 'チャート',
      icon: <FileText className="w-3.5 h-3.5" />,
      color: 'amber' as const,
    },
    {
      id: 'draw',
      label: 'ドロー',
      icon: <Layers className="w-3.5 h-3.5" />,
      color: 'emerald' as const,
    },
    {
      id: 'skills',
      label: 'スキル',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: 'purple' as const,
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg overflow-hidden min-w-0">
      {/* 固定: タイトル＆ボタン */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <DeckTitle
            title={deck?.name || '新しいデッキ'}
            onTitleChange={updateDeckName}
          />
        </div>
        <Button
          onClick={handleOpenPublishModal}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400"
        >
          公開
        </Button>
      </div>

      {/* 固定: デッキタイプ＆楽曲選択 */}
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
          disabled={
            !!deck?.liveGrandPrixDetailId || !!deck?.gradeChallengeDetailId
          }
        />
      </div>

      {/* タブ: 設定 / 分析 */}
      <DeckDashboardTabs
        tabs={DASHBOARD_TABS}
        activeTabId={activeTabId}
        onChangeTab={setActiveTabId}
      >
        {/* タブコンテンツ: 設定 */}
        {activeTabId === 'settings' && (
          <div className="flex flex-col gap-4">
            {/* イベント設定（LGP/GC切り替え） */}
            <div>
              <SectionHeading
                accent="blue"
                trailing={
                  <>
                    <HelpTooltip
                      content="イベントを選択すると、対応する楽曲が自動的に指定されます。また、楽曲を選択すると、ステージ効果およびセクション効果が自動的に設定されます。"
                      position="top"
                      className="mb-0.5"
                      size={4}
                    />
                    {hasActiveEvent && <ActiveEventBadge />}
                  </>
                }
              >
                イベント設定
              </SectionHeading>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEventTypeChange('liveGrandPrix')}
                    className="px-3 py-1.5 rounded-full text-sm border transition"
                    style={(() => {
                      const color = eventTypeColors.liveGrandPrix;
                      const isActive = eventType === 'liveGrandPrix';
                      return {
                        backgroundColor: isActive ? color : hexToRgba(color, 0.12),
                        borderColor: color,
                        color: isActive ? '#ffffff' : color,
                      };
                    })()}
                  >
                    ライブグランプリ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEventTypeChange('gradeChallenge')}
                    className="px-3 py-1.5 rounded-full text-sm border transition"
                    style={(() => {
                      const color = eventTypeColors.gradeChallenge;
                      const isActive = eventType === 'gradeChallenge';
                      return {
                        backgroundColor: isActive ? color : hexToRgba(color, 0.12),
                        borderColor: color,
                        color: isActive ? '#ffffff' : color,
                      };
                    })()}
                  >
                    グレードチャレンジ
                  </button>
                </div>
                {eventType === 'liveGrandPrix' ? (
                  <div
                    className={`flex min-w-0 ${isSp ? 'flex-col gap-3' : 'flex-row gap-4'}`}
                  >
                    <LiveGrandPrixSelect
                      deckType={deck?.deckType}
                      value={deck?.liveGrandPrixId}
                      onChange={handleLiveGrandPrixChange}
                      className={isSp ? 'w-full' : 'flex-1 min-w-0'}
                    />
                    <LiveGrandPrixStageSelect
                      details={liveGrandPrix?.details}
                      value={deck?.liveGrandPrixDetailId}
                      onChange={handleLiveGrandPrixStageChange}
                      disabled={lgpLoading || !deck?.liveGrandPrixId}
                      className={isSp ? 'w-full' : 'w-48 flex-shrink-0'}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex min-w-0 ${isSp ? 'flex-col gap-3' : 'flex-row gap-4'}`}
                  >
                    <GradeChallengeSelect
                      deckType={deck?.deckType}
                      value={deck?.gradeChallengeId}
                      onChange={handleGradeChallengeChange}
                      className={isSp ? 'w-full' : 'flex-1 min-w-0'}
                    />
                    <GradeChallengeStageSelect
                      details={gradeChallenge?.details}
                      value={deck?.gradeChallengeDetailId}
                      onChange={handleGradeChallengeStageChange}
                      disabled={gcLoading || !deck?.gradeChallengeId}
                      className={isSp ? 'w-full' : 'w-48 flex-shrink-0'}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ライブアナライザ */}
            <div>
              <SectionHeading
                accent="blue"
                trailing={
                  selectedEventDetail && (
                    <>
                      <EffectBadge
                        type="stage"
                        specialEffect={selectedEventDetail.specialEffect}
                      />
                      <EffectBadge
                        type="section"
                        sectionEffects={selectedEventDetail.sectionEffects}
                      />
                    </>
                  )
                }
              >
                ライブアナライザ
              </SectionHeading>
              <div className="border border-gray-200 rounded-lg p-2">
                {deck?.liveAnalyzerImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={deck.liveAnalyzerImageUrl}
                    alt="ライブアナライザ"
                    className="w-full h-auto rounded-lg border border-gray-300"
                  />
                ) : (
                  <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg text-gray-400">
                    <div className="text-center">
                      <div className="text-sm">楽曲未設定</div>
                      <div className="text-xs mt-1">
                        ライブアナライザが表示されます
                      </div>
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
              <SectionHeading
                accent="blue"
                trailing={
                  <HelpTooltip
                    content="このデッキでプレイしたときのスコアを、参考スコアとして入力してください。デッキ公開時に表示されます。"
                    position="top"
                    className="mb-0.5"
                    size={4}
                  />
                }
              >
                参考スコア
              </SectionHeading>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={scoreKei === 0 ? '' : scoreKei}
                    onChange={handleKeiChange}
                    placeholder="0"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <span className="text-sm text-gray-700 font-medium">京</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    step="1"
                    value={scoreKei === 0 && scoreCho === 0 ? '' : scoreCho}
                    onChange={handleChoChange}
                    placeholder="0"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                    兆 <span className="text-[0.85em]">LOVE</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* タブコンテンツ: チャート */}
        {activeTabId === 'chart' && (
          <div className="flex flex-col h-full">
            <SectionHeading accent="amber">チャート</SectionHeading>
            <ExpandableTextArea
              value={deck?.memo || ''}
              onChange={updateDeckMemo}
              placeholder="チャートを入力..."
              rows={12}
              modalTitle="チャート"
              modalRows={15}
              className="flex-1"
              template={`[1セク]\n\n[2セク]\n\n[3セク]\n\n[4セク]\n\n[5セク]\n`}
            />
          </div>
        )}

        {/* タブコンテンツ: ドロー */}
        {activeTabId === 'draw' && (
          analysis && analysis.assignedSlots > 0 ? (
            <DrawAnalyzerPanel analysis={analysis} />
          ) : (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <div className="text-center">
                <div className="text-sm">カードが編成されていません</div>
                <div className="text-xs mt-1">デッキにカードを追加してください</div>
              </div>
            </div>
          )
        )}

        {/* タブコンテンツ: スキル */}
        {activeTabId === 'skills' && (
          analysis && analysis.assignedSlots > 0 ? (
            <SkillsAnalyzerPanel analysis={analysis} />
          ) : (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <div className="text-center">
                <div className="text-sm">カードが編成されていません</div>
                <div className="text-xs mt-1">デッキにカードを追加してください</div>
              </div>
            </div>
          )
        )}
      </DeckDashboardTabs>

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

      <Modal
        isOpen={isMainSlotWarningOpen}
        onClose={handleCloseMainSlotWarning}
        title="未設定の項目があります。"
      >
        <div className="space-y-4">
          {unfilledMainSlots.length > 0 && (
            <>
              <p className="text-sm text-gray-700">
                公開する前にメイン枠すべてにカードを編成してください。
                以下の枠が未設定です。
              </p>
              <ul className="list-disc list-inside space-y-1">
                {unfilledMainSlots.map((slot) => (
                  <li key={slot.slotId} className="text-sm text-gray-900">
                    {slot.characterName}
                  </li>
                ))}
              </ul>
            </>
          )}

          {deck?.name?.startsWith('デッキ') && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700">
                公開する前に、初期デッキ名を変更してください。
              </p>
              <HelpTooltip
                content="初期デッキ名とは「デッキ1」「デッキ2」のように「デッキ」から始まる名前です。わかりやすい名前に変更してから公開してください。"
                position="right"
                size={4}
              />
            </div>
          )}

          {!deck?.songId && (
            <p className="text-sm text-gray-700">
              公開する前に、楽曲を選択してください。
            </p>
          )}
          {isEventStageMissing && (
            <p className="text-sm text-gray-700">
              イベントが選択されていますが、ステージが未選択です。ステージを選択してください。
            </p>
          )}
          <div className="flex justify-end">
            <Button onClick={handleCloseMainSlotWarning}>編成に戻る</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
