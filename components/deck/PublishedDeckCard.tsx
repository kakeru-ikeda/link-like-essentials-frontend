import Link from 'next/link';
import { PublishedDeck } from '@/models/PublishedDeck';
import { DeckType } from '@/models/enums';
import { HashtagChips } from '@/components/deck/HashtagChips';

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
  const { id, deck: baseDeck, userName, likeCount, viewCount, hashtags, thumbnail, publishedAt } = deck;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-center bg-slate-100" style={{ height: '500px' }}>
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={`${baseDeck.name} のサムネイル`}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            サムネイルなし
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 break-words">{baseDeck.name}</h3>
            <p className="text-sm text-gray-600">by {userName || '匿名ユーザー'}</p>
          </div>
          <span className="shrink-0 self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {formatDeckType(baseDeck.deckType)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span className="rounded-full bg-pink-50 px-2 py-1 text-pink-600">♥ {likeCount}</span>
          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-600">👁 {viewCount}</span>
          <span className="text-gray-500">{formatDate(publishedAt)}</span>
        </div>

        {hashtags?.length > 0 && (
          <HashtagChips
            tags={hashtags.map((tag) => ({ tag }))}
            className="text-xs text-slate-700"
            gapClassName="gap-1"
            onSelect={onHashtagSelect}
          />
        )}

        <Link
          href={`/decks/${id}`}
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
};
