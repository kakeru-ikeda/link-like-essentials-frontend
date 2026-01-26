'use client';

import { useEffect, useState } from 'react';

import { MEDIA_QUERY_PC } from '@/config/responsive';

type DeviceType = 'pc' | 'sp';
interface UseResponsiveDeviceResult {
  deviceType: DeviceType;
  isPc: boolean;
  isSp: boolean;
}

// 判定用ヘルパー。SSR 環境では初期 undefined を返し、クライアントで確定させる。
export function useResponsiveDevice(): UseResponsiveDeviceResult {
  const [deviceType, setDeviceType] = useState<DeviceType>('pc');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(MEDIA_QUERY_PC);
    const update = (): void => {
      setDeviceType(mediaQueryList.matches ? 'pc' : 'sp');
    };

    update();

    const handleChange = (): void => {
      update();
    };

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Safari 13 系などの後方互換
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQueryList.removeEventListener === 'function') {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, []);

  return {
    deviceType,
    isPc: deviceType === 'pc',
    isSp: deviceType === 'sp',
  };
}
