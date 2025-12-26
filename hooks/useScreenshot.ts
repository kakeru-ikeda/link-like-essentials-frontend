import * as htmlToImage from 'html-to-image';
import { useCallback, useState } from 'react';

export function useScreenshot() {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const captureElement = useCallback(async (
    element: HTMLElement,
    filename: string = 'deck-screenshot.png'
  ): Promise<void> => {
    setIsCapturing(true);
    try {
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        style: {
          letterSpacing: 'normal',
        },
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('スクリーンショット失敗:', error);
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return { captureElement, isCapturing };
}
