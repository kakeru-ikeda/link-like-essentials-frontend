import { useCallback, useEffect, useState } from 'react';
import { publishedDeckService } from '@/services/publishedDeckService';
import { useAuth } from './useAuth';

interface UseDeckLikeOptions {
  deckId: string;
  initialLiked?: boolean;
  initialLikeCount?: number;
}

/**
 * 公開デッキのいいね状態を管理するカスタムフック
 */
export const useDeckLike = ({ deckId, initialLiked = false, initialLikeCount = 0 }: UseDeckLikeOptions) => {
  const { isAuthenticated } = useAuth();

  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLiked(Boolean(initialLiked));
  }, [initialLiked]);

  useEffect(() => {
    setLikeCount(initialLikeCount ?? 0);
  }, [initialLikeCount]);

  const toggleLike = useCallback(async () => {
    if (loading) return;
    if (!isAuthenticated) {
      setError('いいねするにはログインが必要です');
      return;
    }

    setError(null);

    const previousLiked = liked;
    const optimisticLiked = !liked;
    const delta = optimisticLiked ? 1 : -1;

    setLiked(optimisticLiked);
    setLikeCount((prev) => Math.max(0, prev + delta));
    setLoading(true);

    try {
      const latestCount = optimisticLiked
        ? await publishedDeckService.likeDeck(deckId)
        : await publishedDeckService.unlikeDeck(deckId);
      setLikeCount(latestCount);
    } catch (err) {
      setLiked(previousLiked);
      setLikeCount((prev) => Math.max(0, prev - delta));
      const message = err instanceof Error ? err.message : 'いいねの更新に失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [deckId, isAuthenticated, liked, loading]);

  return {
    liked,
    likeCount,
    loading,
    error,
    toggleLike,
  };
};
