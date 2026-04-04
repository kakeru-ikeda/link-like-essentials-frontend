/**
 * scripts/scraper/index.ts
 *
 * スクレイパーエントリポイント
 * GitHub Actions から `npx ts-node --project tsconfig.scraper.json scripts/scraper/index.ts` で実行
 *
 * 環境変数（必須）:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET   (省略時 'production')
 *   SANITY_WRITE_TOKEN
 *   FIREBASE_STORAGE_BUCKET
 *   FIREBASE_SERVICE_ACCOUNT_JSON  (GitHub Actions)
 *   または FIREBASE_SERVICE_ACCOUNT_PATH  (ローカル)
 *
 * 環境変数（任意）:
 *   DISCORD_WEBHOOK_URL
 *   SCRAPE_TARGET  cards|songs|lgp|gc|all  (省略時 all)
 */

// .env.local をロード（tsx は自動ロードしないため手動で行う）
import { config } from 'dotenv';
config({ path: '.env.local' });

import { scrapeCardsUseCase } from './usecases/ScrapeCardsUseCase';
import { scrapesongsUseCase } from './usecases/ScrapeSongsUseCase';
import { scrapeLiveGrandPrixUseCase } from './usecases/ScrapeLiveGrandPrixUseCase';
import { scrapeGradeChallengeUseCase } from './usecases/ScrapeGradeChallengeUseCase';
import { notifyDiscord, ScrapeReport } from './notifications/discord';

const EMPTY_RESULT = { total: 0, written: [], skipped: 0 };

async function main(): Promise<void> {
  const target = (process.env.SCRAPE_TARGET ?? 'all').toLowerCase();
  const startMs = Date.now();

  console.log(`\n====================================`);
  console.log(`  LLES Scraper  (target: ${target})`);
  console.log(`====================================\n`);

  const report: ScrapeReport = {
    cards: { ...EMPTY_RESULT },
    songs: { ...EMPTY_RESULT },
    lgp: { ...EMPTY_RESULT },
    gc: { ...EMPTY_RESULT },
    durationMs: 0,
  };

  try {
    if (target === 'all' || target === 'cards') {
      report.cards = await scrapeCardsUseCase();
    }
    if (target === 'all' || target === 'songs') {
      report.songs = await scrapesongsUseCase();
    }
    if (target === 'all' || target === 'lgp') {
      report.lgp = await scrapeLiveGrandPrixUseCase();
    }
    if (target === 'all' || target === 'gc') {
      report.gc = await scrapeGradeChallengeUseCase();
    }
  } catch (err) {
    console.error('Fatal error:', err);
    process.exitCode = 1;
  }

  report.durationMs = Date.now() - startMs;

  await notifyDiscord(report);

  const total =
    report.cards.written.length +
    report.songs.written.length +
    report.lgp.written.length +
    report.gc.written.length;

  console.log(
    `\n====================================`
  );
  console.log(
    `  Done in ${(report.durationMs / 1000).toFixed(1)}s  |  ${total} drafts written`
  );
  console.log(`====================================\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
