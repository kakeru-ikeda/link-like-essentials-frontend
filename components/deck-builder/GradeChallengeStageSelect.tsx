'use client';

import React, { useEffect } from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { GradeChallengeDetail } from '@/models/grade-challenge/GradeChallenge';
import { GradeChallengeService } from '@/services/grade-challenge/gradeChallengeService';

interface GradeChallengeStageSelectProps {
  details?: GradeChallengeDetail[];
  value?: string;
  onChange: (detail: GradeChallengeDetail | null) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * グレードチャレンジのステージ選択コンポーネント
 * グレードチャレンジが選択された後にステージを選択
 */
export const GradeChallengeStageSelect: React.FC<GradeChallengeStageSelectProps> = ({
  details = [],
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  // グレードチャレンジが変更されたら選択をクリア
  useEffect(() => {
    if (details.length > 0 && value) {
      // ビジネスロジックはserviceに委譲
      const detailExists = GradeChallengeService.isStageDetailInList(value, details);
      if (!detailExists) {
        // 選択がクリアされた場合、nullを返す
        onChange(null);
      }
    }
  }, [details, value, onChange]);

  const handleChange = (detailId: string): void => {
    if (!detailId) {
      onChange(null);
      return;
    }
    const selectedDetail = details.find((detail) => detail.id === detailId);
    if (selectedDetail) {
      onChange(selectedDetail);
    }
  };

  const hasSelection = Boolean(value);
  const stageOptions: DropdownOption[] = [
    ...(hasSelection ? [{ value: '', label: '選択を解除' }] : []),
    ...details.map((detail) => {
      const songName = detail.song?.songName || '楽曲未設定';

      return {
        value: detail.id,
        label: `ステージ${detail.stageName}`,
        description: songName,
      };
    }),
  ];

  return (
    <Dropdown
      value={value}
      onChange={handleChange}
      options={stageOptions}
      placeholder="ステージを選択"
      disabled={disabled || details.length === 0}
      className={className}
      searchable={false}
    />
  );
};
