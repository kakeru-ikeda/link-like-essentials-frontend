import type { CardFilter } from '@/models/shared/Filter';
import { AI_API_ENDPOINT } from '@/config/api';
import { getAuthToken } from './authUtils';

export const aiRepository = {
  /**
   * 自然言語クエリからカードフィルターを生成する
   * @param query - 自然言語クエリ
   * @returns AI が生成した CardFilter
   */
  async generateCardFilter(query: string): Promise<CardFilter> {
    const token = await getAuthToken();

    const response = await fetch(`${AI_API_ENDPOINT}/ai/cards/filter-query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'AI検索に失敗しました');
    }

    const data = await response.json();
    return data.filter as CardFilter;
  },
};
