'use client';

import { useState, useEffect, useCallback } from 'react';
import { Deck } from '@/models/domain/Deck';
import { PublishedDeck } from '@/models/domain/PublishedDeck';
import { useImageUpload } from '@/hooks/features/useImageUpload';
import { deckPublishService } from '@/services/deck/deckPublishService';
import { thumbnailService } from '@/services/infrastructure/thumbnailService';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { FRIEND_SLOT_ID } from '@/config/deckSlots';

export interface UseDeckPublishReturn {
  /** 表示名 */
  displayName: string;
  /** 表示名読み込み中 */
  isLoadingProfile: boolean;
  /** コメント */
  comment: string;
  /** コメントを変更 */
  setComment: (comment: string) => void;
  /** アップロード済み画像URL */
  uploadedImageUrls: string[];
  /** アップロード中の画像数 */
  uploadingCount: number;
  /** アップロードエラー */
  uploadError: string | null;
  /** ハッシュタグ */
  hashtags: string[];
  /** ハッシュタグを変更 */
  setHashtags: (hashtags: string[]) => void;
  /** 非公開リスト指定 */
  isUnlisted: boolean;
  /** 非公開リストを切り替え */
  setIsUnlisted: (value: boolean) => void;
  /** 画像をアップロード */
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** 画像を削除 */
  handleRemoveImage: (index: number) => void;
  /** デッキを公開 */
  handlePublishDeck: () => Promise<void>;
  /** 公開中かどうか */
  isPublishing: boolean;
  /** 公開エラー */
  publishError: string | null;
}

/**
 * デッキ公開モーダルの状態管理フック
 */
export const useDeckPublish = (
  isOpen: boolean,
  deck: Deck | null,
  setFriendSlotEnabled?: (enabled: boolean) => void,
  onPublished?: (publishedDeck: PublishedDeck) => void
): UseDeckPublishReturn => {
  const { profile, isLoadingProfile, fetchProfile } = useUserProfile();
  const { uploadImage, error: uploadError } = useImageUpload({
    enableCropping: false,
  });

  const [displayName, setDisplayName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isUnlisted, setIsUnlisted] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // プロフィール未取得時のみフェッチ
  useEffect(() => {
    if (!isOpen || profile) return;

    fetchProfile().catch(() => {
      setDisplayName('');
    });
  }, [fetchProfile, isOpen, profile]);

  // プロフィールが揃ったら表示名を反映
  useEffect(() => {
    if (!isOpen) return;
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    }
  }, [isOpen, profile?.displayName]);

  // 画像アップロード処理
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // 現在の画像数と追加する画像数をチェック
      const remainingSlots = 3 - uploadedImageUrls.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      if (filesToUpload.length === 0) {
        return;
      }

      setUploadingCount(filesToUpload.length);

      try {
        // 並列アップロード
        const uploadPromises = filesToUpload.map((file) => uploadImage(file));
        const urls = await Promise.all(uploadPromises);
        setUploadedImageUrls((prev) => [...prev, ...urls]);
      } catch (err) {
        console.error('画像アップロードエラー:', err);
      } finally {
        setUploadingCount(0);
        // inputをリセット
        event.target.value = '';
      }
    },
    [uploadedImageUrls.length, uploadImage]
  );

  // 画像削除処理
  const handleRemoveImage = useCallback((index: number): void => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // デッキ公開処理
  const handlePublishDeck = useCallback(async (): Promise<void> => {
    if (!deck) {
      setPublishError('デッキが選択されていません');
      return;
    }

    const friendSlot = deck.slots.find((slot) => slot.slotId === FRIEND_SLOT_ID);
    const isFriendSlotEnabled = deck.isFriendSlotEnabled ?? true;
    const hasFriendCard = Boolean(friendSlot?.cardId);
    const shouldDisableFriendSlot = isFriendSlotEnabled && !hasFriendCard;

    // デッキをローカルで正規化（フレンド枠を空のまま公開しない）
    const deckForPublish: Deck = shouldDisableFriendSlot
      ? {
          ...deck,
          isFriendSlotEnabled: false,
        }
      : deck;

    // プレビュー用のUIにも反映させるため、再描画を待ってからキャプチャ
    if (shouldDisableFriendSlot && setFriendSlotEnabled) {
      setFriendSlotEnabled(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      let thumbnailUrl: string | undefined;
      try {
        thumbnailUrl = await thumbnailService.generateThumbnail(deckForPublish);
      } catch (captureError) {
        const errorMessage =
          captureError instanceof Error
            ? captureError.message
            : 'サムネイルの生成に失敗しました';
        setPublishError(errorMessage);
        setIsPublishing(false);
        return;
      }

      const publishedDeck: PublishedDeck = await deckPublishService.publishDeck(
        deckForPublish,
        {
          comment: comment || undefined,
          hashtags,
          isUnlisted,
          imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
          thumbnail: thumbnailUrl,
        }
      );

      // 公開成功
      console.log('デッキ公開成功:', publishedDeck);
      onPublished?.(publishedDeck);
      
      // TODO: 成功通知やモーダルクローズ処理
      // 親コンポーネントに公開成功を通知する仕組みが必要
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'デッキの公開に失敗しました';
      setPublishError(errorMessage);
      console.error('デッキ公開エラー:', err);
    } finally {
      setIsPublishing(false);
    }
  }, [comment, deck, hashtags, isUnlisted, onPublished, setFriendSlotEnabled, uploadedImageUrls]);

  return {
    displayName,
    isLoadingProfile,
    comment,
    setComment,
    uploadedImageUrls,
    uploadingCount,
    uploadError,
    hashtags,
    setHashtags,
    isUnlisted,
    setIsUnlisted,
    handleImageUpload,
    handleRemoveImage,
    handlePublishDeck,
    isPublishing,
    publishError,
  };
};
