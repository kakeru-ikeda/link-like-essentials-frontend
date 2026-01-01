'use client';

import React, { useRef } from 'react';
import { Modal } from '@/components/common/Modal';
import { DeckExportView } from '@/components/deck/export/DeckExportView';
import { DeckPublishForm } from '@/components/deck/DeckPublishForm';
import { useDeck } from '@/hooks/useDeck';
import { useDeckPublish } from '@/hooks/useDeckPublish';
import { useLiveGrandPrixById } from '@/hooks/useLiveGrandPrix';

interface DeckPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeckPublishModal: React.FC<DeckPublishModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { deck } = useDeck();
  const exportViewRef = useRef<HTMLDivElement>(null);
  const exportBuilderRef = useRef<HTMLDivElement>(null);

  const {
    displayName,
    isLoadingProfile,
    comment,
    setComment,
    uploadedImageUrls,
    uploadingCount,
    uploadError,
    setHashtags,
    handleImageUpload,
    handleRemoveImage,
    handleDownloadImage,
    isCapturing,
    handlePublishDeck,
    isPublishing,
    publishError,
  } = useDeckPublish(isOpen, deck, exportViewRef, exportBuilderRef);

  // ライブグランプリ情報を取得（デッキに設定されている場合）
  const { liveGrandPrix } = useLiveGrandPrixById(
    deck?.liveGrandPrixId || '',
    !deck?.liveGrandPrixId
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="デッキを共有する"
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
          
          {/* キャプチャ中のマスク */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-[100]">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">画像を生成中...</div>
                <div className="text-sm text-gray-500 mt-2">しばらくお待ちください</div>
              </div>
            </div>
          )}
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
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          handleDownloadImage={handleDownloadImage}
          isCapturing={isCapturing}
          exportViewRef={exportViewRef}
          handlePublishDeck={handlePublishDeck}
          isPublishing={isPublishing}
          publishError={publishError}
        />
      </div>
    </Modal>
  );
};
