import React from 'react';
import { ToggleFilter } from '@/components/common/filters/ToggleFilter';

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
      <label className="block text-sm font-medium text-gray-700 mb-3">
        トークンカード
      </label>
      <ToggleFilter
        value={hasTokens}
        onChange={onChange}
        trueLabel="あり"
        falseLabel="なし"
        color="cyan"
      />
    </div>
  );
};
