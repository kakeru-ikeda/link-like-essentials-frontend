import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/config/microcms';
import { MaintenanceContent } from '@/models/Maintenance';
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
