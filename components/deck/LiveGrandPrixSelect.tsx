'use client';

import React, { useEffect, useMemo } from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { LiveGrandPrix } from '@/models/LiveGrandPrix';
import { useLiveGrandPrix } from '@/hooks/useLiveGrandPrix';
import { Loading } from '@/components/common/Loading';
import { DeckType } from '@/models/enums';

interface LiveGrandPrixSelectProps {
  deckType?: DeckType;
  value?: string;
  onChange: (liveGrandPrix: Partial<LiveGrandPrix>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * deckTypeから期を判定する関数
 */
const getYearTermFromDeckType = (deckType?: DeckType): string | undefined => {
  if (!deckType) return undefined;
  
  // DeckTypeの値から期を抽出(例: '103期', '104期', '105期' など)
  // ft.付きのデッキタイプも基本期に統一(例: '105期ft.梢' → '105期')
  const match = deckType.match(/^(\d{3}期)/);
  return match ? match[1] : undefined;
};

/**
 * ライブグランプリ選択コンポーネント
 * デッキタイプに基づいてライブグランプリを表示
 */
export const LiveGrandPrixSelect: React.FC<LiveGrandPrixSelectProps> = ({
  deckType,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  // deckTypeから期を判定
  const yearTerm = useMemo(() => getYearTermFromDeckType(deckType), [deckType]);
  
  // 判定した期のライブグランプリを取得
  const { liveGrandPrix, loading, error } = useLiveGrandPrix(
    yearTerm ? { yearTerm } : undefined,
    !yearTerm // yearTermがない場合はクエリをスキップ
  );

  // デッキタイプが変更されたら選択をクリア
  useEffect(() => {
    if (deckType && value) {
      // 選択されたライブグランプリが現在の期に存在しない場合はクリア
      const eventExists = liveGrandPrix.some((event) => event.id === value);
      if (!eventExists && liveGrandPrix.length > 0) {
        onChange({});
      }
    }
  }, [deckType, liveGrandPrix, value, onChange]);

  const handleChange = (eventId: string): void => {
    const selectedEvent = liveGrandPrix.find((event) => event.id === eventId);
    if (selectedEvent) {
      onChange({
        id: selectedEvent.id,
        eventName: selectedEvent.eventName,
        yearTerm: selectedEvent.yearTerm,
        startDate: selectedEvent.startDate,
        endDate: selectedEvent.endDate,
        eventUrl: selectedEvent.eventUrl,
        details: selectedEvent.details,
      });
    }
  };

  const eventOptions: DropdownOption[] = liveGrandPrix.map((event) => {
    const startDate = new Date(event.startDate).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    });
    const endDate = new Date(event.endDate).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    });

    return {
      value: event.id,
      label: event.eventName,
      description: `${event.yearTerm} (${startDate}～${endDate})`,
    };
  });

  if (loading) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ライブグランプリ
        </label>
        <div className="h-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg flex items-center gap-2">
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
          ライブグランプリの取得に失敗しました: {error}
        </p>
      </div>
    );
  }

  return (
    <Dropdown
      value={value}
      onChange={handleChange}
      options={eventOptions}
      placeholder={
        liveGrandPrix.length === 0
          ? 'ライブグランプリが見つかりません'
          : 'ライブグランプリを選択'
      }
      disabled={disabled || liveGrandPrix.length === 0}
      className={className}
      searchable={true}
      searchPlaceholder="イベント名、期で検索..."
    />
  );
};
