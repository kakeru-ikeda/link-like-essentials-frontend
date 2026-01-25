import { useState } from 'react';
import Link from 'next/link';
import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { HashtagChips } from '@/components/deck/HashtagChips';
import { useDeckLike } from '@/hooks/deck/useDeckLike';
import { Tooltip } from '@/components/common/Tooltip';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Loading } from '../common/Loading';

interface PublishedDeckCardProps {
  deck: PublishedDeck;
  onHashtagSelect?: (tag: string) => void;
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ja-JP');

export const PublishedDeckCard: React.FC<PublishedDeckCardProps> = ({
  deck,
  onHashtagSelect,
}) => {
  const {
    id,
    deck: baseDeck,
    likeCount: initialLikeCount,
    viewCount,
    hashtags,
    imageUrls,
    thumbnail,
    publishedAt,
    likedByCurrentUser,
  } = deck;

  const {
    liked,
    likeCount,
    toggleLike,
    loading: likeLoading,
    error: likeError,
  } = useDeckLike({
    deckId: id,
    initialLiked: likedByCurrentUser,
    initialLikeCount,
  });

  // 画像スライダー用の状態
  const allImages = [thumbnail, ...(imageUrls || [])].filter(
    (url): url is string => !!url
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handlePrevImage = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
    setImageLoading(true);
  };

  const handleNextImage = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const hasMultipleImages = allImages.length > 1;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="relative bg-slate-50 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link href={`/decks/${id}`} className="block">
          <div className="flex h-[360px] items-center justify-center overflow-hidden">
            {allImages.length > 0 ? (
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${baseDeck.name} の画像 ${currentImageIndex + 1}`}
                  className={`h-full w-full object-contain transition-all duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  } ${isHovering ? 'scale-105' : 'scale-100'}`}
                  onLoad={handleImageLoad}
                />
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                    <Loading fullScreen={false} message="読み込み中" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                サムネイルなし
              </div>
            )}
          </div>
        </Link>

        {/* 画像ナビゲーションボタン */}
        {hasMultipleImages && isHovering && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              aria-label="前の画像"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              aria-label="次の画像"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        )}

        {/* 画像インジケーター */}
        {hasMultipleImages && isHovering && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-black/40 px-2 py-1.5 shadow-lg backdrop-blur-sm">
            {allImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'h-1.5 w-6 bg-white shadow-md'
                    : 'h-1.5 w-1.5 bg-white/50 hover:bg-white/70 hover:scale-110'
                }`}
                aria-label={`画像 ${index + 1} を表示`}
              />
            ))}
          </div>
        )}

        {isHovering && (
          <button
            type="button"
            onClick={toggleLike}
            disabled={likeLoading}
            className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
              liked
                ? 'bg-rose-600 text-white shadow-[0_6px_20px_rgba(244,63,94,0.25)] hover:bg-rose-700'
                : 'bg-black/60 text-white shadow-md backdrop-blur-sm hover:bg-black/70'
            }`}
            aria-pressed={liked}
          >
            <span className="sr-only">いいね</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>{likeCount}</span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 break-words">
              {baseDeck.name}
            </h3>
            <div className="flex items-center gap-2 pt-1">
              <UserAvatar
                userProfile={deck.userProfile}
                size="sm"
                showTooltip={!!deck.userProfile}
              />
              <p className="text-sm text-slate-600">
                {deck.userProfile?.displayName || '匿名ユーザー'}
              </p>
            </div>
            <p className="text-xs text-slate-500 pt-2">閲覧数: {viewCount}</p>
            <p className="text-xs text-slate-500 pt-2">
              公開日: {publishedAt ? formatDate(publishedAt) : '不明'}
            </p>
          </div>
          {typeof baseDeck.score === 'number' && baseDeck.score > 0 && (
            <div className="flex flex-col items-end gap-1 text-xs text-slate-600">
              <Tooltip content="参考スコア" position="bottom">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                  <span
                    className="flex items-center gap-1"
                    aria-label="参考スコア"
                  >
                    {baseDeck.score}兆<span className="text-[0.8em]">LOVE</span>
                  </span>
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        {hashtags?.length > 0 && (
          <HashtagChips
            tags={hashtags.map((tag) => ({ tag }))}
            className="text-xs text-slate-700"
            gapClassName="gap-2"
            onSelect={onHashtagSelect}
          />
        )}

        {likeError && (
          <p className="rounded-lg border border-pink-100 bg-pink-50 px-3 py-2 text-xs text-pink-700">
            {likeError}
          </p>
        )}

        <Link
          href={`/decks/${id}`}
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
};
