import { fetchPublishedIds, fetchDraftIds, writeDraft } from '../lib/sanityWriter';
import { scrapeLiveGrandPrixAll } from '../scrapers/wikiLiveGrandPrix';
import { YearTerm } from '@/models/shared/enums';

// ---------- ヘルパー ----------

/** wiki の楽曲 URL から Sanity songId を導出 */
function songIdFromUrl(songUrl: string): string {
  return songUrl
    .replace('https://wikiwiki.jp/llll_wiki/', '')
    .replace(/\//g, '-');
}

const YEAR_TERM_MAP: Record<string, YearTerm> = {
  '103期': YearTerm.TERM_103,
  '104期': YearTerm.TERM_104,
  '105期': YearTerm.TERM_105,
};

/** ISO 文字列 → 'YYYY-MM-DD' 形式（Sanity date 型用） */
function toDateString(iso: string): string | undefined {
  if (!iso) return undefined;
  return iso.substring(0, 10);
}

// ---------- メイン ----------

export interface ScrapeLiveGrandPrixResult {
  total: number;
  written: string[];
  skipped: number;
}

/**
 * ライブグランプリスクレイプユースケース
 *
 * 1. LGP一覧取得（1リクエスト）+ 新規のみ詳細スクレイプ
 * 2. ドラフトとして Sanity に書き込み
 */
export async function scrapeLiveGrandPrixUseCase(): Promise<ScrapeLiveGrandPrixResult> {
  console.log('\n=== ScrapeLiveGrandPrixUseCase start ===');

  const [publishedIds, draftIds] = await Promise.all([
    fetchPublishedIds('liveGrandPrix'),
    fetchDraftIds('liveGrandPrix'),
  ]);

  const publishedSet = new Set(publishedIds);
  const draftSet = new Set(draftIds);

  console.log(
    `Sanity: ${publishedSet.size} published, ${draftSet.size} drafts`
  );

  // 詳細スクレイプが必要な ID セット（公開済みでないもの）
  const needDetailIds = new Set([
    ...Array.from(draftSet),
    // 公開済みでないものは scraper 内で詳細取得されるが、既存 draft は再取得する
  ]);

  // existingIds = 公開済みかつドラフトなし → 詳細スクレイプをスキップ
  const existingIds = new Set(
    [...publishedSet].filter((id) => !needDetailIds.has(id))
  );

  const events = await scrapeLiveGrandPrixAll(existingIds);

  console.log(`Found ${events.length} LGP events`);

  const written: string[] = [];
  let skipped = 0;

  for (const event of events) {
    // 公開済みでドラフトなし → スキップ
    if (publishedSet.has(event.eventId) && !draftSet.has(event.eventId)) {
      skipped++;
      continue;
    }

    try {
      const doc = {
        _id: event.eventId,
        _type: 'liveGrandPrix',
        eventName: event.eventName,
        yearTerm: YEAR_TERM_MAP[event.yearTerm] ?? event.yearTerm,
        startDate: toDateString(event.startDate),
        endDate: toDateString(event.endDate),
        eventUrl: event.eventUrl,
        details: (event.stages ?? []).map((stage, si) => ({
          _key: `stage-${si}`,
          _type: 'object',
          stageName: stage.stageName,
          specialEffect: stage.specialEffect,
          song: stage.songUrl
            ? {
                _type: 'reference',
                _ref: songIdFromUrl(stage.songUrl),
              }
            : undefined,
          sectionEffects: stage.sectionEffects.map((se, ei) => ({
            _key: `se-${ei}`,
            _type: 'object',
            sectionName: se.sectionName,
            effect: se.effect,
            sectionOrder: se.sectionOrder,
          })),
        })),
      };

      await writeDraft(doc);
      written.push(event.eventName);
      console.log(`  ✓ Written: ${event.eventName}`);
    } catch (err) {
      console.error(
        `  ✗ Failed: ${event.eventName} - ${(err as Error).message}`
      );
    }
  }

  console.log(
    `=== ScrapeLiveGrandPrixUseCase done: ${written.length} written, ${skipped} skipped ===\n`
  );
  return { total: events.length, written, skipped };
}
