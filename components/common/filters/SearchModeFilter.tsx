'use client';

import React from 'react';
import { FilterMode } from '@/models/shared/Filter';

interface SearchModeFilterProps {
  mode: FilterMode | undefined;
  onChange: (mode: FilterMode) => void;
}

export const SearchModeFilter: React.FC<SearchModeFilterProps> = ({
  mode,
  onChange,
}) => {
  const currentMode = mode ?? FilterMode.OR;

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        検索モード
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(FilterMode.OR)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
            currentMode === FilterMode.OR
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          OR検索
          <span className="block text-xs mt-1 opacity-90">いずれかに一致</span>
        </button>
        <button
          onClick={() => onChange(FilterMode.AND)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
            currentMode === FilterMode.AND
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          AND検索
          <span className="block text-xs mt-1 opacity-90">すべてに一致</span>
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {currentMode === FilterMode.OR
          ? '選択した条件のいずれかに一致するカードを表示します'
          : '選択したすべての条件に一致するカードのみを表示します(スキル効果で有効)'}
      </p>
    </div>
  );
};
