import { NewsList } from '@/components/news/NewsList';
import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/repositories/api/newsRepository';
import { newsService } from '@/services/newsService';

export const revalidate = DEFAULT_MICROCMS_REVALIDATE_SECONDS;

export default async function NewsPage() {
  const { contents: newsItems } = await newsService.getNewsList(50);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">お知らせ</h1>
        <p className="text-sm text-gray-600">最新の更新情報をお届けします。</p>
      </div>
      <NewsList news={newsItems} />
    </div>
  );
}
