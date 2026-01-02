import { notFound } from 'next/navigation';
import { News } from '@/models/News';
import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/repositories/api/newsRepository';
import { newsService } from '@/services/newsService';
import { formatNewsDate } from '@/utils/dateUtils';

interface NewsPageProps {
  params: { id: string };
}

export const revalidate = DEFAULT_MICROCMS_REVALIDATE_SECONDS;

export default async function NewsDetailPage({ params }: NewsPageProps) {
  let news: News | null = null;

  try {
    news = await newsService.getNews(params.id);
  } catch (error) {
    console.error('Failed to fetch news detail', error);
    notFound();
  }

  if (!news) {
    notFound();
  }

  const publishedText = formatNewsDate(news.publishedAt ?? news.createdAt);
  const category = news.category?.name;
  const html = news.content ?? news.body ?? '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-2">
        <p className="text-xs text-slate-500">公開日: {publishedText}</p>
        <h1 className="text-3xl font-bold text-gray-900 leading-snug">{news.title}</h1>
      </div>

      <div
        className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {category && (
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}
