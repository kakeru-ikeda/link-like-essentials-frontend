import { useState } from 'react';
import { CardSortBy, SortOrder } from '@/config/sortOptions';

interface UseCardSortReturn {
  sortBy: CardSortBy;
  order: SortOrder;
  handleSortChange: (newSortBy: CardSortBy) => void;
  handleOrderChange: (newOrder: SortOrder) => void;
}

/**
 * カードソート状態を管理するカスタムフック（内部状態のみ）
 * デッキビルダーなど、URLクエリパラメータを使用しない場面で使用
 */
export function useCardSort(
  defaultSortBy: CardSortBy = 'releaseDate',
  defaultOrder: SortOrder = 'desc'
): UseCardSortReturn {
  const [sortBy, setSortBy] = useState<CardSortBy>(defaultSortBy);
  const [order, setOrder] = useState<SortOrder>(defaultOrder);

  const handleSortChange = (newSortBy: CardSortBy) => {
    setSortBy(newSortBy);
  };

  const handleOrderChange = (newOrder: SortOrder) => {
    setOrder(newOrder);
  };

  return {
    sortBy,
    order,
    handleSortChange,
    handleOrderChange,
  };
}
