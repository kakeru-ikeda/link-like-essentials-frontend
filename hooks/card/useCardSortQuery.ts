// hooks/card/useCardSortQuery.ts
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { CardSortBy, SortOrder } from '@/config/sortOptions';
import { useCardSort } from '@/hooks/ui/useCardSort';

interface UseCardSortReturn {
  sortBy: CardSortBy;
  order: SortOrder;
  handleSortChange: (newSortBy: CardSortBy) => void;
  handleOrderChange: (newOrder: SortOrder) => void;
}

/**
 * カード一覧のソート設定を管理するカスタムフック（クエリパラメータ連携）
 * useCardFilterQueryと同じパターンで実装
 */
export function useCardSortQuery(): UseCardSortReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 初回マウント時かどうかを判定
  const isMountedRef = useRef(false);

  // クエリパラメータから初期値を取得
  const querySortBy =
    (searchParams.get('sortBy') as CardSortBy) || 'releaseDate';
  const queryOrder = (searchParams.get('order') as SortOrder) || 'desc';

  // useCardSortで基本的な状態管理
  const { sortBy, order, handleSortChange, handleOrderChange } = useCardSort(
    querySortBy,
    queryOrder
  );

  // URLクエリからソート設定を復元（初回マウント時のみ）
  useEffect(() => {
    if (!isMountedRef.current) {
      handleSortChange(querySortBy);
      handleOrderChange(queryOrder);
      isMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ソート設定からURLクエリを更新（初回マウント後のみ）
  useEffect(() => {
    // 初回マウント時はスキップ
    if (!isMountedRef.current) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.set('order', order);

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    // 同じならスキップ
    if (nextQuery === currentQuery) return;

    router.replace(`?${nextQuery}`, { scroll: false });
  }, [sortBy, order, router, searchParams]);

  return {
    sortBy,
    order,
    handleSortChange,
    handleOrderChange,
  };
}
