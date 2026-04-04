import * as cheerio from 'cheerio';
import { fetchWithRetry } from '../lib/httpClient';

export interface ScrapedGradeChallengeStage {
  stageName: string; // 'A', 'B', 'C'
  specialEffect: string;
  songUrl?: string;
  sectionEffects: Array<{
    sectionName: string;
    effect: string;
    sectionOrder: number;
  }>;
}

export interface ScrapedGradeChallenge {
  /** 一意ID（title から生成: gc-2026-01） */
  challengeId: string;
  title: string; // '2026年1月'
  termName?: string; // '104期 2nd Term'
  startDate: string; // ISO
  endDate: string;
  detailUrl?: string;
  stages?: ScrapedGradeChallengeStage[];
}

const GC_URL =
  'https://wikiwiki.jp/llll_wiki/%E3%82%B9%E3%82%AF%E3%82%B9%E3%83%86/%E3%82%B9%E3%83%86%E3%83%BC%E3%82%B8/%E3%82%B0%E3%83%AC%E3%83%BC%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96';

function parseDateRange(text: string): { startDate: string; endDate: string } {
  const m = text.match(
    /(\d{4})\/(\d{1,2})\/(\d{1,2})\s*[～~〜]\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/
  );
  if (!m) return { startDate: '', endDate: '' };
  const [, sy, sm, sd, ey, em, ed] = m;
  return {
    startDate: new Date(+sy, +sm - 1, +sd).toISOString(),
    endDate: new Date(+ey, +em - 1, +ed, 23, 59).toISOString(),
  };
}

function makeChallengeId(title: string): string {
  // '2026年1月' → 'gc-2026-01'
  const m = title.match(/(\d{4})年(\d{1,2})月/);
  if (m) {
    return `gc-${m[1]}-${m[2].padStart(2, '0')}`;
  }
  return `gc-${title.replace(/[^\w]/g, '-')}`;
}

/** GC一覧ページをパースしてエントリ一覧を返す（内部共通局所） */
async function parseGCList(): Promise<ScrapedGradeChallenge[]> {
  console.log(`Fetching GC list: ${GC_URL}`);
  const html = await fetchWithRetry(GC_URL);
  const $ = cheerio.load(html);

  const challenges: ScrapedGradeChallenge[] = [];

  $('h3').each((_i, heading) => {
    if (!$(heading).text().trim().includes('ステージ詳細')) return;

    let el = $(heading).next();
    for (let d = 0; d < 50 && el.length > 0; d++) {
      if (el.is('h2') || el.is('h3')) break;

      const $ul = el.is('ul') ? el : el.find('ul').first();
      if ($ul.length > 0) {
        $ul.children('li').each((_termIdx, termLi) => {
          const $termLi = $(termLi);
          const $clone = $termLi.clone();
          $clone.children('ul').remove();
          const termName = $clone.text().trim() || undefined;

          $termLi
            .find('ul')
            .first()
            .children('li')
            .each((_monthIdx, monthLi) => {
              const $monthLi = $(monthLi);
              const $link = $monthLi.find('a').first();
              if (!$link.length) return;

              const title = $link.text().trim();
              if (!title.match(/20\d{2}年\d{1,2}月/)) return;

              const href = $link.attr('href');
              const detailUrl =
                href?.startsWith('/llll_wiki/')
                  ? `https://wikiwiki.jp${href}`
                  : undefined;

              const { startDate, endDate } = parseDateRange(
                $monthLi.text()
              );
              const challengeId = makeChallengeId(title);

              challenges.push({
                challengeId,
                title,
                termName,
                startDate,
                endDate,
                detailUrl,
              });
            });
        });
        break;
      }

      el = el.next();
    }
  });

  console.log(`Found ${challenges.length} GC entries`);
  return challenges;
}

/**
 * GC一覧ページをスクレイプして一覧のみ返す（詳細スクレイプなし）
 */
export async function scrapeGradeChallengeList(): Promise<ScrapedGradeChallenge[]> {
  return parseGCList();
}

/**
 * GC一覧ページをスクレイプし、新規エントリの詳細もスクレイプして返す
 */
export async function scrapeGradeChallengeAll(
  existingIds: Set<string>
): Promise<ScrapedGradeChallenge[]> {
  const challenges = await parseGCList();

  // 詳細スクレイプ: 新規 or ドラフト残存のみ
  for (const challenge of challenges) {
    if (!challenge.detailUrl) continue;
    if (existingIds.has(challenge.challengeId)) {
      console.log(`  ⏭️  Skipping (published): ${challenge.title}`);
      continue;
    }

    try {
      console.log(`  → Scraping detail: ${challenge.title}`);
      challenge.stages = await scrapeGradeChallengeDetail(challenge.detailUrl);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`  ✗ Detail scrape failed: ${(err as Error).message}`);
    }
  }

  return challenges;
}

export async function scrapeGradeChallengeDetail(
  url: string
): Promise<ScrapedGradeChallengeStage[]> {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const stages: ScrapedGradeChallengeStage[] = [];
  let inStageDetails = false;

  $('h2, h3').each((_i, heading) => {
    const $heading = $(heading);
    const text = $heading.text().trim();

    if ($heading.is('h2') && text.includes('ステージ詳細')) {
      inStageDetails = true;
      return;
    }
    if (inStageDetails && $heading.is('h2')) {
      inStageDetails = false;
      return;
    }
    if (!inStageDetails || !$heading.is('h3') || !text.includes('ステージ')) return;

    const stageName = text.match(/ステージ([ABC])/)?.[1] ?? 'Unknown';
    const stage: ScrapedGradeChallengeStage = {
      stageName,
      specialEffect: '',
      sectionEffects: [],
    };

    let el = $heading.next();
    let sectionOrder = 1;

    for (let d = 0; d < 50 && el.length > 0; d++) {
      if (el.is('h2') || el.is('h3')) break;

      const $table = el.is('table') ? el : el.find('table').first();
      if ($table.length > 0) {
        $table.find('tr').each((_rowIdx, row) => {
          const cells = $(row).find('td, th');
          if (cells.length < 2) return;
          const label = $(cells[0]).text().trim().replace(/\s+/g, '');
          const value = $(cells[1]).text().trim();

          if (label === '特殊効果') stage.specialEffect = value;
          if (label === '課題曲') {
            const href = $(cells[1]).find('a').first().attr('href');
            if (href?.startsWith('/llll_wiki/')) {
              stage.songUrl = `https://wikiwiki.jp${href}`;
            }
          }
          if (label.includes('セクション') || label.includes('フィーバー')) {
            stage.sectionEffects.push({
              sectionName: label,
              effect: value,
              sectionOrder: sectionOrder++,
            });
          }
        });
      }

      el = el.next();
    }

    stages.push(stage);
  });

  return stages;
}
