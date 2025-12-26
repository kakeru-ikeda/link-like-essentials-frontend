'use client';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { DeckDashboard } from '@/components/deck/DeckDashboard';
import { DeckTabs } from '@/components/deck/DeckTabs';
import { DeckExportView } from '@/components/deck/export/DeckExportView';
import { Button } from '@/components/common/Button';
import { useDeckTabs } from '@/hooks/useDeckTabs';
import { useDeck } from '@/hooks/useDeck';
import { useScreenshot } from '@/hooks/useScreenshot';

export default function Home() {
  const { tabs, activeTabId, addTab, deleteTab, switchTab } = useDeckTabs();
  const { deck, isFriendSlotEnabled } = useDeck();
  const { captureElement, isCapturing } = useScreenshot();
  const exportViewRef = useRef<HTMLDivElement>(null);
  const [showExportView, setShowExportView] = useState<boolean>(false);

  const handleExportImage = async (): Promise<void> => {
    setShowExportView(true);
    // DOM更新を待つ
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (exportViewRef.current) {
      const deckName = deck?.name || 'デッキ';
      const date = new Date().toISOString().slice(0, 10);
      await captureElement(
        exportViewRef.current,
        `${deckName}_${date}.png`
      );
    }
    
    setShowExportView(false);
  };

  // DeckBuilderの必要幅を計算
  const deckBuilderWidth = React.useMemo(() => {
    if (isFriendSlotEnabled) {
      // フレンド有効: 4グループ分の幅 + 余裕
      return 'clamp(896px, 65%, 1280px)';
    } else {
      // フレンド無効: 3グループ分の幅
      return 'clamp(640px, 58%, 928px)';
    }
  }, [isFriendSlotEnabled]);

  return (
    <>
      {/* デバッグ用: エクスポートビューを画面上に表示 */}
      <div className="p-4 overflow-auto">
        <div className="mb-4 flex gap-4">
          <Button 
            onClick={() => setShowExportView(!showExportView)}
            variant="secondary"
          >
            {showExportView ? '通常画面に戻る' : 'エクスポートビューを表示'}
          </Button>
          <Button 
            onClick={handleExportImage}
            disabled={isCapturing}
            variant="primary"
          >
            {isCapturing ? '生成中...' : '📸 画像として保存'}
          </Button>
        </div>

        {showExportView ? (
          <div ref={exportViewRef} className="border-4 border-blue-500">
            <DeckExportView />
          </div>
        ) : (
          <div className="h-screen flex flex-col overflow-hidden">
            <DeckTabs
              tabs={tabs}
              activeTabId={activeTabId}
              onChangeTab={switchTab}
              onAddTab={addTab}
              onDeleteTab={deleteTab}
            >
              <div className="h-full flex gap-4 px-4 py-2 min-h-0 overflow-hidden">
                {/* 左側: デッキビルダー */}
                <div 
                  className="min-h-0 flex flex-col overflow-visible transition-all duration-300"
                  style={{ 
                    width: deckBuilderWidth,
                    flexShrink: 0
                  }}
                >
                  <DeckBuilder />
                </div>

                {/* 右側: DeckDashboard */}
                <div className="flex-1 min-w-0 flex flex-col gap-4 py-2">
                  <DeckDashboard />
                </div>
              </div>
            </DeckTabs>
          </div>
        )}
      </div>
    </>
  );
}
