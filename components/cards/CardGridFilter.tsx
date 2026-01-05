'use client';

import React, { useState } from 'react';
import { CardFilter as CardFilterType } from '@/models/Filter';
import { FilterButton } from '@/components/common/FilterButton';
import { Button } from '@/components/common/Button';
import { ActiveFilters } from '@/components/common/ActiveFilters';
import { CardFilter } from '@/components/common/CardFilter';
import { KeywordSearchInput } from '@/components/common/KeywordSearchInput';
import { CharacterFilter } from '@/components/cards/filters/CharacterFilter';
import { toggleFilterList } from '@/services/cardFilterService';
import { FilterWrapper } from '../common/filters/FilterWrapper';

interface CardGridFilterProps {
  activeFilterCount: number;
  filter: CardFilterType;
  updateFilter: (updates: Partial<CardFilterType>) => void;
  clearFilterKey: (key: keyof CardFilterType) => void;
  onFilterClear: () => void;
}

const VISIBLE_FILTERS: (keyof CardFilterType)[] = [
  'filterMode',
  'favoriteModes',
  'limitedTypes',
  'rarities',
  'skillEffects',
  'skillSearchTargets',
  'styleTypes',
  'hasTokens',
];

export const CardGridFilter: React.FC<CardGridFilterProps> = ({
  activeFilterCount,
  filter,
  updateFilter,
  clearFilterKey,
  onFilterClear,
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleCharacter = (characterName: string) => {
    updateFilter(toggleFilterList(filter, 'characterNames', characterName));
  };

  return (
    <div className="sticky top-4 z-10 bg-white rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap items-center gap-2 p-4">
        {/* キーワード検索入力 */}
        <div className="flex w-full min-w-[200px] gap-2">
          <div className="flex-1">
            <KeywordSearchInput
              value={filter.keyword || ''}
              onChange={(keyword) =>
                updateFilter({ keyword: keyword || undefined })
              }
              placeholder="キーワードで検索"
            />
          </div>
          <FilterButton
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            activeCount={activeFilterCount}
            isExpanded={isFilterVisible}
          />
        </div>

        {/* 適用中フィルター表示 */}
        <ActiveFilters
          filter={filter}
          clearFilterKey={clearFilterKey}
          updateFilter={updateFilter}
        />

        {/* スペーサー */}
        <div className="flex-grow" />

        {/* クリアボタン */}
        {activeFilterCount > 0 && (
          <Button
            onClick={onFilterClear}
            variant="secondary"
            className="!px-4 !py-2 text-sm"
          >
            条件クリア
          </Button>
        )}
      </div>

      <CharacterFilter
        selectedCharacters={filter.characterNames}
        onToggle={toggleCharacter}
        currentSlotId={null}
      />

      {/* フィルター表示エリア */}
      {isFilterVisible && (
        <div className="max-h-[70vh] overflow-y-auto">
          <CardFilter
            filter={filter}
            visibleFilters={VISIBLE_FILTERS}
            updateFilter={updateFilter}
            currentSlotId={null}
            onApply={() => setIsFilterVisible(false)}
          />
        </div>
      )}
    </div>
  );
};
