'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';
import { Deck } from '@/models/Deck';
import { useUserApi } from './useUserApi';
import { useImageUpload } from './useImageUpload';
import { useScreenshot } from './useScreenshot';

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
  /** 上限解放数を表示 */
  showLimitBreak: boolean;
  /** 上限解放数表示を変更 */
  setShowLimitBreak: (show: boolean) => void;
  /** 画像をアップロード */
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** 画像を削除 */
  handleRemoveImage: (index: number) => void;
  /** デッキ画像をダウンロード */
  handleDownloadImage: (
    exportViewRef: RefObject<HTMLDivElement>,
    deckName: string
  ) => Promise<void>;
  /** キャプチャ中かどうか */
  isCapturing: boolean;
}

/**
 * デッキ公開モーダルの状態管理フック
 */
export const useDeckPublish = (
  isOpen: boolean,
  deck: Deck | null
): UseDeckPublishReturn => {
  const { getMyProfile, isLoading: isLoadingProfile } = useUserApi();
  const { uploadImage, error: uploadError } = useImageUpload({
    enableCropping: false,
  });
  const { captureElement, isCapturing } = useScreenshot();

  const [displayName, setDisplayName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [showLimitBreak, setShowLimitBreak] = useState<boolean>(true);

  // プロフィール取得
  useEffect(() => {
    if (isOpen) {
      getMyProfile()
        .then((profile) => {
          setDisplayName(profile.displayName);
        })
        .catch(() => {
          setDisplayName('');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  // デッキ画像ダウンロード処理
  const handleDownloadImage = useCallback(
    async (
      exportViewRef: RefObject<HTMLDivElement>,
      deckName: string
    ): Promise<void> => {
      if (exportViewRef.current) {
        // 一時的にzoomを1.0に戻して元の解像度でキャプチャ
        const originalZoom = exportViewRef.current.style.zoom;
        exportViewRef.current.style.zoom = '1';

        await captureElement(exportViewRef.current, `${deckName}.png`);

        // zoomを元に戻す
        exportViewRef.current.style.zoom = originalZoom;
      }
    },
    [captureElement]
  );

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
    showLimitBreak,
    setShowLimitBreak,
    handleImageUpload,
    handleRemoveImage,
    handleDownloadImage,
    isCapturing,
  };
};
