"use client";

import { useEffect, useState } from 'react';
import { Deck } from '@/models/Deck';
import { PublishedDeck } from '@/models/PublishedDeck';
import { publishedDeckService } from '@/services/publishedDeckService';
import { useDeckLike } from '@/hooks/useDeckLike';

interface PublishedDeckActionsProps {
  deck: PublishedDeck;
  compiledDeck?: Deck | null;
  onImport?: () => Promise<void>;
  importing?: boolean;
  importError?: string | null;
  compiling?: boolean;
}

const formatNumber = (value: number) => value.toLocaleString('ja-JP');

export const PublishedDeckActions: React.FC<PublishedDeckActionsProps> = ({
  deck,
  compiledDeck,
  onImport,
  importing = false,
  importError,
  compiling = false,
}) => {
  const [viewCount, setViewCount] = useState(deck.viewCount);

  const {
    liked,
    likeCount,
    loading: likeLoading,
    error: likeError,
    toggleLike,
  } = useDeckLike({
    deckId: deck.id,
    initialLiked: deck.likedByCurrentUser ?? false,
    initialLikeCount: deck.likeCount ?? 0,
  });
  const canImport = !!compiledDeck && !!onImport && !importing && !compiling;

  const actionPillBase =
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60';
  const statChipClasses =
    'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm';
  const importButtonClasses =
    'inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300 hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60';

  useEffect(() => {
    setViewCount(deck.viewCount);
  }, [deck]);

  useEffect(() => {
    let cancelled = false;

    const updateViewCount = async () => {
      try {
        const updated = await publishedDeckService.incrementViewCount(deck.id);
        if (!cancelled) {
          setViewCount(updated);
        }
      } catch (error) {
        // count更新失敗はUIだけで完結させる
        console.error('閲覧数の更新に失敗しました', error);
      }
    };

    updateViewCount();

    return () => {
      cancelled = true;
    };
  }, [deck.id]);

  const handleToggleLike = async () => {
    if (likeLoading) return;
    await toggleLike();
  };

  const handleImport = async () => {
    if (!canImport || !onImport) return;
    await onImport();
  };

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={likeLoading}
          className={`${actionPillBase} ${
            liked
              ? 'bg-rose-600 text-white shadow-[0_6px_20px_rgba(244,63,94,0.25)] hover:bg-rose-700'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
          aria-pressed={liked}
        >
          <span className="text-base">{liked ? '♥' : '♡'}</span>
          <span>{formatNumber(likeCount)}</span>
          <span className="text-xs font-normal opacity-80">いいね</span>
        </button>

        <div className={statChipClasses}>
          <span className="text-base" aria-hidden>
            👁
          </span>
          <span className="text-sm font-semibold">{formatNumber(viewCount)}</span>
          <span className="text-xs text-slate-500">閲覧</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <button
          type="button"
          onClick={handleImport}
          disabled={!canImport}
          className={`${importButtonClasses} bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 hover:from-slate-800 hover:to-slate-700`}
        >
          <span>📥</span>
          <span>{importing ? 'インポート中...' : compiling ? 'コンパイル中...' : 'インポートして編集'}</span>
        </button>

        {(likeError || importError) && (
          <div className="text-xs text-red-600" role="alert">
            {likeError || importError}
          </div>
        )}
      </div>
    </div>
  );
};
