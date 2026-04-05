import type { CardFilter } from '@/models/shared/Filter';
import type { AiFeedbackRequest, AiFeedbackResponse } from '@/models/ai/AiFeedback';
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
      throw new Error(error.error?.message || 'AI検索に失敗しました');
    }

    const data = await response.json();
    return data.filter as CardFilter;
  },

  /**
   * AI フィルター生成結果のフィードバックを送信する
   * @param request - フィードバックリクエスト
   * @returns feedbackId
   */
  async submitFeedback(request: AiFeedbackRequest): Promise<AiFeedbackResponse> {
    const token = await getAuthToken();

    const response = await fetch(`${AI_API_ENDPOINT}/ai/cards/filter-query/feedback`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'フィードバックの送信に失敗しました');
    }

    return response.json() as Promise<AiFeedbackResponse>;
  },
};
