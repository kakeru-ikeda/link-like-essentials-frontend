import { MicrocmsListResponse } from '@/models/shared/Microcms';
import { News } from '@/models/features/News';
import { newsRepository } from '@/repositories/api/newsRepository';

export const newsService = {
  async getNewsList(limit = 20): Promise<MicrocmsListResponse<News>> {
    return newsRepository.getNewsList(limit);
  },

  async getNews(id: string): Promise<News> {
    return newsRepository.getNews(id);
  },
};
