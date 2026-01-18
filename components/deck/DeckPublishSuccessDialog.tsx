import React, { useCallback, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface DeckPublishSuccessDialogProps {
  isOpen: boolean;
  shareUrl: string | null;
  isUnlisted: boolean;
  deckName: string | null;
  onClose: () => void;
}

export const DeckPublishSuccessDialog: React.FC<DeckPublishSuccessDialogProps> = ({
  isOpen,
  shareUrl,
  isUnlisted,
  deckName,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = useCallback(async (): Promise<void> => {
    if (!shareUrl) return;

    const titleLine = `${deckName ? `「${deckName}」` : 'デッキ'}を${isUnlisted ? '限定公開' : '公開'}しました`;
    const shareText = [titleLine, shareUrl, '#リンクラデッキビルダー']
      .filter(Boolean)
      .join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: 'デッキを公開しました', text: shareText, url: shareUrl });
        return;
      } catch (error) {
        // Web Share APIに失敗した場合はintentを利用
        console.error('共有に失敗しました', error);
      }
    }

    // X(Twitter)向けインテント。x.com/intent/postが推奨
    const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  }, [deckName, isUnlisted, shareUrl]);

  const handleCopy = useCallback(async (): Promise<void> => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('コピーに失敗しました', error);
      setCopied(false);
    }
  }, [shareUrl]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="公開が完了しました"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <div className="space-y-1 text-sm text-gray-700">
          <p className="font-medium text-gray-900 pb-2">
            {deckName ? `「${deckName}」を${isUnlisted ? '限定公開' : '公開'}しました。` : `${isUnlisted ? '限定公開' : '公開'}しました。`}
          </p>
          <p>{isUnlisted ? '限定公開のため、リンクを知っているユーザーのみが表示できます。' : '公開デッキ一覧に掲載されました。'}</p>
          <p>投稿したデッキは
            <a
              href="/mypage"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
                マイページ
            </a>
            から確認・削除が行えます。</p>
        </div>
        {shareUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-gray-50"
              />
              <Button onClick={handleCopy} className="whitespace-nowrap">
                {copied ? 'コピー済み' : 'コピー'}
              </Button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          {shareUrl && (
            <Button
              variant="secondary"
              onClick={() => window.location.assign(shareUrl)}
              className="min-w-[140px]"
            >
              公開したデッキを見る
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button onClick={handleShare} disabled={!shareUrl}>
              SNSで共有
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
