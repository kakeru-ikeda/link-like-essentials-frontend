'use client';

import { useState, useCallback, useMemo } from 'react';
import { CardFilter } from '@/models/Filter';

export interface UseFilterReturn {
  // 作業用フィルター（未適用）
  draftFilter: CardFilter;
  // 適用済みフィルター（検索クエリに使用）
  appliedFilter: CardFilter;
  
  // フィルター更新（作業用のみ）
  updateDraftFilter: (updates: Partial<CardFilter>) => void;
  setDraftFilter: (filter: CardFilter) => void;
  
  // フィルター更新＋即座に適用（ヘッダーキーワード検索用）
  updateAndApplyFilter: (updates: Partial<CardFilter>) => void;
  
  // フィルター適用
  applyFilter: () => void;
  applyFilterAndClose: (closeCallback: () => void) => void;
  
  // フィルターリセット
  resetFilter: () => void;
  resetDraftFilter: () => void;
  
  // 個別フィルタークリア
  clearFilterKey: (key: keyof CardFilter) => void;
  
  // フィルター数カウント
  countActiveFilters: () => number;
  
  // 初期化（スロット選択時など）
  initializeFromSaved: (savedFilter: CardFilter) => void;
}

export function useFilter(): UseFilterReturn {
  const [draftFilter, setDraftFilter] = useState<CardFilter>({});
  const [appliedFilter, setAppliedFilter] = useState<CardFilter>({});

  // 作業用フィルターを部分的に更新
  const updateDraftFilter = useCallback((updates: Partial<CardFilter>): void => {
    setDraftFilter((prev) => ({ ...prev, ...updates }));
  }, []);

  // フィルターを更新して即座に適用（ヘッダーキーワード検索用）
  const updateAndApplyFilter = useCallback((updates: Partial<CardFilter>): void => {
    setDraftFilter((prev) => {
      const newFilter = { ...prev, ...updates };
      setAppliedFilter(newFilter);
      return newFilter;
    });
  }, []);

  // 作業用フィルターを適用済みに反映
  const applyFilter = useCallback((): void => {
    setAppliedFilter(draftFilter);
  }, [draftFilter]);

  // フィルター適用してコールバック実行（モーダル閉じるなど）
  const applyFilterAndClose = useCallback((closeCallback: () => void): void => {
    setAppliedFilter(draftFilter);
    closeCallback();
  }, [draftFilter]);

  // 両方リセット
  const resetFilter = useCallback((): void => {
    setDraftFilter({});
    setAppliedFilter({});
  }, []);

  // 作業用のみリセット
  const resetDraftFilter = useCallback((): void => {
    setDraftFilter({});
  }, []);

  // 個別キーをクリア（作業用のみ）
  const clearFilterKey = useCallback((key: keyof CardFilter): void => {
    setDraftFilter((prev) => {
      const newFilter = { ...prev };
      delete newFilter[key];
      return newFilter;
    });
  }, []);

  // アクティブなフィルター数をカウント
  const countActiveFilters = useCallback((): number => {
    let count = 0;
    if (draftFilter.keyword) count++;
    if (draftFilter.rarities && draftFilter.rarities.length > 0) count += draftFilter.rarities.length;
    if (draftFilter.styleTypes && draftFilter.styleTypes.length > 0) count += draftFilter.styleTypes.length;
    if (draftFilter.limitedTypes && draftFilter.limitedTypes.length > 0) count += draftFilter.limitedTypes.length;
    if (draftFilter.favoriteModes && draftFilter.favoriteModes.length > 0) count += draftFilter.favoriteModes.length;
    if (draftFilter.characterNames && draftFilter.characterNames.length > 0) count += draftFilter.characterNames.length;
    if (draftFilter.skillEffects && draftFilter.skillEffects.length > 0) count += draftFilter.skillEffects.length;
    if (draftFilter.skillSearchTargets && draftFilter.skillSearchTargets.length > 0) count += draftFilter.skillSearchTargets.length;
    return count;
  }, [draftFilter]);

  // 保存済みフィルターから初期化（キャラクター名除外など）
  const initializeFromSaved = useCallback((savedFilter: CardFilter): void => {
    const { characterNames, ...filterWithoutCharacter } = savedFilter;
    setDraftFilter(filterWithoutCharacter);
    setAppliedFilter(filterWithoutCharacter);
  }, []);

  return {
    draftFilter,
    appliedFilter,
    updateDraftFilter,
    setDraftFilter,
    updateAndApplyFilter,
    applyFilter,
    applyFilterAndClose,
    resetFilter,
    resetDraftFilter,
    clearFilterKey,
    countActiveFilters,
    initializeFromSaved,
  };
}
