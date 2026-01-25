import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { Deck } from '@/models/domain/Deck';
import { ExportDashboard } from '@/components/deck/export/ExportDashboard';
import { ImagePreviewGrid } from '@/components/deck/ImagePreviewGrid';
import { HashtagChips } from '@/components/deck/HashtagChips';
import { UserAvatar } from '@/components/common/UserAvatar';

interface PublishedDeckDetailProps {
  deck: PublishedDeck;
  compiledDeck?: Deck | null;
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ja-JP');

export const PublishedDeckDetail: React.FC<PublishedDeckDetailProps> = ({
  deck,
  compiledDeck,
}) => {
  const {
    deck: baseDeck,
    userProfile,
    hashtags,
    thumbnail,
    publishedAt,
    comment,
    imageUrls,
  } = deck;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="relative h-full w-full">
            <div className="bg-slate-100">
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnail}
                  alt={`${baseDeck.name} のサムネイル`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-sm text-slate-500"
                  style={{ minHeight: '320px' }}
                >
                  サムネイルなし（プレビュー準備中）
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                デッキ名
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                {baseDeck.name}
              </h1>
              <div className="flex items-center gap-2 pt-1">
                <UserAvatar
                  userProfile={userProfile}
                  size="lg"
                  showTooltip={!!userProfile}
                />
                <p className="text-md text-slate-600">
                  {userProfile?.displayName || '匿名ユーザー'}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap self-start">
              {formatDate(publishedAt)}
            </span>
          </div>

          {hashtags?.length > 0 && (
            <HashtagChips
              tags={hashtags.map((tag) => ({ tag }))}
              className="text-xs text-slate-700"
              gapClassName="gap-2"
            />
          )}

          {(comment || (imageUrls && imageUrls.length > 0)) && (
            <div className="space-y-2">
              {comment && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 whitespace-pre-wrap">
                  {comment}
                </div>
              )}
              {imageUrls && imageUrls.length > 0 && (
                <ImagePreviewGrid
                  imageUrls={imageUrls}
                  columnCount={3}
                  tooltipPosition="left"
                  imageClassName="rounded-lg border-slate-200"
                />
              )}
            </div>
          )}

          {compiledDeck && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <ExportDashboard deck={compiledDeck} variant="compact" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
