import Link from 'next/link';
import { PublishedDeck } from '@/models/PublishedDeck';
import { DeckType } from '@/models/enums';
import { HashtagChips } from '@/components/deck/HashtagChips';
import { useDeckLike } from '@/hooks/useDeckLike';

interface PublishedDeckCardProps {
  deck: PublishedDeck;
  onHashtagSelect?: (tag: string) => void;
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ja-JP');

const formatDeckType = (deckType?: DeckType) => {
  if (!deckType) return 'デッキタイプ不明';
  return deckType;
};

export const PublishedDeckCard: React.FC<PublishedDeckCardProps> = ({ deck, onHashtagSelect }) => {
  const {
    id,
    deck: baseDeck,
    userName,
    likeCount: initialLikeCount,
    viewCount,
    hashtags,
    thumbnail,
    publishedAt,
    likedByCurrentUser,
  } = deck;

  const { liked, likeCount, toggleLike, loading: likeLoading, error: likeError } = useDeckLike({
    deckId: id,
    initialLiked: likedByCurrentUser,
    initialLikeCount,
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative bg-slate-50">
        <div className="flex h-[360px] items-center justify-center overflow-hidden">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={`${baseDeck.name} のサムネイル`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">サムネイルなし</div>
          )}
        </div>

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
          <span>{formatDeckType(baseDeck.deckType)}</span>
        </div>

        <button
          type="button"
          onClick={toggleLike}
          disabled={likeLoading}
          className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
            liked
              ? 'border-pink-400 bg-pink-500 text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600'
              : 'border-white/70 bg-white/90 text-slate-800 shadow-sm hover:bg-white'
          } disabled:cursor-not-allowed disabled:opacity-70`}
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
              d="M12 21s-7.5-4.9-9.5-9.5C1.4 8.6 3.1 5 6.5 5c2.1 0 3.4 1.6 4 2.6.6-1 1.9-2.6 4-2.6 3.4 0 5.1 3.6 4 6.5C19.5 16.1 12 21 12 21z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 break-words">{baseDeck.name}</h3>
            <p className="text-sm text-slate-600">by {userName || '匿名ユーザー'}</p>
            <p className="text-xs text-slate-500 pt-2">公開日: {publishedAt ? formatDate(publishedAt) : '不明'}</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-xs text-slate-600">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-slate-700">
              <span className="flex items-center gap-1" aria-label="閲覧数">
                <span aria-hidden>👁</span>
                {viewCount}
              </span>

            </div>
          </div>
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
          <p className="rounded-lg border border-pink-100 bg-pink-50 px-3 py-2 text-xs text-pink-700">{likeError}</p>
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
