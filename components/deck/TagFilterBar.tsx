import { FormEvent } from 'react';
import { PopularHashtag } from '@/models/features/Hashtag';
import { HashtagChips } from '@/components/deck/HashtagChips';

interface TagFilterBarProps {
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  hashtags: PopularHashtag[];
  aggregatedAt: string | null;
  loading: boolean;
  error: string | null;
  onSelect: (hashtag: string) => void;
  onRetry: () => void;
  limit?: number;
}

export const TagFilterBar = ({
  tagInput,
  onTagInputChange,
  onSubmit,
  onReset,
  hashtags,
  aggregatedAt,
  loading,
  error,
  onSelect,
  onRetry,
  limit = 12,
}: TagFilterBarProps) => {
  const displayTags = hashtags.slice(0, limit);

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-medium text-slate-700">タグで絞り込み</div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            placeholder="#タグ名を入力"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm sm:w-64 text-black"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              適用
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              クリア
            </button>
          </div>
        </div>
      </form>

      {loading && <div className="mt-2 text-sm text-slate-600">読み込み中...</div>}

      {!loading && error && (
        <div className="mt-2 flex items-center justify-between rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
        <div className="mt-2 text-sm text-slate-600">集計されたハッシュタグがありません。</div>
      )}

      {!loading && !error && displayTags.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <HashtagChips
            tags={displayTags.map((item) => ({ tag: item.hashtag, count: item.count }))}
            showCount
            onSelect={onSelect}
            className="w-max"
            gapClassName="gap-2"
          />
        </div>
      )}
    </div>
  );
};
