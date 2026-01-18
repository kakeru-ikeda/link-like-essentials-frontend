'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { maintenanceService } from '@/services/maintenanceService';

const MAINTENANCE_PATH = '/maintenance';

interface MaintenanceGuardState {
  isChecking: boolean;
  isMaintenance: boolean;
  isMaintenancePath: boolean;
}

export function useMaintenanceGuard(): MaintenanceGuardState {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const evaluate = async () => {
      try {
        const flag = await maintenanceService.getMaintenanceFlag();
        if (!active) return;
        setIsMaintenance(flag);
      } catch (error) {
        console.error('メンテナンス判定エラー:', error);
      } finally {
        if (active && !hasCheckedRef.current) {
          setIsChecking(false);
          hasCheckedRef.current = true;
        }
      }
    };

    evaluate();
    const timer = setInterval(evaluate, 60_000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const onMaintenancePage = pathname?.startsWith(MAINTENANCE_PATH) ?? false;
    if (isMaintenance && pathname && !onMaintenancePage) {
      router.replace(MAINTENANCE_PATH);
    } else if (!isMaintenance && onMaintenancePage) {
      router.replace('/');
    }
  }, [isMaintenance, pathname, router]);

  return {
    isChecking,
    isMaintenance,
    isMaintenancePath: pathname?.startsWith(MAINTENANCE_PATH) ?? false,
  };
}
