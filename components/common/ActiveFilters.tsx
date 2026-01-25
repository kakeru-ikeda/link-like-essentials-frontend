'use client';

import React from 'react';
import type { CardFilter } from '@/models/shared/Filter';
import {
  RARITY_LABELS,
  STYLE_TYPE_LABELS,
  LIMITED_TYPE_LABELS,
  FAVORITE_MODE_LABELS,
  SKILL_EFFECT_LABELS,
  SKILL_SEARCH_TARGET_LABELS,
  TRAIT_EFFECT_LABELS,
} from '@/mappers/enumMappers';
import { removeFromFilterList } from '@/services/card/cardFilterService';
import {
  FAVORITE_MODE_COLORS,
  FILTER_COLOR_KEYWORD,
  FILTER_COLOR_SKILL_EFFECT,
  FILTER_COLOR_SKILL_SEARCH_TARGET,
  FILTER_COLOR_TOKEN,
  FILTER_COLOR_TRAIT_EFFECT,
  LIMITED_TYPE_COLORS,
  RARITY_COLORS,
  STYLE_TYPE_COLORS,
} from '@/styles/colors';
import { getCharacterColor } from '@/utils/colorUtils';

interface ActiveFiltersProps {
  filter: CardFilter;
  clearFilterKey: (key: keyof CardFilter) => void;
  updateFilter?: (updates: Partial<CardFilter>) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filter,
  clearFilterKey,
  updateFilter,
}) => {
  const createChipStyle = (color: string) => ({
    borderColor: color,
    backgroundColor: `${color}10`,
    color: '#111827',
  });

  const renderChip = (
    key: React.Key,
    label: React.ReactNode,
    color: string,
    onClear: () => void,
    options?: { truncate?: boolean }
  ) => (
    <span
      key={key}
      className="px-2 py-1 text-xs rounded-full flex items-center gap-1 border"
      style={createChipStyle(color)}
    >
      <span className={options?.truncate ? 'max-w-[140px] truncate' : undefined}>{label}</span>
      <button
        onClick={onClear}
        className="rounded-full p-0.5 hover:opacity-75"
        aria-label="フィルターをクリア"
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
  );

  const hasActiveFilters =
    filter.keyword ||
    (filter.rarities && filter.rarities.length > 0) ||
    (filter.styleTypes && filter.styleTypes.length > 0) ||
    (filter.favoriteModes && filter.favoriteModes.length > 0) ||
    (filter.characterNames && filter.characterNames.length > 0) ||
    (filter.limitedTypes && filter.limitedTypes.length > 0) ||
    (filter.skillEffects && filter.skillEffects.length > 0) ||
    (filter.skillSearchTargets && filter.skillSearchTargets.length > 0) ||
    (filter.traitEffects && filter.traitEffects.length > 0) ||
    filter.hasTokens !== undefined;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="px-4 py-2 bg-gray-50 border-gray-200">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-gray-600">適用中:</span>

        {/* キーワード */}
        {filter.keyword &&
          renderChip('keyword', filter.keyword, FILTER_COLOR_KEYWORD, () => clearFilterKey('keyword'), {
            truncate: true,
          })}

        {/* レアリティ */}
        {filter.rarities &&
          filter.rarities.length > 0 &&
          filter.rarities.map((rarity) =>
            renderChip(
              rarity,
              RARITY_LABELS[rarity],
              RARITY_COLORS[rarity],
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'rarities', rarity))
                  : clearFilterKey('rarities')
            )
          )}

        {/* スタイルタイプ */}
        {filter.styleTypes &&
          filter.styleTypes.length > 0 &&
          filter.styleTypes.map((styleType) =>
            renderChip(
              styleType,
              STYLE_TYPE_LABELS[styleType],
              STYLE_TYPE_COLORS[styleType],
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'styleTypes', styleType))
                  : clearFilterKey('styleTypes')
            )
          )}

        {/* 得意ムード */}
        {filter.favoriteModes &&
          filter.favoriteModes.length > 0 &&
          filter.favoriteModes.map((favoriteMode) =>
            renderChip(
              favoriteMode,
              FAVORITE_MODE_LABELS[favoriteMode],
              FAVORITE_MODE_COLORS[favoriteMode],
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'favoriteModes', favoriteMode))
                  : clearFilterKey('favoriteModes')
            )
          )}

        {/* キャラクター */}
        {filter.characterNames &&
          filter.characterNames.length > 0 &&
          filter.characterNames.map((characterName) =>
            renderChip(
              characterName,
              characterName,
              getCharacterColor(characterName),
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'characterNames', characterName))
                  : clearFilterKey('characterNames')
            )
          )}

        {/* スキル効果 */}
        {filter.skillEffects &&
          filter.skillEffects.length > 0 &&
          filter.skillEffects.map((skillEffect) =>
            renderChip(
              skillEffect,
              SKILL_EFFECT_LABELS[skillEffect],
              FILTER_COLOR_SKILL_EFFECT,
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'skillEffects', skillEffect))
                  : clearFilterKey('skillEffects')
            )
          )}

        {/* スキル検索対象 */}
        {filter.skillSearchTargets &&
          filter.skillSearchTargets.length > 0 &&
          filter.skillSearchTargets.map((skillSearchTarget) =>
            renderChip(
              skillSearchTarget,
              SKILL_SEARCH_TARGET_LABELS[skillSearchTarget],
              FILTER_COLOR_SKILL_SEARCH_TARGET,
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'skillSearchTargets', skillSearchTarget))
                  : clearFilterKey('skillSearchTargets')
            )
          )}

        {/* 特性効果 */}
        {filter.traitEffects &&
          filter.traitEffects.length > 0 &&
          filter.traitEffects.map((traitEffect) =>
            renderChip(
              traitEffect,
              TRAIT_EFFECT_LABELS[traitEffect],
              FILTER_COLOR_TRAIT_EFFECT,
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'traitEffects', traitEffect))
                  : clearFilterKey('traitEffects')
            )
          )}

        {/* 入手方法 */}
        {filter.limitedTypes &&
          filter.limitedTypes.length > 0 &&
          filter.limitedTypes.map((limitedType) =>
            renderChip(
              limitedType,
              LIMITED_TYPE_LABELS[limitedType],
              LIMITED_TYPE_COLORS[limitedType],
              () =>
                updateFilter
                  ? updateFilter(removeFromFilterList(filter, 'limitedTypes', limitedType))
                  : clearFilterKey('limitedTypes')
            )
          )}

        {/* トークンカードの有無 */}
        {filter.hasTokens !== undefined &&
          renderChip(
            'hasTokens',
            `トークン${filter.hasTokens ? 'あり' : 'なし'}`,
            FILTER_COLOR_TOKEN,
            () => clearFilterKey('hasTokens')
          )}
      </div>
    </div>
  );
};
