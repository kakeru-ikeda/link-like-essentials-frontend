'use client';

import React, { useState, useEffect } from 'react';
import { DeckTypeSelect } from '@/components/deck/DeckTypeSelect';
import { SongSelect } from '@/components/deck/SongSelect';
import { DeckType } from '@/models/enums';
import { useDeck } from '@/hooks/useDeck';

export const DeckDashboard: React.FC = () => {
  const { deck, updateDeckType, updateSong } = useDeck();
  const [selectedDeckType, setSelectedDeckType] = useState<DeckType | undefined>(deck?.deckType);

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

  const handleSongChange = (song: { id: string; name: string; centerCharacter: string; participations: string[]; liveAnalyzerImageUrl?: string }): void => {
    updateSong(song);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg">
      <h2 className="text-lg font-bold text-gray-800">デッキ情報</h2>
      
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

      {deck?.liveAnalyzerImageUrl && (
        <div className="mt-2">
          <img
            src={deck.liveAnalyzerImageUrl}
            alt="ライブアナライザ"
            className="w-full h-auto rounded-lg border border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

