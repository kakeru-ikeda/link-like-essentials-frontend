import type { CardFilter } from '@/models/shared/Filter';
import { aiRepository } from '@/repositories/api/aiRepository';

/**
 * 自然言語クエリからカードフィルターを生成する
 * @param query - 自然言語クエリ
 * @returns AI が生成した CardFilter
 */
export async function generateCardFilterFromQuery(query: string): Promise<CardFilter> {
  return aiRepository.generateCardFilter(query);
}
