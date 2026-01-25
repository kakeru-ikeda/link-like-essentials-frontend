'use client';

import { useState, useCallback } from 'react';
import { CardFilter } from '@/models/shared/Filter';

export interface UseFilterReturn {
  // 単一のフィルター状態（読み取り専用）
  readonly filter: Readonly<CardFilter>;
  
  // フィルター更新（immediate: true で即座にクエリ実行）
  updateFilter: (updates: Partial<CardFilter>, options?: { immediate?: boolean }) => void;
  setFilter: (filter: CardFilter) => void;
  
  // フィルターリセット
  resetFilter: () => void;
  
  // 個別フィルタークリア
  clearFilterKey: (key: keyof CardFilter) => void;
  
  // フィルター数カウント
  countActiveFilters: () => number;
}

export function useFilter(): UseFilterReturn {
  const [filter, setFilterState] = useState<CardFilter>({});

  // setFilterをメモ化
  const setFilter = useCallback((newFilter: CardFilter): void => {
    setFilterState(newFilter);
  }, []);

  // フィルター更新（immediate オプションで即座適用を制御）
  const updateFilter = useCallback((updates: Partial<CardFilter>): void => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  }, []);

  // フィルターリセット
  const resetFilter = useCallback((): void => {
    setFilterState({});
  }, []);

  // 個別キーをクリア
  const clearFilterKey = useCallback((key: keyof CardFilter): void => {
    setFilterState((prev) => {
      const newFilter = { ...prev };
      delete newFilter[key];
      return newFilter;
    });
  }, []);

  // アクティブなフィルター数をカウント
  const countActiveFilters = useCallback((): number => {
    let count = 0;
    if (filter.keyword) count++;
    if (filter.rarities && filter.rarities.length > 0) count += filter.rarities.length;
    if (filter.styleTypes && filter.styleTypes.length > 0) count += filter.styleTypes.length;
    if (filter.limitedTypes && filter.limitedTypes.length > 0) count += filter.limitedTypes.length;
    if (filter.favoriteModes && filter.favoriteModes.length > 0) count += filter.favoriteModes.length;
    if (filter.characterNames && filter.characterNames.length > 0) count += filter.characterNames.length;
    if (filter.skillEffects && filter.skillEffects.length > 0) count += filter.skillEffects.length;
    if (filter.skillSearchTargets && filter.skillSearchTargets.length > 0) count += filter.skillSearchTargets.length;
    if (filter.traitEffects && filter.traitEffects.length > 0) count += filter.traitEffects.length;
    if (filter.hasTokens !== undefined) count++;
    return count;
  }, [filter]);

  return {
    filter,
    updateFilter,
    setFilter,
    resetFilter,
    clearFilterKey,
    countActiveFilters,
  };
}
