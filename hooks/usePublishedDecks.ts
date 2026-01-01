import { useCallback, useEffect, useState } from 'react';
import { GetDecksParams } from '@/models/DeckQueryParams';
import { PublishedDeck } from '@/models/PublishedDeck';
import { PageInfo } from '@/models/Pagination';
import { useAuth } from './useAuth';
import { publishedDeckService } from '@/services/publishedDeckService';

interface UsePublishedDecksState {
  decks: PublishedDeck[];
  pageInfo: PageInfo | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PER_PAGE = 12;

export const usePublishedDecks = (initialParams?: Partial<GetDecksParams>) => {
  const { isAuthenticated } = useAuth();

  const [{ decks, pageInfo, loading, error }, setState] = useState<UsePublishedDecksState>(
    {
      decks: [],
      pageInfo: null,
      loading: false,
      error: null,
    }
  );

  const [params, setParams] = useState<GetDecksParams>({
    page: 1,
    perPage: DEFAULT_PER_PAGE,
    orderBy: 'publishedAt',
    order: 'desc',
    ...initialParams,
  });

  const fetchDecks = useCallback(async (nextParams: GetDecksParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await publishedDeckService.getDecks(nextParams);
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

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDecks(params);
  }, [fetchDecks, isAuthenticated, params]);

  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    fetchDecks(params);
  }, [fetchDecks, params]);

  return {
    decks,
    pageInfo,
    loading,
    error,
    goToPage,
    refresh,
    params,
    setParams,
  };
};
