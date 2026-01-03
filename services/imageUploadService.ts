import { uploadImageToStorage } from '@/repositories/firebase/storage';
import { processImage, CropArea } from '@/utils/imageUtils';

export interface ImageUploadOptions {
  /** 最大ファイルサイズ（MB） */
  maxSizeMB?: number;
  /** 自動的に正方形にクロップ */
  autoSquareCrop?: boolean;
  /** クロップエリア（指定された場合） */
  cropArea?: CropArea;
  /** アップロード進捗コールバック */
  onProgress?: (progress: number) => void;
}

/**
 * 画像を処理してFirebase Storageにアップロード
 * 
 * @param file - アップロードする画像ファイル
 * @param options - アップロードオプション
 * @returns アップロードされた画像のURL
 */
export const uploadImage = async (
  file: File,
  options: ImageUploadOptions = {}
): Promise<string> => {
  const {
    maxSizeMB = 5,
    autoSquareCrop = false,
    cropArea,
    onProgress,
  } = options;

  // 画像を処理（リサイズ・クリッピング）
  const processedBlob = await processImage(file, {
    maxSizeMB,
    cropToSquare: autoSquareCrop && !cropArea,
    cropArea,
  });

  // Firebase Storageにアップロード
  const url = await uploadImageToStorage(
    processedBlob,
    file.name,
    onProgress
  );

  return url;
};
