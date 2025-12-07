'use client';

import React from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { SongCategory } from '@/models/enums';

interface CategorySelectProps {
  value?: SongCategory;
  onChange: (category: SongCategory) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 楽曲カテゴリー選択コンポーネント
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const categoryOptions: DropdownOption<SongCategory>[] = [
    { value: SongCategory.TERM_103, label: '103期' },
    { value: SongCategory.TERM_104, label: '104期' },
    { value: SongCategory.TERM_105, label: '105期' },
    { value: SongCategory.TERM_105_FT_KOZUE, label: '105期ft.梢' },
    { value: SongCategory.TERM_105_FT_TSUZURI, label: '105期ft.綴理' },
    { value: SongCategory.TERM_105_FT_MEGUMI, label: '105期ft.慈' },
  ];

  return (
    <Dropdown<SongCategory>
      value={value}
      onChange={onChange}
      options={categoryOptions}
      placeholder="デッキタイプを選択"
      disabled={disabled}
      className={className}
      label="デッキタイプ"
    />
  );
};
