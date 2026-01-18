import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/config/microcms';
import { News } from '@/models/News';
import { newsService } from '@/services/newsService';
import { formatNewsDate } from '@/utils/dateUtils';
import { buildPageMetadata } from '@/utils/metadataUtils';

interface NewsPageProps {
  params: { id: string };
}

export const revalidate = DEFAULT_MICROCMS_REVALIDATE_SECONDS;

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  try {
    const newsArticle = await newsService.getNews(params.id);
    const rawDescription = newsArticle.content ?? newsArticle.body ?? '';
    const plainDescription = rawDescription.replace(/<[^>]*>/g, '').slice(0, 120) || undefined;
    const ogImagePath = newsArticle.thumbnail?.url;

    return buildPageMetadata({
      title: newsArticle.title,
      description: plainDescription ?? 'お知らせの詳細を表示します。',
      ogImagePath,
    });
  } catch (error) {
    return buildPageMetadata({
      title: 'お知らせ',
      description: 'お知らせの詳細を表示します。',
    });
  }
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  let newsArticle: News | null = null;

  try {
    newsArticle = await newsService.getNews(params.id);
  } catch (error) {
    notFound();
  }

  const publishedText = formatNewsDate(newsArticle.publishedAt ?? newsArticle.createdAt);
  const category = newsArticle.category?.name;
  const html = newsArticle.content ?? newsArticle.body ?? '';
  const sanitizedHtml = sanitizeHtml(html);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-2">
        <p className="text-xs text-slate-500">公開日: {publishedText}</p>
        <h1 className="text-3xl font-bold text-gray-900 leading-snug">{newsArticle.title}</h1>
      </div>

      <div
        className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
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
