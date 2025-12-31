import * as htmlToImage from 'html-to-image';
import { useCallback, useState } from 'react';

export function useScreenshot() {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const captureElementAsDataUrl = useCallback(async (
    element: HTMLElement
  ): Promise<string> => {
    setIsCapturing(true);
    try {
      return await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 0.5,
        cacheBust: true,
        backgroundColor: '#ffffff',
        style: {
          letterSpacing: 'normal',
        },
      });
    } catch (error) {
      throw error;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const captureElement = useCallback(async (
    element: HTMLElement,
    filename: string = 'deck-screenshot.png'
  ): Promise<void> => {
    try {
      const dataUrl = await captureElementAsDataUrl(element);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('スクリーンショット失敗:', error);
    }
  }, [captureElementAsDataUrl]);

  return { captureElement, captureElementAsDataUrl, isCapturing };
}
