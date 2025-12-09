'use client';

import React from 'react';
import type { CardFilter } from '@/models/Filter';
import {
  RARITY_LABELS,
  STYLE_TYPE_LABELS,
  LIMITED_TYPE_LABELS,
  FAVORITE_MODE_LABELS,
} from '@/constants/labels';
import {
  SKILL_EFFECT_LABELS,
  SKILL_SEARCH_TARGET_LABELS,
} from '@/constants/skillEffects';

interface ActiveFiltersProps {
  filter: CardFilter;
  clearFilterKey: (key: keyof CardFilter) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filter,
  clearFilterKey,
}) => {
  const currentFilter = filter;

  const hasActiveFilters =
    currentFilter.keyword ||
    (currentFilter.rarities && currentFilter.rarities.length > 0) ||
    (currentFilter.styleTypes && currentFilter.styleTypes.length > 0) ||
    (currentFilter.favoriteModes && currentFilter.favoriteModes.length > 0) ||
    (currentFilter.characterNames && currentFilter.characterNames.length > 0) ||
    (currentFilter.limitedTypes && currentFilter.limitedTypes.length > 0) ||
    (currentFilter.skillEffects && currentFilter.skillEffects.length > 0) ||
    (currentFilter.skillSearchTargets && currentFilter.skillSearchTargets.length > 0);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-gray-600">適用中:</span>

        {/* キーワード */}
        {currentFilter.keyword && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
            <span className="max-w-[100px] truncate">{currentFilter.keyword}</span>
            <button
              onClick={() => clearFilterKey('keyword')}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}

        {/* レアリティ */}
        {currentFilter.rarities && currentFilter.rarities.length > 0 && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
            {currentFilter.rarities.map((r) => RARITY_LABELS[r]).join(', ')}
            <button
              onClick={() => clearFilterKey('rarities')}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}

        {/* スタイルタイプ */}
        {currentFilter.styleTypes && currentFilter.styleTypes.length > 0 && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
            {currentFilter.styleTypes.map((s) => STYLE_TYPE_LABELS[s]).join(', ')}
            <button
              onClick={() => clearFilterKey('styleTypes')}
              className="hover:bg-purple-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}

        {/* 得意ムード */}
        {currentFilter.favoriteModes && currentFilter.favoriteModes.length > 0 && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
            {currentFilter.favoriteModes.map((f) => FAVORITE_MODE_LABELS[f]).join(', ')}
            <button
              onClick={() => clearFilterKey('favoriteModes')}
              className="hover:bg-green-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}

        {/* キャラクター */}
        {currentFilter.characterNames && currentFilter.characterNames.length > 0 && (
          <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full flex items-center gap-1">
            {currentFilter.characterNames.join(', ')}
            <button
              onClick={() => clearFilterKey('characterNames')}
              className="hover:bg-pink-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}

        {/* スキル効果 */}
        {currentFilter.skillEffects && currentFilter.skillEffects.length > 0 && (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
            {currentFilter.skillEffects.map((s) => SKILL_EFFECT_LABELS[s]).join(', ')}
            <button
              onClick={() => clearFilterKey('skillEffects')}
              className="hover:bg-indigo-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}

        {/* スキル検索対象 */}
        {currentFilter.skillSearchTargets && currentFilter.skillSearchTargets.length > 0 && (
          <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full flex items-center gap-1">
            {currentFilter.skillSearchTargets.map((t) => SKILL_SEARCH_TARGET_LABELS[t]).join(', ')}
            <button
              onClick={() => clearFilterKey('skillSearchTargets')}
              className="hover:bg-teal-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}

        {/* 入手方法 */}
        {currentFilter.limitedTypes && currentFilter.limitedTypes.length > 0 && (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
            {currentFilter.limitedTypes.map((l) => LIMITED_TYPE_LABELS[l]).join(', ')}
            <button
              onClick={() => clearFilterKey('limitedTypes')}
              className="hover:bg-orange-200 rounded-full p-0.5"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
