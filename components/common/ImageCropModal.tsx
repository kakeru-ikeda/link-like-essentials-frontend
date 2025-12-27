'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ImageCropModalProps {
  isOpen: boolean;
  imageFile: File | null;
  onConfirm: (cropArea: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageFile,
  onConfirm,
  onCancel,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, size: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 画像を読み込む
  useEffect(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(e.target?.result as string);
        setImageSize({ width: img.width, height: img.height });

        // 初期クロップエリア（中央の正方形）
        const size = Math.min(img.width, img.height);
        setCropArea({
          x: (img.width - size) / 2,
          y: (img.height - size) / 2,
          size,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Canvasに画像とクロップエリアを描画
  useEffect(() => {
    if (!canvasRef.current || !imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Canvasサイズを調整（最大800px）
      const maxSize = 800;
      let displayWidth = img.width;
      let displayHeight = img.height;

      if (img.width > maxSize || img.height > maxSize) {
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        displayWidth = img.width * scale;
        displayHeight = img.height * scale;
      }

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // 画像を描画
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

      // 暗いオーバーレイを描画
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // クロップエリアをクリア（明るく表示）
      const scale = displayWidth / img.width;
      const scaledX = cropArea.x * scale;
      const scaledY = cropArea.y * scale;
      const scaledSize = cropArea.size * scale;

      ctx.clearRect(scaledX, scaledY, scaledSize, scaledSize);
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.size,
        cropArea.size,
        scaledX,
        scaledY,
        scaledSize,
        scaledSize
      );

      // クロップエリアの枠線
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(scaledX, scaledY, scaledSize, scaledSize);

      // ガイドライン（三分割法）
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      // 縦線
      ctx.beginPath();
      ctx.moveTo(scaledX + scaledSize / 3, scaledY);
      ctx.lineTo(scaledX + scaledSize / 3, scaledY + scaledSize);
      ctx.moveTo(scaledX + (scaledSize * 2) / 3, scaledY);
      ctx.lineTo(scaledX + (scaledSize * 2) / 3, scaledY + scaledSize);
      // 横線
      ctx.moveTo(scaledX, scaledY + scaledSize / 3);
      ctx.lineTo(scaledX + scaledSize, scaledY + scaledSize / 3);
      ctx.moveTo(scaledX, scaledY + (scaledSize * 2) / 3);
      ctx.lineTo(scaledX + scaledSize, scaledY + (scaledSize * 2) / 3);
      ctx.stroke();
    };
    img.src = imageSrc;
  }, [imageSrc, cropArea]);

  // マウスダウン
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Canvas表示サイズとCanvas内部サイズの比率を計算
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // クリック位置をCanvas座標に変換
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    // Canvas座標から元画像座標に変換
    const imageScale = imageSize.width / canvas.width;
    const x = canvasX * imageScale;
    const y = canvasY * imageScale;

    // クロップエリア内かチェック
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.size &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.size
    ) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    }
  }, [cropArea, imageSize]);

  // マウス移動
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Canvas表示サイズとCanvas内部サイズの比率を計算
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      // クリック位置をCanvas座標に変換
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;
      
      // Canvas座標から元画像座標に変換
      const imageScale = imageSize.width / canvas.width;
      const x = canvasX * imageScale;
      const y = canvasY * imageScale;

      let newX = x - dragStart.x;
      let newY = y - dragStart.y;

      // 境界チェック
      newX = Math.max(0, Math.min(newX, imageSize.width - cropArea.size));
      newY = Math.max(0, Math.min(newY, imageSize.height - cropArea.size));

      setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
    },
    [isDragging, dragStart, imageSize, cropArea.size]
  );

  // マウスアップ
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // サイズ変更（スライダー）
  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSize = Number(e.target.value);

      // 中央を維持しながらサイズ変更
      const centerX = cropArea.x + cropArea.size / 2;
      const centerY = cropArea.y + cropArea.size / 2;

      let newX = centerX - newSize / 2;
      let newY = centerY - newSize / 2;

      // 境界チェック
      newX = Math.max(0, Math.min(newX, imageSize.width - newSize));
      newY = Math.max(0, Math.min(newY, imageSize.height - newSize));

      setCropArea({ x: newX, y: newY, size: newSize });
    },
    [imageSize, cropArea]
  );

  const handleConfirm = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      await onConfirm({
        x: cropArea.x,
        y: cropArea.y,
        width: cropArea.size,
        height: cropArea.size,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!imageFile) return null;

  const maxSize = Math.min(imageSize.width, imageSize.height);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} closeOnBackdropClick={false}>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-xl font-bold text-black">画像をクリッピング</h2>

        <div className="text-sm text-gray-600">
          クロップエリアをドラッグして位置を調整できます
        </div>

        <div
          ref={containerRef}
          className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`max-w-full max-h-[600px] ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-move'}`}
            style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">サイズ調整</label>
          <input
            type="range"
            min={Math.min(100, maxSize)}
            max={maxSize}
            value={cropArea.size}
            onChange={handleSizeChange}
            disabled={isProcessing}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button 
            onClick={onCancel} 
            className="bg-gray-500 hover:bg-gray-600"
            disabled={isProcessing}
          >
            キャンセル
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-blue-500 hover:bg-blue-600"
            disabled={isProcessing}
          >
            {isProcessing ? '処理中...' : '確定'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
