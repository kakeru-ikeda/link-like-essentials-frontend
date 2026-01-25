'use client';

import React from 'react';
import { Dropdown, DropdownOption } from '@/components/common/Dropdown';
import { DeckType } from '@/models/shared/enums';

interface DeckTypeProps {
  value?: DeckType;
  onChange: (category: DeckType) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * デッキタイプ選択コンポーネント
 */
export const DeckTypeSelect: React.FC<DeckTypeProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const options: DropdownOption<DeckType>[] = [
    { value: DeckType.TERM_102, label: '102期' },
    { value: DeckType.TERM_103, label: '103期' },
    { value: DeckType.TERM_104, label: '104期' },
    { value: DeckType.TERM_105, label: '105期' },
    { value: DeckType.TERM_105_FT_KOZUE, label: '105期ft.梢' },
    { value: DeckType.TERM_105_FT_TSUZURI, label: '105期ft.綴理' },
    { value: DeckType.TERM_105_FT_MEGUMI, label: '105期ft.慈' },
  ];

  return (
    <Dropdown<DeckType>
      value={value}
      onChange={onChange}
      options={options}
      placeholder="デッキタイプを選択"
      disabled={disabled}
      className={className}
      label="デッキタイプ"
    />
  );
};
