'use client';

import { useState, useCallback } from 'react';
import type { CardFilter } from '@/models/shared/Filter';
import { generateCardFilterFromQuery } from '@/services/card/cardAiFilterService';

interface UseCardAiFilterReturn {
  loading: boolean;
  error: string | null;
  applyAiFilter: (query: string) => Promise<CardFilter | null>;
}

export function useCardAiFilter(): UseCardAiFilterReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyAiFilter = useCallback(async (query: string): Promise<CardFilter | null> => {
    if (!query.trim()) return null;

    setLoading(true);
    setError(null);

    try {
      const filter = await generateCardFilterFromQuery(query.trim());
      return filter;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI検索に失敗しました';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, applyAiFilter };
}
