'use client';

import React, { useEffect } from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { Song } from '@/models/Song';
import { DeckType } from '@/models/enums';
import { useSongs } from '@/hooks/useSongs';
import { Loading } from '@/components/common/Loading';

interface SongSelectProps {
  deckType?: DeckType;
  value?: string;
  onChange: (song: Partial<Song>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 楽曲選択コンポーネント
 * 選択されたカテゴリーに基づいて楽曲を表示
 */
export const SongSelect: React.FC<SongSelectProps> = ({
  deckType,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  // カテゴリーが選択されていない場合はクエリをスキップ
  const { songs, loading, error } = useSongs(
    deckType ? { category: deckType } : undefined,
    !deckType
  );

  // カテゴリーが変更されたら選択をクリア
  useEffect(() => {
    if (deckType && value) {
      // 選択された楽曲が現在のカテゴリーに存在しない場合はクリア
      const songExists = songs.some((song) => song.id === value);
      if (!songExists && songs.length > 0) {
        onChange({});
      }
    }
  }, [deckType, songs, value, onChange]);

  const handleChange = (songId: string): void => {
    const selectedSong = songs.find((song) => song.id === songId);
    if (selectedSong) {
      onChange({
        id: selectedSong.id,
        songName: selectedSong.songName,
        centerCharacter: selectedSong.centerCharacter,
        participations: selectedSong.participations,
        liveAnalyzerImageUrl: selectedSong.liveAnalyzerImageUrl,
      });
    }
  };

  const songOptions: DropdownOption[] = songs.map((song) => ({
    value: song.id,
    label: song.songName,
    image: song.jacketImageUrl,
    description: `${song.singers}（${song.centerCharacter}）`,
  }));

  if (loading) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          楽曲
        </label>
        <div className="h-14 px-4 py-2.5 bg-white border border-gray-300 rounded-lg flex items-center gap-2">
          <Loading />
          <span className="text-sm text-gray-600">読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <p className="text-sm text-red-600">
          楽曲の取得に失敗しました: {error}
        </p>
      </div>
    );
  }

  return (
    <Dropdown
      value={value}
      onChange={handleChange}
      options={songOptions}
      placeholder={deckType ? '楽曲を選択' : 'まずデッキタイプを選択してください'}
      disabled={disabled || !deckType || songs.length === 0}
      className={className}
      label="楽曲"
      showImages={true}
      searchable={true}
      searchPlaceholder="楽曲名、属性、キャラクターで検索..."
    />
  );
};
