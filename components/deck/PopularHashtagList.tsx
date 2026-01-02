import { PopularHashtag } from '@/models/Hashtag';

interface PopularHashtagListProps {
  hashtags: PopularHashtag[];
  aggregatedAt: string | null;
  loading: boolean;
  error: string | null;
  onSelect: (hashtag: string) => void;
  onRetry: () => void;
  limit?: number;
}

export const PopularHashtagList = ({
  hashtags,
  aggregatedAt,
  loading,
  error,
  onSelect,
  onRetry,
  limit = 10,
}: PopularHashtagListProps) => {
  const displayTags = hashtags.slice(0, limit);

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-800">人気のハッシュタグ</h2>
      </div>

      {loading && <div className="text-sm text-slate-600">読み込み中...</div>}

      {!loading && error && (
        <div className="flex items-center justify-between rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            再読み込み
          </button>
        </div>
      )}

      {!loading && !error && displayTags.length === 0 && (
        <div className="text-sm text-slate-600">集計されたハッシュタグがありません。</div>
      )}

      {!loading && !error && displayTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {displayTags.map((item) => {
            const label = item.hashtag.startsWith('#') ? item.hashtag : `#${item.hashtag}`;
            return (
              <button
                key={item.hashtag}
                type="button"
                onClick={() => onSelect(item.hashtag)}
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span>{label}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-blue-700 group-hover:bg-blue-700 group-hover:text-white">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
