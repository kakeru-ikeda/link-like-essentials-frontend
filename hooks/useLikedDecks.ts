import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetLikedDecksParams } from '@/models/DeckQueryParams';
import { PublishedDeck } from '@/models/PublishedDeck';
import { PageInfo } from '@/models/Pagination';
import { useAuth } from './useAuth';
import { publishedDeckService } from '@/services/publishedDeckService';

interface UseLikedDecksState {
  decks: PublishedDeck[];
  pageInfo: PageInfo | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PER_PAGE = 4;

/**
 * いいねしたデッキ一覧を取得するフック
 */
export const useLikedDecks = (initialParams?: Partial<GetLikedDecksParams>) => {
  const { isAuthenticated } = useAuth();

  const [{ decks, pageInfo, loading, error }, setState] = useState<UseLikedDecksState>({
    decks: [],
    pageInfo: null,
    loading: false,
    error: null,
  });

  const [params, setParams] = useState<GetLikedDecksParams>({
    page: 1,
    perPage: DEFAULT_PER_PAGE,
    ...initialParams,
  });

  const requestParams: GetLikedDecksParams = useMemo(
    () => ({
      page: params.page,
      perPage: params.perPage,
    }),
    [params.page, params.perPage]
  );

  const fetchDecks = useCallback(async (nextParams: GetLikedDecksParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await publishedDeckService.getLikedDecks(nextParams);
      setState({
        decks: response.data,
        pageInfo: response.pageInfo,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'いいねしたデッキ一覧の取得に失敗しました';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDecks(requestParams);
  }, [isAuthenticated, requestParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    setParams((prev) => {
      const nextParams: GetLikedDecksParams = {
        page: prev.page,
        perPage: prev.perPage,
      };
      void fetchDecks(nextParams);
      return prev;
    });
  }, [fetchDecks]);

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
