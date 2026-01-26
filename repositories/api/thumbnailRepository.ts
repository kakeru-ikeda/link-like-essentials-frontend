import { DECK_API_ENDPOINT } from '@/config/api';
import { getAuthToken } from './authUtils';
import type { GenerateThumbnailRequest, GenerateThumbnailResponse } from '@/models/deck/Thumbnail';

export const thumbnailRepository = {
  async generateThumbnail(request: GenerateThumbnailRequest): Promise<string> {
    const token = await getAuthToken();

    const response = await fetch(`${DECK_API_ENDPOINT}/thumbnails/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'サムネイルの生成に失敗しました');
    }

    const data: GenerateThumbnailResponse = await response.json();
    return data.thumbnailUrl;
  },
};
