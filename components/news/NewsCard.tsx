import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/models/News';
import { formatNewsDate } from '@/utils/dateUtils';

interface NewsCardProps {
  news: News;
}

const NEWS_EXCERPT_DEFAULT_LENGTH = 140;

function buildExcerpt(body: string | undefined, length = NEWS_EXCERPT_DEFAULT_LENGTH): string {
  if (!body) return '';

  const plainText = body.replace(/<[^>]+>/g, '');
  if (plainText.length <= length) return plainText;
  return `${plainText.slice(0, length)}...`;
}

export function NewsCard({ news }: NewsCardProps): JSX.Element {
  const publishedText = formatNewsDate(news.publishedAt ?? news.createdAt);
  const excerpt = buildExcerpt(news.body ?? news.content);
  const thumbnailUrl = news.thumbnail?.url;
  const category = news.category?.name;

  return (
    <Link
      href={`/news/${news.id}`}
      className="block rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <article>
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-slate-100">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={news.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-500">
              No thumbnail
            </div>
          )}
        </div>

        <div className="flex min-h-[180px] flex-col px-5 pb-5 pt-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold leading-snug text-slate-900 line-clamp-2">
              {news.title}
            </h2>
            {publishedText && (
              <p className="text-xs text-slate-500">公開日: {publishedText}</p>
            )}
            <p className="text-sm leading-relaxed text-slate-700 line-clamp-3">{excerpt}</p>
          </div>
          {category && (
            <span className="mt-auto inline-flex items-center self-start rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {category}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
