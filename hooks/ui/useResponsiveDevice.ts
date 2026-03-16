'use client';

import { useEffect, useState } from 'react';

import { MEDIA_QUERY_PC, MEDIA_QUERY_TABLET } from '@/config/responsive';

type DeviceType = 'pc' | 'tablet' | 'sp';
interface UseResponsiveDeviceResult {
  deviceType: DeviceType;
  isPc: boolean;
  isTablet: boolean;
  isSp: boolean;
}

// 判定用ヘルパー。SSR 環境では初期 undefined を返し、クライアントで確定させる。
export function useResponsiveDevice(): UseResponsiveDeviceResult {
  const [deviceType, setDeviceType] = useState<DeviceType>('pc');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pcMql = window.matchMedia(MEDIA_QUERY_PC);
    const tabletMql = window.matchMedia(MEDIA_QUERY_TABLET);

    const update = (): void => {
      if (pcMql.matches) {
        setDeviceType('pc');
      } else if (tabletMql.matches) {
        setDeviceType('tablet');
      } else {
        setDeviceType('sp');
      }
    };

    update();

    const handleChange = (): void => {
      update();
    };

    if (typeof pcMql.addEventListener === 'function') {
      pcMql.addEventListener('change', handleChange);
      tabletMql.addEventListener('change', handleChange);
    } else {
      // Safari 13 系などの後方互換
      pcMql.addListener(handleChange);
      tabletMql.addListener(handleChange);
    }

    return () => {
      if (typeof pcMql.removeEventListener === 'function') {
        pcMql.removeEventListener('change', handleChange);
        tabletMql.removeEventListener('change', handleChange);
      } else {
        pcMql.removeListener(handleChange);
        tabletMql.removeListener(handleChange);
      }
    };
  }, []);

  return {
    deviceType,
    isPc: deviceType === 'pc',
    isTablet: deviceType === 'tablet',
    isSp: deviceType === 'sp',
  };
}
