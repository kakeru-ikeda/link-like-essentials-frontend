'use client';

import { useState, useCallback } from 'react';
import { uploadImage as uploadImageService } from '@/services/infrastructure/imageUploadService';
import { isImageFile, CropArea } from '@/utils/imageUtils';

export interface UseImageUploadOptions {
  /** クリッピング機能を有効化 */
  enableCropping?: boolean;
  /** 最大ファイルサイズ（MB）デフォルト: 5MB */
  maxSizeMB?: number;
  /** クリッピングなしで自動的に正方形にクロップ */
  autoSquareCrop?: boolean;
}

export interface UseImageUploadReturn {
  /** 画像をアップロードする */
  uploadImage: (file: File) => Promise<string>;
  /** アップロード中かどうか */
  isUploading: boolean;
  /** アップロード進捗（0-100） */
  progress: number;
  /** エラーメッセージ */
  error: string | null;
  /** 状態をリセット */
  reset: () => void;
  /** クリッピングモーダル表示フラグ */
  showCropModal: boolean;
  /** クリッピング対象の画像ファイル */
  cropImageFile: File | null;
  /** クリッピングを確定 */
  confirmCrop: (cropArea: CropArea) => Promise<void>;
  /** クリッピングをキャンセル */
  cancelCrop: () => void;
}

/**
 * 画像アップロード用カスタムフック
 */
export const useImageUpload = (
  options: UseImageUploadOptions = {}
): UseImageUploadReturn => {
  const { enableCropping = false, maxSizeMB = 5, autoSquareCrop = false } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageFile, setCropImageFile] = useState<File | null>(null);
  const [pendingResolve, setPendingResolve] = useState<((url: string) => void) | null>(null);
  const [pendingReject, setPendingReject] = useState<((error: Error) => void) | null>(null);

  /**
   * 状態をリセット
   */
  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setShowCropModal(false);
    setCropImageFile(null);
    setPendingResolve(null);
    setPendingReject(null);
  }, []);

  /**
   * 画像を処理してアップロード
   */
  const processAndUpload = useCallback(
    async (file: File, cropArea?: CropArea): Promise<string> => {
      try {
        setIsUploading(true);
        setError(null);
        setProgress(0);

        // サービス層を通じて画像をアップロード
        const url = await uploadImageService(file, {
          maxSizeMB,
          autoSquareCrop: autoSquareCrop && !cropArea,
          cropArea,
          onProgress: (uploadProgress) => {
            setProgress(uploadProgress);
          },
        });

        setProgress(100);
        return url;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '画像のアップロードに失敗しました';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [maxSizeMB, autoSquareCrop]
  );

  /**
   * クリッピングを確定してアップロード
   */
  const confirmCrop = useCallback(
    async (cropArea: CropArea): Promise<void> => {
      if (!cropImageFile || !pendingResolve || !pendingReject) {
        setShowCropModal(false);
        return;
      }

      try {
        const url = await processAndUpload(cropImageFile, cropArea);
        pendingResolve(url);
      } catch (err) {
        pendingReject(err as Error);
      } finally {
        setShowCropModal(false);
        setCropImageFile(null);
        setPendingResolve(null);
        setPendingReject(null);
      }
    },
    [cropImageFile, pendingResolve, pendingReject, processAndUpload]
  );

  /**
   * クリッピングをキャンセル
   */
  const cancelCrop = useCallback(() => {
    if (pendingReject) {
      pendingReject(new Error('クリッピングがキャンセルされました'));
    }
    setShowCropModal(false);
    setCropImageFile(null);
    setPendingResolve(null);
    setPendingReject(null);
  }, [pendingReject]);

  /**
   * 画像をアップロード
   */
  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      // ファイルタイプのチェック
      if (!isImageFile(file)) {
        const errorMessage = '対応していない画像形式です';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // クリッピング機能が有効な場合はモーダルを表示
      if (enableCropping) {
        return new Promise<string>((resolve, reject) => {
          setCropImageFile(file);
          setShowCropModal(true);
          setPendingResolve(() => resolve);
          setPendingReject(() => reject);
        });
      }

      // クリッピング機能が無効な場合は直接アップロード
      return processAndUpload(file);
    },
    [enableCropping, processAndUpload]
  );

  return {
    uploadImage,
    isUploading,
    progress,
    error,
    reset,
    showCropModal,
    cropImageFile,
    confirmCrop,
    cancelCrop,
  };
};
