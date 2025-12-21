'use client';

import React, { useEffect } from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { LiveGrandPrixDetail } from '@/models/LiveGrandPrix';
import { LiveGrandPrixService } from '@/services/liveGrandPrixService';

interface LiveGrandPrixStageSelectProps {
  details?: LiveGrandPrixDetail[];
  value?: string;
  onChange: (detail: LiveGrandPrixDetail | null) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * ライブグランプリのステージ選択コンポーネント
 * ライブグランプリが選択された後にステージA/B/Cを選択
 */
export const LiveGrandPrixStageSelect: React.FC<LiveGrandPrixStageSelectProps> = ({
  details = [],
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  // ライブグランプリが変更されたら選択をクリア
  useEffect(() => {
    if (details.length > 0 && value) {
      // ビジネスロジックはserviceに委譲
      const detailExists = LiveGrandPrixService.isStageDetailInList(value, details);
      if (!detailExists) {
        // 選択がクリアされた場合、nullを返す
        onChange(null);
      }
    }
  }, [details, value, onChange]);

  const handleChange = (detailId: string): void => {
    const selectedDetail = details.find((detail) => detail.id === detailId);
    if (selectedDetail) {
      onChange(selectedDetail);
    }
  };

  const stageOptions: DropdownOption[] = details.map((detail) => {
    const songName = detail.song?.songName || '楽曲未設定';
    
    return {
      value: detail.id,
      label: `ステージ${detail.stageName}`,
      description: songName,
    };
  });

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
