"use client";

import { PublishedDeckList } from '@/components/deck/PublishedDeckList';
import { usePublishedDecks } from '@/hooks/usePublishedDecks';

export default function DecksPage() {
  const { decks, pageInfo, loading, error, goToPage } = usePublishedDecks();

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
      </div>

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
