'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { SongSelect } from '@/components/deck/SongSelect';
import { DeckType } from '@/models/enums';
import { DECK_TYPE_MAP } from '@/constants/enumMappings';
import { useDeck } from '@/hooks/useDeck';

export const DeckDashboard: React.FC = () => {
  const { deck, updateDeckType, updateSong } = useDeck();
  const [selectedDeckType, setSelectedDeckType] = useState<DeckType | undefined>(deck?.deckType);

  // deckが変更されたら同期
  useEffect(() => {
    setSelectedDeckType(deck?.deckType);
  }, [deck?.deckType]);

  const handleDeckTypeChange = (value: string): void => {
    const newDeckType = value as DeckType;
    const success = updateDeckType(newDeckType);
    
    if (success) {
      setSelectedDeckType(newDeckType);
    }
    // キャンセルされた場合は元の値を保持（useEffectで同期される）
  };

  const handleSongChange = (songId: string, songName: string): void => {
    updateSong(songId, songName);
  };

  const deckTypeOptions: DropdownOption[] = Object.entries(DECK_TYPE_MAP).map(
    ([key, label]) => ({
      value: key,
      label,
    })
  );

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg">
      <h2 className="text-lg font-bold text-gray-800">デッキ情報</h2>
      
      <div className="flex gap-4">
        <Dropdown
          value={selectedDeckType}
          onChange={handleDeckTypeChange}
          options={deckTypeOptions}
          placeholder="デッキタイプを選択"
          label="デッキタイプ"
          className="w-40"
        />

        <SongSelect
          deckType={deck?.deckType}
          value={deck?.songId}
          onChange={handleSongChange}
          className="flex-1"
        />
      </div>
    </div>
  );
};

