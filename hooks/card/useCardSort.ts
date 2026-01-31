import { useRouter, useSearchParams } from 'next/navigation';
import { CardSortBy, SortOrder } from '@/config/sortOptions';

interface UseCardSortReturn {
  sortBy: CardSortBy;
  order: SortOrder;
  handleSortChange: (newSortBy: CardSortBy) => void;
  handleOrderChange: (newOrder: SortOrder) => void;
}

/**
 * カード一覧のソート設定を管理するカスタムフック
 * クエリパラメータからソート設定を取得し、変更時にURLを更新する
 */
export function useCardSort(): UseCardSortReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // クエリパラメータからソート設定を取得（デフォルト: releaseDate / desc）
  const sortBy = (searchParams.get('sortBy') as CardSortBy) || 'releaseDate';
  const order = (searchParams.get('order') as SortOrder) || 'desc';

  // ソート項目変更
  const handleSortChange = (newSortBy: CardSortBy) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', newSortBy);
    router.push(`?${params.toString()}`);
  };

  // ソート順変更
  const handleOrderChange = (newOrder: SortOrder) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('order', newOrder);
    router.push(`?${params.toString()}`);
  };

  return {
    sortBy,
    order,
    handleSortChange,
    handleOrderChange,
  };
}
