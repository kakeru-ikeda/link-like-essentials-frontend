import { fetchPublished, fetchDrafts, writeDraft } from '../lib/sanityWriter';
import {
  scrapeLiveGrandPrixList,
  scrapeLiveGrandPrixDetail,
} from '../scrapers/wikiLiveGrandPrix';
import { scrapeSongList, ScrapedSong } from '../scrapers/wikiSong';
import { YearTerm } from '@/models/shared/enums';

// ---------- ヘルパー ----------

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

interface LGPSnapshot {
  _id: string;
  eventName: string;
  yearTerm: string;
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
 * 1. Sanity公開済みを eventName+yearTerm で名前ベースマッチング
 * 2. 一致しない（新規/ドラフト）のみ詳細スクレイプ
 * 3. ドラフトとして Sanity に書き込み
 */
export async function scrapeLiveGrandPrixUseCase(
  prefetchedSongList?: ScrapedSong[]
): Promise<ScrapeLiveGrandPrixResult> {
  console.log('\n=== ScrapeLiveGrandPrixUseCase start ===');

  const [publishedLGPs, draftLGPs, publishedSongs] = await Promise.all([
    fetchPublished<LGPSnapshot>('liveGrandPrix', '_id, eventName, yearTerm'),
    fetchDrafts<LGPSnapshot>('liveGrandPrix', '_id, eventName, yearTerm'),
    fetchPublished<{ _id: string; songName: string }>('song', '_id, songName'),
  ]);

  const songList = prefetchedSongList ?? await scrapeSongList();

  // wiki songUrl → Sanity song._id マップ
  const songNameToId = new Map(publishedSongs.map((s) => [s.songName, s._id]));
  const songUrlToId = new Map(
    songList
      .filter((s) => s.songUrl && songNameToId.has(s.songName))
      .map((s) => [s.songUrl!, songNameToId.get(s.songName)!])
  );

  // 名前ベースルックアップ: "yearTerm:eventName" → snapshot
  // 公開済みが優先、なければドラフトの ID を再利用
  const nameMap = new Map<string, LGPSnapshot>();
  for (const lgp of draftLGPs) nameMap.set(`${lgp.yearTerm}:${lgp.eventName}`, lgp);
  for (const lgp of publishedLGPs) nameMap.set(`${lgp.yearTerm}:${lgp.eventName}`, lgp);

  // 公開済み ID セット（公開済みかつドラフトなし → スキップ判定用）
  const publishedIds = new Set(publishedLGPs.map((lgp) => lgp._id));
  const draftIds = new Set(draftLGPs.map((lgp) => lgp._id));

  // 新規 ID 採番用の最大番号（published + drafts 両方から）
  const allNums = [...publishedLGPs, ...draftLGPs]
    .map((lgp) => parseInt(lgp._id.replace('liveGrandPrix-', ''), 10))
    .filter((n) => !isNaN(n));
  let maxLGPNum = allNums.length > 0 ? Math.max(...allNums) : 0;

  console.log(
    `Sanity: ${publishedLGPs.length} published, ${draftLGPs.length} drafts`
  );

  const events = await scrapeLiveGrandPrixList();
  console.log(`Found ${events.length} LGP events`);

  const written: string[] = [];
  let skipped = 0;

  for (const event of events) {
    const nameKey = `${event.yearTerm}:${event.eventName}`;
    const existing = nameMap.get(nameKey);

    // 公開済みかつドラフトなし → スキップ
    if (existing && publishedIds.has(existing._id) && !draftIds.has(existing._id)) {
      skipped++;
      console.log(`  ⏭️  Skipping (published): ${event.eventName}`);
      continue;
    }

    const resolvedId = existing?._id ?? `liveGrandPrix-${++maxLGPNum}`;

    // 詳細スクレイプ
    if (event.eventUrl) {
      try {
        console.log(`  → Scraping detail: ${event.eventName}`);
        event.stages = await scrapeLiveGrandPrixDetail(event.eventUrl);
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`  ✗ Detail scrape failed: ${(err as Error).message}`);
      }
    }

    try {
      const doc = {
        _id: resolvedId,
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
          song: stage.songUrl && songUrlToId.has(stage.songUrl)
            ? {
                _type: 'reference',
                _ref: songUrlToId.get(stage.songUrl)!,
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
