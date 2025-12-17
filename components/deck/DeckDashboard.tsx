'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DeckTypeSelect } from '@/components/deck/DeckTypeSelect';
import { SongSelect } from '@/components/deck/SongSelect';
import { CenterCardDisplay } from '@/components/deck/CenterCardDisplay';
import { LRCardsList } from '@/components/deck/LRCardsList';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';
import { useDeck } from '@/hooks/useDeck';
import { getCenterCard, getOtherLRCards } from '@/services/deckAnalysisService';

export const DeckDashboard: React.FC = () => {
  const { deck, updateDeckType, updateDeckName, updateSong } = useDeck();
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
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        {isEditingName ? (
          <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:ring-0 p-0 -ml-0.5"
            placeholder="デッキ名を入力..."
          />
        ) : (
          <h1
            onClick={handleNameClick}
            className="text-2xl font-bold text-gray-800 cursor-text hover:bg-gray-100 rounded px-1 -ml-1 py-0.5 transition-colors"
          >
            {deck?.name || '新しいデッキ'}
          </h1>
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

      {/* センターカードのスペシャルアピール */}
      <div className="border border-gray-200 rounded-lg p-2">
        <CenterCardDisplay centerCard={centerCard} />
        <LRCardsList lrCards={otherLRCards} />
      </div>
    </div>
  );
};

