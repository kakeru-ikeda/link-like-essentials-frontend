import { useCallback, useEffect, useRef, useState } from 'react';
import { PopularHashtagSummary } from '@/models/published-deck/Hashtag';
import { publishedDeckService } from '@/services/published-deck/publishedDeckService';
import { useAuth } from '@/hooks/auth/useAuth';

interface UsePopularHashtagsState extends PopularHashtagSummary {
  loading: boolean;
  error: string | null;
}

const initialState: UsePopularHashtagsState = {
  hashtags: [],
  aggregatedAt: null,
  loading: false,
  error: null,
};

export const usePopularHashtags = () => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<UsePopularHashtagsState>(initialState);

  const fetchPopularHashtags = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await publishedDeckService.getPopularHashtags();
      setState({ ...result, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : '人気ハッシュタグの取得に失敗しました';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  const fetchPopularHashtagsRef = useRef(fetchPopularHashtags);
  fetchPopularHashtagsRef.current = fetchPopularHashtags;

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPopularHashtagsRef.current();
  }, [isAuthenticated]);

  const refresh = useCallback(() => {
    if (!isAuthenticated) return;
    fetchPopularHashtagsRef.current();
  }, [isAuthenticated]);

  return {
    hashtags: state.hashtags,
    aggregatedAt: state.aggregatedAt,
    loading: state.loading,
    error: state.error,
    refresh,
  };
};
