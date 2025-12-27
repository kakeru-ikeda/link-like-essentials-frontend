/**
 * 画像処理ユーティリティ
 * リサイズ、クリッピング、フォーマット変換などの機能を提供
 */

const MAX_FILE_SIZE_MB = 5;

// サポートする画像フォーマット
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * ファイルが画像かどうかを判定
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_FORMATS.some((format) => file.type === format);
};

/**
 * ファイルからImageオブジェクトを生成
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
};

/**
 * 画像をクリッピング（切り抜き）
 */
export const cropImage = async (
  image: HTMLImageElement,
  cropArea: CropArea
): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas contextの取得に失敗しました');
  }

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return canvas;
};

/**
 * 画像を正方形にクリッピング（中央基準）
 */
export const cropToSquare = async (
  image: HTMLImageElement
): Promise<HTMLCanvasElement> => {
  const size = Math.min(image.width, image.height);
  const x = (image.width - size) / 2;
  const y = (image.height - size) / 2;

  return cropImage(image, { x, y, width: size, height: size });
};

/**
 * 画像をリサイズして指定サイズ以下に圧縮
 */
export const resizeImage = async (
  canvas: HTMLCanvasElement,
  maxSizeMB: number = MAX_FILE_SIZE_MB
): Promise<Blob> => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  let quality = 0.9;
  let blob: Blob | null = null;

  // 品質を段階的に下げながら目標サイズ以下になるまで圧縮
  while (quality > 0.1) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (result) => resolve(result),
        'image/jpeg',
        quality
      );
    });

    if (!blob) {
      throw new Error('画像の圧縮に失敗しました');
    }

    if (blob.size <= maxSizeBytes) {
      break;
    }

    quality -= 0.1;
  }

  // それでもサイズが大きい場合は画像自体を縮小
  if (blob && blob.size > maxSizeBytes) {
    const scaleFactor = Math.sqrt(maxSizeBytes / blob.size);
    const newWidth = Math.floor(canvas.width * scaleFactor);
    const newHeight = Math.floor(canvas.height * scaleFactor);

    const resizedCanvas = document.createElement('canvas');
    const ctx = resizedCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas contextの取得に失敗しました');
    }

    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

    blob = await new Promise<Blob | null>((resolve) => {
      resizedCanvas.toBlob(
        (result) => resolve(result),
        'image/jpeg',
        0.9
      );
    });
  }

  if (!blob) {
    throw new Error('画像の圧縮に失敗しました');
  }

  return blob;
};

/**
 * ファイルを画像として処理し、指定サイズ以下に圧縮
 */
export const processImage = async (
  file: File,
  options: {
    maxSizeMB?: number;
    cropToSquare?: boolean;
    cropArea?: CropArea;
  } = {}
): Promise<Blob> => {
  const { maxSizeMB = MAX_FILE_SIZE_MB, cropToSquare: shouldCropToSquare, cropArea } = options;

  // 画像を読み込み
  const image = await loadImage(file);

  // クリッピング処理
  let canvas: HTMLCanvasElement;

  if (cropArea) {
    // カスタムクリッピングエリアが指定されている場合
    canvas = await cropImage(image, cropArea);
  } else if (shouldCropToSquare) {
    // 正方形クリッピング
    canvas = await cropToSquare(image);
  } else {
    // クリッピングなし - そのままCanvasに描画
    canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas contextの取得に失敗しました');
    }

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  }

  // リサイズ・圧縮
  return resizeImage(canvas, maxSizeMB);
};

/**
 * BlobをFileに変換
 */
export const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { type: 'image/jpeg' });
};

/**
 * ファイルサイズを人間が読める形式に変換
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
