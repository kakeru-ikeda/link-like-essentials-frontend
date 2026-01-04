import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetDecksParams } from '@/models/DeckQueryParams';
import { PublishedDeck } from '@/models/PublishedDeck';
import { PageInfo } from '@/models/Pagination';
import { useAuth } from './useAuth';
import { publishedDeckService } from '@/services/publishedDeckService';

interface UseMyDecksState {
  decks: PublishedDeck[];
  pageInfo: PageInfo | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PER_PAGE = 4;

/**
 * 自分が投稿したデッキ一覧を取得するフック
 */
export const useMyDecks = (initialParams?: Partial<GetDecksParams>) => {
  const { isAuthenticated } = useAuth();

  const [{ decks, pageInfo, loading, error }, setState] = useState<UseMyDecksState>({
    decks: [],
    pageInfo: null,
    loading: false,
    error: null,
  });

  const [params, setParams] = useState<GetDecksParams>({
    page: 1,
    perPage: DEFAULT_PER_PAGE,
    orderBy: 'publishedAt',
    order: 'desc',
    ...initialParams,
  });

  const requestParams: GetDecksParams = useMemo(
    () => ({
      page: params.page,
      perPage: params.perPage,
      orderBy: params.orderBy,
      order: params.order,
      songId: params.songId,
      tag: params.tag,
    }),
    [params.order, params.orderBy, params.page, params.perPage, params.songId, params.tag]
  );

  const fetchDecks = useCallback(async (nextParams: GetDecksParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await publishedDeckService.getMyDecks(nextParams);
      setState({
        decks: response.data,
        pageInfo: response.pageInfo,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '投稿デッキ一覧の取得に失敗しました';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDecks(requestParams);
  }, [fetchDecks, isAuthenticated, requestParams]);

  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
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
    params,
    setParams,
  };
};
