import { fetchPublishedIds, fetchDraftIds, writeDraft } from '../lib/sanityWriter';
import { scrapeGradeChallengeAll } from '../scrapers/wikiGradeChallenge';

/** wiki の楽曲 URL から Sanity songId を導出 */
function songIdFromUrl(songUrl: string): string {
  return songUrl
    .replace('https://wikiwiki.jp/llll_wiki/', '')
    .replace(/\//g, '-');
}

/** ISO 文字列 → 'YYYY-MM-DD'（Sanity date 型用） */
function toDateString(iso: string): string | undefined {
  if (!iso) return undefined;
  return iso.substring(0, 10);
}

export interface ScrapeGradeChallengeResult {
  total: number;
  written: string[];
  skipped: number;
}

/**
 * グレードチャレンジスクレイプユースケース
 *
 * 1. GC一覧取得（1リクエスト）+ 新規のみ詳細スクレイプ
 * 2. ドラフトとして Sanity に書き込み
 */
export async function scrapeGradeChallengeUseCase(): Promise<ScrapeGradeChallengeResult> {
  console.log('\n=== ScrapeGradeChallengeUseCase start ===');

  const [publishedIds, draftIds] = await Promise.all([
    fetchPublishedIds('gradeChallenge'),
    fetchDraftIds('gradeChallenge'),
  ]);

  const publishedSet = new Set(publishedIds);
  const draftSet = new Set(draftIds);

  console.log(
    `Sanity: ${publishedSet.size} published, ${draftSet.size} drafts`
  );

  // existingIds = 公開済みかつドラフトなし → 詳細スクレイプをスキップ
  const existingIds = new Set(
    [...publishedSet].filter((id) => !draftSet.has(id))
  );

  const challenges = await scrapeGradeChallengeAll(existingIds);

  console.log(`Found ${challenges.length} GC entries`);

  const written: string[] = [];
  let skipped = 0;

  for (const challenge of challenges) {
    if (publishedSet.has(challenge.challengeId) && !draftSet.has(challenge.challengeId)) {
      skipped++;
      continue;
    }

    try {
      const doc = {
        _id: challenge.challengeId,
        _type: 'gradeChallenge',
        title: challenge.title,
        termName: challenge.termName,
        startDate: toDateString(challenge.startDate),
        endDate: toDateString(challenge.endDate),
        detailUrl: challenge.detailUrl,
        details: (challenge.stages ?? []).map((stage) => ({
          _type: 'object',
          stageName: stage.stageName,
          specialEffect: stage.specialEffect,
          song: stage.songUrl
            ? {
                _type: 'reference',
                _ref: songIdFromUrl(stage.songUrl),
              }
            : undefined,
          sectionEffects: stage.sectionEffects.map((se) => ({
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
