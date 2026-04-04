import { request } from 'undici';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export interface ScrapeReport {
  cards: { total: number; written: string[]; skipped: number };
  songs: { total: number; written: string[]; skipped: number };
  lgp: { total: number; written: string[]; skipped: number };
  gc: { total: number; written: string[]; skipped: number };
  durationMs: number;
}

function buildEmbed(report: ScrapeReport): object {
  const totalWritten =
    report.cards.written.length +
    report.songs.written.length +
    report.lgp.written.length +
    report.gc.written.length;

  const hasUpdates = totalWritten > 0;
  const color = hasUpdates ? 0x00b0f4 : 0x888888; // 青 or グレー

  const fields: Array<{ name: string; value: string; inline: boolean }> = [];

  const addField = (
    label: string,
    res: { total: number; written: string[]; skipped: number }
  ): void => {
    const count = res.written.length;
    if (count === 0) {
      fields.push({
        name: label,
        value: '変更なし',
        inline: true,
      });
    } else {
      const list = res.written.slice(0, 5).join('\n');
      const more = res.written.length > 5 ? `…他 ${res.written.length - 5} 件` : '';
      fields.push({
        name: `${label}（${count}件）`,
        value: list + (more ? '\n' + more : ''),
        inline: false,
      });
    }
  };

  addField('🃏 カード', report.cards);
  addField('🎵 楽曲', report.songs);
  addField('🏆 ライブグランプリ', report.lgp);
  addField('⭐ グレードチャレンジ', report.gc);

  return {
    title: hasUpdates
      ? `✅ スクレイピング完了（${totalWritten}件をドラフトに書き込み）`
      : '✅ スクレイピング完了（変更なし）',
    color,
    fields,
    footer: {
      text: `実行時間: ${(report.durationMs / 1000).toFixed(1)}s`,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * スクレイピング結果を Discord に通知する
 * DISCORD_WEBHOOK_URL が未設定の場合はスキップ
 */
export async function notifyDiscord(report: ScrapeReport): Promise<void> {
  if (!WEBHOOK_URL) {
    console.log('[Discord] DISCORD_WEBHOOK_URL not set, skipping notification');
    return;
  }

  const payload = JSON.stringify({
    embeds: [buildEmbed(report)],
  });

  try {
    const { statusCode } = await request(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    if (statusCode >= 200 && statusCode < 300) {
      console.log('[Discord] Notification sent');
    } else {
      console.warn(`[Discord] Unexpected status: ${statusCode}`);
    }
  } catch (err) {
    console.error(`[Discord] Failed to send: ${(err as Error).message}`);
  }
}
