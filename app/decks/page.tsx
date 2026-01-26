"use client";

import { PublishedDeckList } from '@/components/deck/PublishedDeckList';
import { TagFilterBar } from '@/components/deck/TagFilterBar';
import { useDecksPageController } from '@/hooks/published-deck/useDecksPageController';
import { usePopularHashtags } from '@/hooks/features/usePopularHashtags';

export default function DecksPage() {
  const {
    decks,
    pageInfo,
    loading,
    error,
    goToPage,
    params,
    tagInput,
    setTagInput,
    handleSortChange,
    handleOrderChange,
    handleTagSubmit,
    handleTagReset,
    handleHashtagSelect,
  } = useDecksPageController();

  const {
    hashtags,
    aggregatedAt,
    loading: hashtagsLoading,
    error: hashtagsError,
    refresh: refreshPopularHashtags,
  } = usePopularHashtags();

  const handlePrev = () => {
    if (pageInfo?.hasPreviousPage) {
      goToPage((pageInfo.currentPage ?? 1) - 1);
    }
  };

  const handleNext = () => {
    if (pageInfo?.hasNextPage) {
      goToPage((pageInfo.currentPage ?? 1) + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">投稿デッキ</h1>
          <p className="text-sm text-gray-600">公開されたデッキを閲覧・インポートできます。</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="text-xs text-slate-500">並び替え</span>
            <select
              value={params.orderBy}
              onChange={(e) => handleSortChange(e.target.value as 'publishedAt' | 'viewCount' | 'likeCount')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <option value="publishedAt">新着順</option>
              <option value="viewCount">閲覧数</option>
              <option value="likeCount">いいね数</option>
            </select>
            <select
              value={params.order}
              onChange={(e) => handleOrderChange(e.target.value as 'asc' | 'desc')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <option value="desc">降順</option>
              <option value="asc">昇順</option>
            </select>
          </div>
        </div>
      </div>

      <TagFilterBar
        tagInput={tagInput}
        onTagInputChange={setTagInput}
        onSubmit={handleTagSubmit}
        onReset={handleTagReset}
        hashtags={hashtags}
        aggregatedAt={aggregatedAt}
        loading={hashtagsLoading}
        error={hashtagsError}
        onSelect={handleHashtagSelect}
        onRetry={refreshPopularHashtags}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          取得中...
        </div>
      ) : (
        <PublishedDeckList decks={decks} onHashtagSelect={handleHashtagSelect} />
      )}

      {pageInfo && (
        <div className="mt-8 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <div>
            ページ {pageInfo.currentPage} / {pageInfo.totalPages}（全 {pageInfo.totalCount} 件）
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!pageInfo.hasPreviousPage}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              前へ
            </button>
            <button
              onClick={handleNext}
              disabled={!pageInfo.hasNextPage}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              次へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
