import type { Metadata } from 'next';
import { maintenanceService } from '@/services/maintenanceService';
import { formatDate } from '@/utils/dateUtils';
import { buildPageMetadata } from '@/utils/metadataUtils';
import { sanitizeMicroCMSContent } from '@/utils/sanitizeHtmlUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'メンテナンス中',
  description: '現在メンテナンス中のため、サービスをご利用いただけません。',
});

export default async function MaintenancePage() {
  const maintenance = await maintenanceService.getMaintenanceContent();
  const bodyHtml = maintenance.body ?? maintenance.notice ?? '';
  const sanitizedBody = sanitizeMicroCMSContent(bodyHtml);
  const updatedText = formatDate(maintenance.updatedAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Maintenance
          </p>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {maintenance.title}
          </h1>
          <p className="text-base text-gray-600">
            現在メンテナンス中のため、サービスをご利用いただけません。
          </p>
          {updatedText && (
            <p className="text-xs text-gray-500">最終更新: {updatedText}</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {sanitizedBody ? (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              ご不便をおかけしますが、しばらくお待ちください。
            </p>
          )}

          {maintenance.ctaLabel && maintenance.ctaUrl && (
            <div className="mt-8 text-center">
              <a
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600"
                href={maintenance.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {maintenance.ctaLabel}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
