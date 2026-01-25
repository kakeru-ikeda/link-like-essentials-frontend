import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/config/microcms';
import { MaintenanceContent } from '@/models/shared/Maintenance';
import { getMicrocmsObject } from './microcmsRepository';

const MAINTENANCE_ENDPOINT = 'maintenance';

export const maintenanceRepository = {
  async getMaintenance(
    revalidateSeconds = DEFAULT_MICROCMS_REVALIDATE_SECONDS,
  ): Promise<MaintenanceContent> {
    return getMicrocmsObject<MaintenanceContent>({
      endpoint: MAINTENANCE_ENDPOINT,
      revalidateSeconds,
    });
  },
};
