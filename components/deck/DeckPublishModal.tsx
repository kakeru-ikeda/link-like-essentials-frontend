'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/common/Modal';
import { DeckExportView } from '@/components/deck/export/DeckExportView';
import { DeckPublishForm } from '@/components/deck/DeckPublishForm';
import { useDeck } from '@/hooks/useDeck';
import { useDeckPublish } from '@/hooks/useDeckPublish';
import { useLiveGrandPrixById } from '@/hooks/useLiveGrandPrix';
import { PublishedDeck } from '@/models/PublishedDeck';

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
  const exportViewRef = useRef<HTMLDivElement>(null);
  const exportBuilderRef = useRef<HTMLDivElement>(null);
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
    handleDownloadImage,
    isCapturing,
    handlePublishDeck,
    isPublishing,
    publishError,
  } = useDeckPublish(
    isOpen,
    deck,
    exportBuilderRef,
    setFriendSlotEnabled,
    handlePublishSuccess
  );

  // ライブグランプリ情報を取得（デッキに設定されている場合）
  const { liveGrandPrix } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

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
        <div className="flex-shrink-0 overflow-auto max-h-[70vh] relative">
          <div style={{ zoom: 0.5, maxWidth: '1700px' }}>
            <DeckExportView
              captureRef={exportViewRef}
              builderCaptureRef={exportBuilderRef}
            />
          </div>
        </div>
        
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
          handleDownloadImage={handleDownloadImage}
          isCapturing={isCapturing}
          exportViewRef={exportViewRef}
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
