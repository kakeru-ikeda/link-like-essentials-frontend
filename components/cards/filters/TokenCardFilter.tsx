'use client';

import React from 'react';
import { ToggleFilter } from '@/components/common/filters/ToggleFilter';
import { HelpTooltip } from '@/components/common/HelpTooltip';

interface TokenCardFilterProps {
  hasTokens: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
}

export const TokenCardFilter: React.FC<TokenCardFilterProps> = ({
  hasTokens,
  onChange,
}) => {
  return (
    <div className="p-4">
      <div className='flex items-center'>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          トークンカード
        </label>
        <HelpTooltip
          content="カードがトークンを生成するかどうかで絞り込みます。トークンとは、吟子の生成する「ドレスカード」や、【いつでも、いつまでも】シリーズの「リユニオンチャームカード」などを指します。"
          className="ml-2 mb-3"
          size={4}
        />
      </div>

      <ToggleFilter
        value={hasTokens}
        onChange={onChange}
        trueLabel="あり"
        falseLabel="なし"
      />
    </div>
  );
};
