import { DEFAULT_MICROCMS_REVALIDATE_SECONDS } from '@/config/microcms';
import { MaintenanceContent } from '@/models/Maintenance';
import { maintenanceRepository } from '@/repositories/api/maintenanceRepository';

const FALLBACK_CONTENT: MaintenanceContent = {
  id: 'maintenance-fallback',
  title: 'メンテナンス中です',
  body: '現在メンテナンス中のためサービスを一時停止しています。',
};

export const maintenanceService = {
  async getMaintenanceContent(
    revalidateSeconds = DEFAULT_MICROCMS_REVALIDATE_SECONDS,
  ): Promise<MaintenanceContent> {
    try {
      return await maintenanceRepository.getMaintenance(revalidateSeconds);
    } catch (error) {
      console.error('メンテナンス情報取得エラー:', error);
      return FALLBACK_CONTENT;
    }
  },
};
