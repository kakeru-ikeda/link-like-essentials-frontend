'use client';

import React, { useState } from 'react';
import { CardFilter as CardFilterType } from '@/models/shared/Filter';
import { FilterButton } from '@/components/common/FilterButton';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';
import { Button } from '@/components/common/Button';
import { ActiveFilters } from '@/components/common/ActiveFilters';
import { CardFilter } from '@/components/common/CardFilter';
import { KeywordSearchInput } from '@/components/common/KeywordSearchInput';
import { CharacterFilter } from '@/components/cards/filters/CharacterFilter';
import { toggleFilterList } from '@/services/card/cardFilterService';
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
  'traitEffects',
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
  const { isSp } = useResponsiveDevice();

  const toggleCharacter = (characterName: string) => {
    updateFilter(toggleFilterList(filter, 'characterNames', characterName));
  };

  return (
    <div
      className={`${isSp ? '' : 'sticky top-4'} z-10 bg-white rounded-lg shadow-md mb-6`}
    >
      <div className="flex flex-wrap items-center gap-2 pt-4 px-4">
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

        {/* スペーサー */}
        <div className="flex-grow" />
      </div>

      {/* キャラクターフィルター */}
      <div className="px-4 pt-2 pb-4">
        <CharacterFilter
          selectedCharacters={filter.characterNames}
          onToggle={toggleCharacter}
          currentSlotId={null}
          isLabelHidden={true}
          paddingDisabled={true}
        />
      </div>

      {/* 適用中フィルター表示 */}
      <div className={activeFilterCount > 0 ? 'px-4 pb-4' : 'hidden'}>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-[200px]">
            <ActiveFilters
              filter={filter}
              clearFilterKey={clearFilterKey}
              updateFilter={updateFilter}
            />
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center justify-end">
              <Button
                onClick={onFilterClear}
                variant="secondary"
                className="!px-4 !py-2 text-sm"
              >
                条件クリア
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* フィルター表示エリア */}
      {isFilterVisible && (
        <div className="max-h-[70vh] overflow-y-auto">
          <CardFilter
            filter={filter}
            visibleFilters={VISIBLE_FILTERS}
            updateFilter={updateFilter}
            currentSlotId={null}
            deckType={undefined}
            onApply={() => setIsFilterVisible(false)}
          />
        </div>
      )}
    </div>
  );
};
