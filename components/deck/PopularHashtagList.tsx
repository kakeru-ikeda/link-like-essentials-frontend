import { HashtagChips } from '@/components/deck/HashtagChips';
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
        <div className="mt-2">
          <HashtagChips
            tags={displayTags.map((item) => ({ tag: item.hashtag, count: item.count }))}
            showCount
            onSelect={onSelect}
            gapClassName="gap-2"
          />
        </div>
      )}
    </div>
  );
};
