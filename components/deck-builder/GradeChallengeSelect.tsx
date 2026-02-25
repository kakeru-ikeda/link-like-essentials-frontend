'use client';

import React from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { GradeChallenge } from '@/models/grade-challenge/GradeChallenge';
import { useGradeChallenges } from '@/hooks/deck/useGradeChallenge';
import { Loading } from '@/components/common/Loading';
import { DeckType } from '@/models/shared/enums';
import { GradeChallengeService } from '@/services/grade-challenge/gradeChallengeService';

interface GradeChallengeSelectProps {
  deckType?: DeckType;
  value?: string;
  onChange: (gradeChallenge: Partial<GradeChallenge>) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * グレードチャレンジ選択コンポーネント
 * デッキタイプに基づいてグレードチャレンジを表示
 */
export const GradeChallengeSelect: React.FC<GradeChallengeSelectProps> = ({
  deckType,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  // 選択されたデッキタイプの曲を含むグレードチャレンジを取得
  const { gradeChallenges, loading, error } = useGradeChallenges(
    deckType ? { hasSongWithDeckType: deckType } : undefined,
    !deckType // deckTypeがない場合はクエリをスキップ
  );

  const handleChange = (eventId: string): void => {
    if (!eventId) {
      onChange({});
      return;
    }
    const selectedEvent = gradeChallenges.find((event) => event.id === eventId);
    if (selectedEvent) {
      onChange({
        id: selectedEvent.id,
        title: selectedEvent.title,
        termName: selectedEvent.termName,
        startDate: selectedEvent.startDate,
        endDate: selectedEvent.endDate,
        detailUrl: selectedEvent.detailUrl,
        details: selectedEvent.details,
      });
    }
  };

  const hasSelection = Boolean(value);
  const eventOptions: DropdownOption[] = [
    ...(hasSelection ? [{ value: '', label: '選択を解除' }] : []),
    ...gradeChallenges.map((event) => {
      // 日付フォーマットはserviceに委譲
      const dateRange = GradeChallengeService.formatEventDateRange(
        event.startDate,
        event.endDate
      );

      return {
        value: event.id,
        label: event.title,
        description: `${event.termName} (${dateRange})`,
      };
    }),
  ];

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
          グレードチャレンジの取得に失敗しました: {error}
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
        gradeChallenges.length === 0
          ? 'グレードチャレンジが見つかりません'
          : 'グレードチャレンジを選択'
      }
      disabled={disabled || gradeChallenges.length === 0}
      className={className}
      searchable={true}
      searchPlaceholder="タイトル、期で検索..."
    />
  );
};
