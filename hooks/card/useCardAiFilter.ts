'use client';

import { useState, useCallback } from 'react';
import type { CardFilter } from '@/models/shared/Filter';
import type { AiFeedbackRating } from '@/models/ai/AiFeedback';
import {
  generateCardFilterFromQuery,
  submitAiFilterFeedback,
} from '@/services/card/cardAiFilterService';

interface AiSearchResult {
  userInput: string;
  filter: CardFilter;
  latencyMs: number;
}

interface UseCardAiFilterReturn {
  loading: boolean;
  error: string | null;
  aiSearchResult: AiSearchResult | null;
  feedbackSubmitted: boolean;
  applyAiFilter: (query: string) => Promise<CardFilter | null>;
  submitFeedback: (rating: AiFeedbackRating, comment?: string) => Promise<void>;
}

export function useCardAiFilter(): UseCardAiFilterReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSearchResult, setAiSearchResult] = useState<AiSearchResult | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const applyAiFilter = useCallback(async (query: string): Promise<CardFilter | null> => {
    if (!query.trim()) return null;

    setLoading(true);
    setError(null);
    setAiSearchResult(null);
    setFeedbackSubmitted(false);

    try {
      const { filter, latencyMs } = await generateCardFilterFromQuery(query.trim());
      setAiSearchResult({ userInput: query.trim(), filter, latencyMs });
      return filter;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI検索に失敗しました';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(
    async (rating: AiFeedbackRating, comment?: string): Promise<void> => {
      if (!aiSearchResult) return;

      try {
        await submitAiFilterFeedback({
          userInput: aiSearchResult.userInput,
          aiResponse: aiSearchResult.filter,
          rating,
          comment: comment || null,
          latencyMs: aiSearchResult.latencyMs,
        });
        setFeedbackSubmitted(true);
      } catch {
        // フィードバック失敗はサイレントに扱う（ユーザー体験を損なわないため）
      }
    },
    [aiSearchResult]
  );

  return { loading, error, aiSearchResult, feedbackSubmitted, applyAiFilter, submitFeedback };
}
