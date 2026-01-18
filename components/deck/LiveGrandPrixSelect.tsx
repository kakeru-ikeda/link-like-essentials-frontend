'use client';

import React from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { LiveGrandPrix } from '@/models/LiveGrandPrix';
import { useLiveGrandPrix } from '@/hooks/useLiveGrandPrix';
import { Loading } from '@/components/common/Loading';
import { DeckType } from '@/models/enums';
import { LiveGrandPrixService } from '@/services/liveGrandPrixService';

interface LiveGrandPrixSelectProps {
  deckType?: DeckType;
  value?: string;
  onChange: (liveGrandPrix: Partial<LiveGrandPrix>) => void;
  disabled?: boolean;
  className?: string;
}

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
  // 選択されたデッキタイプの曲を含むライブグランプリを取得
  const { liveGrandPrix, loading, error } = useLiveGrandPrix(
    deckType ? { hasSongWithDeckType: deckType } : undefined,
    !deckType // deckTypeがない場合はクエリをスキップ
  );

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
    // 日付フォーマットはserviceに委譲
    const dateRange = LiveGrandPrixService.formatEventDateRange(event.startDate, event.endDate);

    return {
      value: event.id,
      label: event.eventName,
      description: `${event.yearTerm} (${dateRange})`,
    };
  });

  if (loading) {
    return (
      <div className={className}>
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
