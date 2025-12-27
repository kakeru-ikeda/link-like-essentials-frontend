import React, { useState } from 'react';
import { CardFilter as CardFilterType } from '@/models/Filter';
import { FilterButton } from '@/components/common/FilterButton';
import { Button } from '@/components/common/Button';
import { ActiveFilters } from '@/components/common/ActiveFilters';
import { CardFilter } from '@/components/common/CardFilter';

interface CardGridFilterProps {
  activeFilterCount: number;
  filter: CardFilterType;
  updateFilter: (updates: Partial<CardFilterType>) => void;
  clearFilterKey: (key: keyof CardFilterType) => void;
  onFilterClear: () => void;
}

export const CardGridFilter: React.FC<CardGridFilterProps> = ({
  activeFilterCount,
  filter,
  updateFilter,
  clearFilterKey,
  onFilterClear,
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const hasActiveFilters =
    filter.keyword ||
    (filter.rarities && filter.rarities.length > 0) ||
    (filter.styleTypes && filter.styleTypes.length > 0) ||
    (filter.limitedTypes && filter.limitedTypes.length > 0) ||
    (filter.characterNames && filter.characterNames.length > 0) ||
    (filter.favoriteModes && filter.favoriteModes.length > 0) ||
    (filter.skillEffects && filter.skillEffects.length > 0) ||
    (filter.skillSearchTargets && filter.skillSearchTargets.length > 0) ||
    filter.hasTokens !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap items-center gap-2 p-4">
        {/* フィルターボタン */}
        <FilterButton
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          activeCount={activeFilterCount}
          isExpanded={isFilterVisible}
        />

        {/* 適用中フィルター表示 */}
        <ActiveFilters filter={filter} clearFilterKey={clearFilterKey} />

        {/* スペーサー */}
        <div className="flex-grow" />

        {/* クリアボタン */}
        {hasActiveFilters && (
          <Button
            onClick={onFilterClear}
            variant="secondary"
            className="!px-4 !py-2 text-sm"
          >
            条件クリア
          </Button>
        )}
      </div>

      {/* フィルター表示エリア */}
      {isFilterVisible && (
        <CardFilter
          filter={filter}
          updateFilter={updateFilter}
          currentSlotId={null}
          onApply={() => setIsFilterVisible(false)}
        />
      )}
    </div>
  );
};
