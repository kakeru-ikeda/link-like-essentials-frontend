'use client';

import React from 'react';
import { Loading } from '@/components/common/Loading';
import { useMaintenanceGuard } from '@/hooks/useMaintenanceGuard';

interface MaintenanceGateProps {
  children: React.ReactNode;
}

export const MaintenanceGate: React.FC<MaintenanceGateProps> = ({ children }) => {
  const { isChecking, isMaintenance, isMaintenancePath } = useMaintenanceGuard();

  if (isMaintenancePath) {
    return <>{children}</>;
  }

  if (isChecking) {
    return <Loading fullScreen message="Loading..." />;
  }

  if (isMaintenance) {
    return <Loading fullScreen message="Maintenance in progress..." />;
  }

  return <>{children}</>;
};
