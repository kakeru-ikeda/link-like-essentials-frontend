import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/config/microcms';
import { MaintenanceContent } from '@/models/shared/Maintenance';
import { getMaintenanceFlag as getMaintenanceFlagRepository } from '@/repositories/firebase/remoteConfig';

const FALLBACK_CONTENT: MaintenanceContent = {
  id: '__fallback__maintenance',
  title: 'メンテナンス中です',
  body: '現在メンテナンス中のためサービスを一時停止しています。',
};

export const maintenanceService = {
  async getMaintenanceContent(
    revalidateSeconds = DEFAULT_MICROCMS_REVALIDATE_SECONDS,
  ): Promise<MaintenanceContent> {
    try {
      // Lazy import to avoid microCMS env resolution on client-only usage
      const { maintenanceRepository } = await import('@/repositories/api/maintenanceRepository');
      return await maintenanceRepository.getMaintenance(revalidateSeconds);
    } catch (error) {
      console.error('メンテナンス情報取得エラー:', error);
      return FALLBACK_CONTENT;
    }
  },
  async getMaintenanceFlag(): Promise<boolean> {
    return getMaintenanceFlagRepository();
  },
};
