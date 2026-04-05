import { useState, useEffect, useCallback } from 'react';
import { fetchCards, fetchCardById, fetchCardsByIds } from '@/repositories/sanity/cardRepository';
import { Card } from '@/models/card/Card';
import { CardFilter } from '@/models/shared/Filter';
import { filterCardsOnClient } from '@/services/card/cardFilterService';

/**
 * カード一覧を取得するフック（Sanity GROQ 全件取得）
 * フィルタリングはクライアントサイドで処理する。
 *
 * @param filter カードフィルター（省略時は全件表示）
 * @param skip フェッチをスキップするかどうか
 * @returns カード配列、ローディング状態、エラーメッセージ、無限スクロール関連
 */
export const useCards = (filter?: CardFilter, skip?: boolean) => {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | undefined>();

  const fetchAllCards = useCallback(async () => {
    if (skip) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);
    try {
      const cards = await fetchCards();
      setAllCards(cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [skip]);

  // 初回マウント時と skip 解除時のみ取得
  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  const filteredCards = filter ? filterCardsOnClient(allCards, filter) : allCards;

  return {
    cards: filteredCards,
    allCards,
    loading,
    error,
    hasMore: false,
    isFetchingMore: false,
    loadMore: async () => {},
  };
};

/**
 * カード詳細を取得するフック（Sanity GROQ）
 *
 * @param id カードID（Sanity _id）
 * @returns カード詳細、ローディング状態、エラーメッセージ
 */
export const useCardDetail = (id: string) => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    fetchCardById(id)
      .then(result => {
        if (!cancelled) setCard(result);
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : '取得に失敗しました');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { card, loading, error };
};

/**
 * 複数カードをバッチで取得するフック（Sanity GROQ）
 *
 * @param cardIds カードIDの配列（Sanity _id）
 * @returns カード配列、ローディング状態、エラーメッセージ
 */
export const useBatchCardDetails = (cardIds: string[]) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(cardIds.length > 0);
  const [error, setError] = useState<string | undefined>();

  const idsKey = JSON.stringify([...cardIds].sort());

  useEffect(() => {
    if (cardIds.length === 0) {
      setCards([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(undefined);
    fetchCardsByIds(cardIds)
      .then(result => {
        if (!cancelled) setCards(result);
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : '取得に失敗しました');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return { cards, loading, error };
};
