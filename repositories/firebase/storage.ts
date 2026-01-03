import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from 'firebase/storage';
import { storage } from './config';

/**
 * ユニークなファイル名を生成
 */
const generateUniqueFileName = (originalFileName: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const extension = originalFileName.split('.').pop() || 'jpg';
  return `${timestamp}_${randomStr}.${extension}`;
};

/**
 * Firebase Storageの tmpフォルダに画像をアップロード
 * @param blob アップロードする画像Blob
 * @param fileName 元のファイル名（拡張子の取得に使用）
 * @param onProgress アップロード進捗のコールバック
 * @returns ダウンロードURL
 */
export const uploadImageToStorage = async (
  blob: Blob,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storageが初期化されていません');
  }

  const uniqueFileName = generateUniqueFileName(fileName);
  const storageRef = ref(storage, `tmp/${uniqueFileName}`);

  return new Promise<string>((resolve, reject) => {
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, blob, {
      contentType: 'image/jpeg',
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error('アップロードエラー:', error);
        reject(new Error('画像のアップロードに失敗しました'));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error('URL取得エラー:', error);
          reject(new Error('画像URLの取得に失敗しました'));
        }
      }
    );
  });
};
