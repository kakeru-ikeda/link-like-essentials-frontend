import type { CardFilter } from '@/models/shared/Filter';
import type { AiFeedbackRating } from '@/models/ai/AiFeedback';
import { aiRepository } from '@/repositories/api/aiRepository';

/**
 * 自然言語クエリからカードフィルターを生成する
 * @param query - 自然言語クエリ
 * @returns AI が生成した CardFilter と計測レイテンシ(ms)
 */
export async function generateCardFilterFromQuery(
  query: string
): Promise<{ filter: CardFilter; latencyMs: number }> {
  const start = Date.now();
  const filter = await aiRepository.generateCardFilter(query);
  const latencyMs = Date.now() - start;
  return { filter, latencyMs };
}

/**
 * AI フィルター生成結果のフィードバックを送信する
 */
export async function submitAiFilterFeedback(params: {
  userInput: string;
  aiResponse: CardFilter;
  rating: AiFeedbackRating;
  comment?: string | null;
  latencyMs?: number | null;
}): Promise<void> {
  await aiRepository.submitFeedback({
    ...params,
    correctedFilter: null,
  });
}
