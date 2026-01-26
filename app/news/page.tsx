import type { Metadata } from 'next';
import { NewsList } from '@/components/news/NewsList';
import { newsService } from '@/services/user/newsService';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'お知らせ',
  description: '最新の更新情報をお届けします。',
});

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
