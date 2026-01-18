import { MicroCMSQueries } from 'microcms-js-sdk';
import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/config/microcms';
import { MicrocmsListResponse } from '@/models/Microcms';
import { News } from '@/models/News';
import { getMicrocmsList, getMicrocmsObject } from './microcmsRepository';

const NEWS_ENDPOINT = 'news';

export const newsRepository = {
  async getNewsList(
    limit = 20,
    queries?: MicroCMSQueries,
    revalidateSeconds = DEFAULT_MICROCMS_REVALIDATE_SECONDS,
  ): Promise<MicrocmsListResponse<News>> {
    return getMicrocmsList<News>({
      endpoint: NEWS_ENDPOINT,
      queries: {
        limit,
        ...queries,
        orders: queries?.orders ?? '-publishedAt',
      },
      revalidateSeconds,
    });
  },

  async getNews(
    id: string,
    queries?: MicroCMSQueries,
    revalidateSeconds = DEFAULT_MICROCMS_REVALIDATE_SECONDS,
  ): Promise<News> {
    return getMicrocmsObject<News>({
      endpoint: `${NEWS_ENDPOINT}/${id}`,
      queries,
      revalidateSeconds,
    });
  },
};
export type { MicroCMSQueries };
