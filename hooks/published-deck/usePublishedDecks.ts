import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetDecksParams } from '@/models/domain/DeckQueryParams';
import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { PageInfo } from '@/models/shared/Pagination';
import { useAuth } from '@/hooks/auth/useAuth';
import { publishedDeckService } from '@/services/published-deck/publishedDeckService';

interface UsePublishedDecksState {
  decks: PublishedDeck[];
  pageInfo: PageInfo | null;
  loading: boolean;
  error: string | null;
}

export const usePublishedDecks = (requestParams: GetDecksParams) => {
  const { isAuthenticated } = useAuth();

  const [{ decks, pageInfo, loading, error }, setState] = useState<UsePublishedDecksState>(
    {
      decks: [],
      pageInfo: null,
      loading: false,
      error: null,
    }
  );

  const fetchDecks = useCallback(async (params: GetDecksParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await publishedDeckService.getDecks(params);
      setState({
        decks: response.data,
        pageInfo: response.pageInfo,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'デッキ一覧の取得に失敗しました';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  // requestParamsのプロパティごとに依存配列を指定することで、型安全な比較を実現
  const paramsKey = useMemo(
    () => ({
      page: requestParams.page,
      perPage: requestParams.perPage,
      orderBy: requestParams.orderBy,
      order: requestParams.order,
      tag: requestParams.tag,
      userId: requestParams.userId,
      songId: requestParams.songId,
    }),
    [
      requestParams.page,
      requestParams.perPage,
      requestParams.orderBy,
      requestParams.order,
      requestParams.tag,
      requestParams.userId,
      requestParams.songId,
    ]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDecks(requestParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, fetchDecks, paramsKey]);

  const goToPage = useCallback((page: number) => {
    // この関数は使われなくなるが、後方互換性のため残す
    console.warn('usePublishedDecks.goToPage is deprecated. Use URL-based navigation instead.');
  }, []);

  const refresh = useCallback(() => {
    fetchDecks(requestParams);
  }, [fetchDecks, requestParams]);

  return {
    decks,
    pageInfo,
    loading,
    error,
    goToPage,
    refresh,
    params: requestParams,
    setParams: () => {
      console.warn('usePublishedDecks.setParams is deprecated. Use URL-based navigation instead.');
    },
  };
};
