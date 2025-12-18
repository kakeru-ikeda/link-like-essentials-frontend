'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiPencil } from 'react-icons/hi2';
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

interface DeckDashboardProps {
  showLimitBreak: boolean;
  onShowLimitBreakChange: (value: boolean) => void;
}

export const DeckDashboard: React.FC<DeckDashboardProps> = ({ showLimitBreak, onShowLimitBreakChange }) => {
  const { deck, updateDeckType, updateDeckName, updateDeckMemo, updateSong } = useDeck();
  const [selectedDeckType, setSelectedDeckType] = useState<DeckType | undefined>(deck?.deckType);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(deck?.name || '新しいデッキ');
  const inputRef = useRef<HTMLInputElement>(null);

  // センターカードを取得（ビジネスロジックはserviceに委譲）
  const centerCard = React.useMemo(() => getCenterCard(deck), [deck]);

  // センター以外のLRカードを取得（ビジネスロジックはserviceに委譲）
  const otherLRCards = React.useMemo(() => getOtherLRCards(deck, centerCard), [deck, centerCard]);

  // deckが変更されたら同期
  useEffect(() => {
    setSelectedDeckType(deck?.deckType);
    setTempName(deck?.name || '新しいデッキ');
  }, [deck?.deckType, deck?.name]);

  // 編集モード時にフォーカス
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

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

  const handleNameClick = (): void => {
    setIsEditingName(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTempName(e.target.value);
  };

  const handleNameBlur = (): void => {
    const trimmedName = tempName.trim();
    if (trimmedName && trimmedName !== deck?.name) {
      updateDeckName(trimmedName);
    } else if (!trimmedName) {
      setTempName(deck?.name || '新しいデッキ');
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setTempName(deck?.name || '新しいデッキ');
      setIsEditingName(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-col gap-2">
        {isEditingName ? (
          <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:ring-0 p-0 -ml-0.5 w-full"
            placeholder="デッキ名を入力..."
          />
        ) : (
          <div 
            onClick={handleNameClick}
            className="group flex items-center gap-2 cursor-text hover:bg-gray-100 rounded px-1 -ml-1 py-0.5 transition-colors w-full"
          >
            <h1 className="text-2xl font-bold text-gray-800 truncate flex-1">
              {deck?.name || '新しいデッキ'}
            </h1>
            <HiPencil className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        )}
      </div>
      
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
        />
      </div>

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

