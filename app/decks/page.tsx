"use client";

import { PublishedDeckList } from '@/components/deck/PublishedDeckList';
import { useDecksPageController } from '@/hooks/useDecksPageController';

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
  } = useDecksPageController();

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

      <form onSubmit={handleTagSubmit} className="mb-4 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-medium text-slate-700">タグで絞り込み</div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
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
              onClick={handleTagReset}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              クリア
            </button>
          </div>
        </div>
      </form>

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
        <PublishedDeckList decks={decks} />
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
