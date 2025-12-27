'use client';

import React, { useRef } from 'react';
import { Modal } from '@/components/common/Modal';
import { DeckExportView } from '@/components/deck/export/DeckExportView';
import { Button } from '@/components/common/Button';
import { useScreenshot } from '@/hooks/useScreenshot';
import { useDeck } from '@/hooks/useDeck';

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
  const { captureElement, isCapturing } = useScreenshot();

  const handleDownloadImage = async (): Promise<void> => {
    if (exportViewRef.current) {
      const deckName = deck?.name || 'deck';
      
      // 一時的にzoomを1.0に戻して元の解像度でキャプチャ
      const originalZoom = exportViewRef.current.style.zoom;
      exportViewRef.current.style.zoom = '1';
      
      await captureElement(exportViewRef.current, `${deckName}.png`);
      
      // zoomを元に戻す
      exportViewRef.current.style.zoom = originalZoom;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="デッキを公開"
      maxWidth="max-w-7xl"
    >
      <div className="flex gap-6">
        {/* 左側: プレビュー */}
        <div className="flex-shrink-0 overflow-auto max-h-[70vh] relative">
          <div ref={exportViewRef} style={{ zoom: 0.5, maxWidth: '1400px' }}>
            <DeckExportView />
          </div>
          
          {/* キャプチャ中のマスク */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">画像を生成中...</div>
                <div className="text-sm text-gray-500 mt-2">しばらくお待ちください</div>
              </div>
            </div>
          )}
        </div>
        
        {/* 右側: 追加コンテンツ用 */}
        <div className="flex-1 min-w-0">
          <Button 
            onClick={handleDownloadImage}
            disabled={isCapturing}
          >
            {isCapturing ? 'ダウンロード中...' : '画像としてダウンロード'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
