'use client';

import React from 'react';
import { Loading } from '@/components/common/Loading';
import { useMaintenanceGuard } from '@/hooks/features/useMaintenanceGuard';

interface MaintenanceGateProps {
  children: React.ReactNode;
}

export const MaintenanceGate: React.FC<MaintenanceGateProps> = ({ children }) => {
  const { isChecking, isMaintenancePath } = useMaintenanceGuard();

  if (isMaintenancePath) {
    return <>{children}</>;
  }

  if (isChecking) {
    return <Loading fullScreen message="Loading..." />;
  }

  return <>{children}</>;
};
