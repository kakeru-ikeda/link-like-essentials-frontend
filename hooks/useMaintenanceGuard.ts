'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getMaintenanceFlag } from '@/repositories/firebase/remoteConfig';

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

  useEffect(() => {
    let active = true;

    const evaluate = async () => {
      try {
        const flag = await getMaintenanceFlag();
        if (!active) return;
        setIsMaintenance(flag);

        const onMaintenancePage = pathname?.startsWith(MAINTENANCE_PATH) ?? false;
        if (flag && pathname && !onMaintenancePage) {
          router.replace(MAINTENANCE_PATH);
        } else if (!flag && onMaintenancePage) {
          router.replace('/');
        }
      } catch (error) {
        console.error('メンテナンス判定エラー:', error);
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    };

    evaluate();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  return {
    isChecking,
    isMaintenance,
    isMaintenancePath: pathname?.startsWith(MAINTENANCE_PATH) ?? false,
  };
}
