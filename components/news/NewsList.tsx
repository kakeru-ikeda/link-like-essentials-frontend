import { News } from '@/models/news/News';
import { NewsCard } from './NewsCard';

interface NewsListProps {
  news: News[];
}

export function NewsList({ news }: NewsListProps): JSX.Element {
  if (news.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
        現在表示できるお知らせはありません。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
