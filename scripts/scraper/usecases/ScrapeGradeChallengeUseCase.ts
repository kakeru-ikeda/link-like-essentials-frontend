import { fetchPublished, fetchDrafts, writeDraft } from '../lib/sanityWriter';
import {
  scrapeGradeChallengeList,
  scrapeGradeChallengeDetail,
} from '../scrapers/wikiGradeChallenge';
import { scrapeSongList, ScrapedSong } from '../scrapers/wikiSong';

/** ISO 文字列 → 'YYYY-MM-DD'（Sanity date 型用） */
function toDateString(iso: string): string | undefined {
  if (!iso) return undefined;
  return iso.substring(0, 10);
}

interface GCSnapshot {
  _id: string;
  title: string;
}

export interface ScrapeGradeChallengeResult {
  total: number;
  written: string[];
  skipped: number;
}

/**
 * グレードチャレンジスクレイプユースケース
 *
 * 1. Sanity公開済みを title で名前ベースマッチング
 * 2. 一致しない（新規/ドラフト）のみ詳細スクレイプ
 * 3. ドラフトとして Sanity に書き込み
 */
export async function scrapeGradeChallengeUseCase(
  prefetchedSongList?: ScrapedSong[]
): Promise<ScrapeGradeChallengeResult> {
  console.log('\n=== ScrapeGradeChallengeUseCase start ===');

  const [publishedGCs, draftGCs, publishedSongs] = await Promise.all([
    fetchPublished<GCSnapshot>('gradeChallenge', '_id, title'),
    fetchDrafts<GCSnapshot>('gradeChallenge', '_id, title'),
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

  // 名前ベースルックアップ: title → snapshot
  // 公開済みが優先、なければドラフトの ID を再利用
  const nameMap = new Map<string, GCSnapshot>();
  for (const gc of draftGCs) nameMap.set(gc.title, gc);
  for (const gc of publishedGCs) nameMap.set(gc.title, gc);

  // 公開済み ID セット（公開済みかつドラフトなし → スキップ判定用）
  const publishedIds = new Set(publishedGCs.map((gc) => gc._id));
  const draftIds = new Set(draftGCs.map((gc) => gc._id));

  // 新規 ID 採番用の最大番号（published + drafts 両方から）
  const allNums = [...publishedGCs, ...draftGCs]
    .map((gc) => parseInt(gc._id.replace('gradeChallenge-', ''), 10))
    .filter((n) => !isNaN(n));
  let maxGCNum = allNums.length > 0 ? Math.max(...allNums) : 0;

  console.log(
    `Sanity: ${publishedGCs.length} published, ${draftGCs.length} drafts`
  );

  const challenges = await scrapeGradeChallengeList();
  console.log(`Found ${challenges.length} GC entries`);

  const written: string[] = [];
  let skipped = 0;

  for (const challenge of challenges) {
    const existing = nameMap.get(challenge.title);

    // 公開済みかつドラフトなし → スキップ
    if (existing && publishedIds.has(existing._id) && !draftIds.has(existing._id)) {
      skipped++;
      console.log(`  ⏭️  Skipping (published): ${challenge.title}`);
      continue;
    }

    const resolvedId = existing?._id ?? `gradeChallenge-${++maxGCNum}`;

    // 詳細スクレイプ
    if (challenge.detailUrl) {
      try {
        console.log(`  → Scraping detail: ${challenge.title}`);
        challenge.stages = await scrapeGradeChallengeDetail(challenge.detailUrl);
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`  ✗ Detail scrape failed: ${(err as Error).message}`);
      }
    }

    try {
      const doc = {
        _id: resolvedId,
        _type: 'gradeChallenge',
        title: challenge.title,
        termName: challenge.termName,
        startDate: toDateString(challenge.startDate),
        endDate: toDateString(challenge.endDate),
        detailUrl: challenge.detailUrl,
        details: (challenge.stages ?? []).map((stage, si) => ({
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
      written.push(challenge.title);
      console.log(`  ✓ Written: ${challenge.title}`);
    } catch (err) {
      console.error(
        `  ✗ Failed: ${challenge.title} - ${(err as Error).message}`
      );
    }
  }

  console.log(
    `=== ScrapeGradeChallengeUseCase done: ${written.length} written, ${skipped} skipped ===\n`
  );
  return { total: challenges.length, written, skipped };
}
