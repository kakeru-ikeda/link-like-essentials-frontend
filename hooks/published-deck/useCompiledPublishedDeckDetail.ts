import { useEffect, useState } from 'react';
import { Deck } from '@/models/domain/Deck';
import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { usePublishedDeckDetail } from '@/hooks/published-deck/usePublishedDeckDetail';
import { DeckService } from '@/services/deck/deckService';

interface UseCompiledPublishedDeckDetailResult {
  publishedDeckLoading: boolean;
  publishedDeckError: string | null;
  publishedDeck: PublishedDeck | null;
  compiledDeck: Deck | null;
  compiling: boolean;
  compileError: string | null;
  refresh: () => void;
}

/**
 * 公開デッキ詳細取得 + Deck型へコンパイルするための共通フック
 * - usePublishedDeckDetail を呼んだあと DeckService.compilePublishedDeck を実行
 */
export const useCompiledPublishedDeckDetail = (deckId: string | null): UseCompiledPublishedDeckDetailResult => {
  const { deck: publishedDeck, loading, error, refresh } = usePublishedDeckDetail(deckId);
  const [compiledDeck, setCompiledDeck] = useState<Deck | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  useEffect(() => {
    if (!publishedDeck) {
      setCompiledDeck(null);
      return;
    }

    let cancelled = false;
    const runCompile = async () => {
      setCompiling(true);
      setCompileError(null);
      try {
        const deck = await DeckService.compilePublishedDeck(publishedDeck);
        if (!cancelled) {
          setCompiledDeck(deck);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'デッキのコンパイルに失敗しました';
          setCompileError(message);
          setCompiledDeck(null);
        }
      } finally {
        if (!cancelled) {
          setCompiling(false);
        }
      }
    };

    runCompile();

    return () => {
      cancelled = true;
    };
  }, [publishedDeck]);

  return {
    publishedDeckLoading: loading,
    publishedDeckError: error,
    publishedDeck,
    compiledDeck,
    compiling,
    compileError,
    refresh,
  };
};
