'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/common/Modal';
import { DeckExportView } from '@/components/published-deck/export/DeckExportView';
import { DeckPublishForm } from '@/components/deck-publish/DeckPublishForm';
import { useDeck } from '@/hooks/deck/useDeck';
import { useDeckPublish } from '@/hooks/deck/useDeckPublish';
import { useLiveGrandPrixById } from '@/hooks/live-grand-prix/useLiveGrandPrix';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';
import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { FRIEND_SLOT_ID } from '@/config/deckSlots';

interface DeckPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (publishedDeck: PublishedDeck) => void;
}

export const DeckPublishModal: React.FC<DeckPublishModalProps> = ({
  isOpen,
  onClose,
  onPublished,
}) => {
  const { deck, setFriendSlotEnabled } = useDeck();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const handlePublishSuccess = useCallback((publishedDeck: PublishedDeck): void => {
    onPublished?.(publishedDeck);
    onClose();
  }, [onClose, onPublished]);

  const {
    displayName,
    isLoadingProfile,
    comment,
    setComment,
    uploadedImageUrls,
    uploadingCount,
    uploadError,
    setHashtags,
    isUnlisted,
    setIsUnlisted,
    handleImageUpload,
    handleRemoveImage,
    handlePublishDeck,
    isPublishing,
    publishError,
  } = useDeckPublish(
    isOpen,
    deck,
    setFriendSlotEnabled,
    handlePublishSuccess
  );

  const { isPc } = useResponsiveDevice();
  const shouldShowExportView = isPc;
  const previewContainerClass = 'flex-shrink-0 overflow-auto max-h-[70vh] relative';

  // ライブグランプリ情報を取得（デッキに設定されている場合）
  const { liveGrandPrix } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

  const isAceUnset = React.useMemo(() => {
    if (!deck?.aceSlotId || !deck?.slots) return true;
    const aceSlot = deck.slots.find((slot) => slot.slotId === deck.aceSlotId);
    return !aceSlot?.card;
  }, [deck?.aceSlotId, deck?.slots]);

  const isAllLimitBreakDefault = React.useMemo(() => {
    if (!deck?.slots) return false;
    const slotsWithCard = deck.slots.filter((slot) => Boolean(slot.card));
    if (slotsWithCard.length === 0) return false;
    return slotsWithCard.every((slot) => (slot.limitBreak ?? 14) === 14);
  }, [deck?.slots]);

  const isFriendUnset = React.useMemo(() => {
    if (!deck?.slots) return false;
    if (deck?.isFriendSlotEnabled === false) return false;
    const friendSlot = deck.slots.find((slot) => slot.slotId === FRIEND_SLOT_ID);
    if (!friendSlot) return false;
    return !friendSlot.card;
  }, [deck?.slots, deck?.isFriendSlotEnabled]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmDialogOpen(false);
    }
  }, [isOpen]);

  const openConfirmDialog = (): void => {
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = (): void => {
    setConfirmDialogOpen(false);
  };

  const confirmDescription = isUnlisted
    ? '限定公開リンクだけでアクセスできます。公開デッキ一覧には掲載されません。内容に問題がないか確認してください。'
    : '公開すると共有用のURLが発行されます。公開デッキ一覧に掲載が行われます。内容に問題がないか確認してください。';

  const handleConfirmPublish = async (): Promise<void> => {
    await handlePublishDeck();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="デッキを公開する"
      maxWidth="max-w-7xl"
    >
      <div className="flex gap-6">
        {/* 左側: プレビュー */}
        {shouldShowExportView && (
          <div className={previewContainerClass}>
            <div style={{ zoom: 0.5, width: '1700px' }}>
              <DeckExportView />
            </div>
          </div>
        )}

        {/* 右側: 編集フォーム */}
        <DeckPublishForm
          deck={deck}
          liveGrandPrix={liveGrandPrix ?? undefined}
          displayName={displayName}
          isLoadingProfile={isLoadingProfile}
          comment={comment}
          setComment={setComment}
          uploadedImageUrls={uploadedImageUrls}
          uploadingCount={uploadingCount}
          uploadError={uploadError ?? ''}
          setHashtags={setHashtags}
          isUnlisted={isUnlisted}
          setIsUnlisted={setIsUnlisted}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          onRequestPublish={openConfirmDialog}
          isPublishing={isPublishing}
          publishError={publishError}
        />
      </div>

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="この内容でデッキを公開しますか？"
        description={confirmDescription}
        onCancel={closeConfirmDialog}
        onConfirm={handleConfirmPublish}
        confirmLabel={isPublishing ? '公開中...' : '公開する'}
        cancelLabel="戻る"
        processingContent={
          isPublishing && (
            <div className="flex items-center gap-2 text-sm text-gray-600" aria-live="polite">
              <span className="inline-flex h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span>公開処理中です...</span>
            </div>
          )
        }
      >
        <div className="space-y-2 text-sm text-gray-700">
          {isAceUnset && (
            <div className="flex items-center gap-2 text-red-600">
              ⚠ エースカードが未設定です。
            </div>
          )}
          {isAllLimitBreakDefault && (
            <div className="flex items-center gap-2 text-yellow-600">
              ⚠ 全スロットの上限解放数が14のままです。設定漏れがないか確認してください。
            </div>
          )}
          {isFriendUnset && (
            <div className="flex items-center gap-2 text-yellow-600">
              ⚠ フレンド枠が未設定です。未設定のフレンド枠は無効化されます。
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">投稿者</span>
            <span className="font-medium text-gray-900 truncate max-w-[220px]">
              {displayName || '未設定'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">デッキ名</span>
            <span className="font-medium text-gray-900 truncate max-w-[220px]">
              {deck?.name || '未設定'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">公開設定</span>
            <span className="font-medium text-gray-900">
              {isUnlisted ? '限定公開' : '公開'}
            </span>
          </div>
        </div>
      </ConfirmDialog>
    </Modal>
  );
};
