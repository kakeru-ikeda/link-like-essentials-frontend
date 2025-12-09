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
  const hasActiveFilters =
    filter.keyword ||
    (filter.rarities && filter.rarities.length > 0) ||
    (filter.styleTypes && filter.styleTypes.length > 0) ||
    (filter.favoriteModes && filter.favoriteModes.length > 0) ||
    (filter.characterNames && filter.characterNames.length > 0) ||
    (filter.limitedTypes && filter.limitedTypes.length > 0) ||
    (filter.skillEffects && filter.skillEffects.length > 0) ||
    (filter.skillSearchTargets && filter.skillSearchTargets.length > 0);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-gray-600">適用中:</span>

        {/* キーワード */}
        {filter.keyword && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
            <span className="max-w-[100px] truncate">{filter.keyword}</span>
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
        {filter.rarities && filter.rarities.length > 0 && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
            {filter.rarities.map((r) => RARITY_LABELS[r]).join(', ')}
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
        {filter.styleTypes && filter.styleTypes.length > 0 && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
            {filter.styleTypes.map((s) => STYLE_TYPE_LABELS[s]).join(', ')}
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
        {filter.favoriteModes && filter.favoriteModes.length > 0 && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
            {filter.favoriteModes.map((f) => FAVORITE_MODE_LABELS[f]).join(', ')}
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
        {filter.characterNames && filter.characterNames.length > 0 && (
          <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full flex items-center gap-1">
            {filter.characterNames.join(', ')}
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
        {filter.skillEffects && filter.skillEffects.length > 0 && (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
            {filter.skillEffects.map((s) => SKILL_EFFECT_LABELS[s]).join(', ')}
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
        {filter.skillSearchTargets && filter.skillSearchTargets.length > 0 && (
          <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full flex items-center gap-1">
            {filter.skillSearchTargets.map((t) => SKILL_SEARCH_TARGET_LABELS[t]).join(', ')}
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
        {filter.limitedTypes && filter.limitedTypes.length > 0 && (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
            {filter.limitedTypes.map((l) => LIMITED_TYPE_LABELS[l]).join(', ')}
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
