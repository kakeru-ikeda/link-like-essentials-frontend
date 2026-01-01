import { useCallback, useEffect, useState } from 'react';
import { PublishedDeck } from '@/models/PublishedDeck';
import { useAuth } from './useAuth';
import { publishedDeckService } from '@/services/publishedDeckService';

interface UsePublishedDeckDetailState {
  deck: PublishedDeck | null;
  loading: boolean;
  error: string | null;
}

export const usePublishedDeckDetail = (deckId: string | null) => {
  const { isAuthenticated } = useAuth();
  const [{ deck, loading, error }, setState] = useState<UsePublishedDeckDetailState>({
    deck: null,
    loading: false,
    error: null,
  });

  const fetchDeck = useCallback(async () => {
    if (!deckId) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await publishedDeckService.getDeck(deckId);
      setState({ deck: data, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'デッキの取得に失敗しました';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [deckId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDeck();
  }, [fetchDeck, isAuthenticated]);

  return {
    deck,
    loading,
    error,
    refresh: fetchDeck,
  };
};
