import * as cheerio from 'cheerio';
import { fetchWithRetry } from '../lib/httpClient';

export interface ScrapedSectionEffect {
  sectionName: string;
  effect: string;
  sectionOrder: number;
}

export interface ScrapedStageDetail {
  stageName: string;
  specialEffect: string;
  songUrl?: string;
  sectionEffects: ScrapedSectionEffect[];
}

export interface ScrapedLiveGrandPrix {
  /** イベント一意ID（eventName + yearTerm から生成） */
  eventId: string;
  eventName: string;
  yearTerm: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  eventUrl?: string;
  stages?: ScrapedStageDetail[];
}

const LGP_URL =
  'https://wikiwiki.jp/llll_wiki/%E3%83%A9%E3%82%A4%E3%83%96%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%97%E3%83%AA';

/** JST の年月日を 'YYYY-MM-DD' 形式に変換する */
function jstDateToIso(dateStr: string): string {
  const [y, m, d] = dateStr.split('/').map(Number);
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseDateRange(text: string): { startDate: string; endDate: string } {
  const matches = text.match(/(\d{4}\/\d{1,2}\/\d{1,2})/g);
  if (!matches || matches.length < 2) {
    return { startDate: '', endDate: '' };
  }
  return {
    startDate: jstDateToIso(matches[0]),
    endDate: jstDateToIso(matches[1]),
  };
}

function makeEventId(eventName: string, yearTerm: string): string {
  return `lgp-${yearTerm}-${eventName}`
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

/** LGP一覧ページをパースしてイベント一覧を返す（内部共通局所） */
async function parseLGPList(): Promise<ScrapedLiveGrandPrix[]> {
  console.log(`Fetching LGP list: ${LGP_URL}`);
  const html = await fetchWithRetry(LGP_URL);
  const $ = cheerio.load(html);

  const events: ScrapedLiveGrandPrix[] = [];

  $('h2, h3, h4').each((_i, heading) => {
    if (!$(heading).text().trim().includes('過去のライブグランプリ履歴')) return;

    for (const term of ['105期', '104期', '103期']) {
      let el = $(heading).next();
      let depth = 0;

      while (el.length > 0 && depth < 50) {
        if (el.is('h2') || el.is('h3') || el.is('h4')) break;

        if (el.text().includes(term)) {
          el.find('table').first().find('tr').each((_rowIdx, row) => {
            const cells = $(row).find('td');
            if (cells.length < 2) return;

            const dateText = $(cells[0]).text().trim();
            const eventText = $(cells[1]).text().trim();

            if (!dateText.match(/\d{4}\/\d{1,2}\/\d{1,2}/)) return;
            if (
              dateText.includes('?') ||
              eventText.includes('?') ||
              eventText.includes('？')
            )
              return;

            const { startDate, endDate } = parseDateRange(dateText);
            const href = $(cells[1]).find('a').first().attr('href');
            const eventUrl =
              href && href.startsWith('/llll_wiki/')
                ? `https://wikiwiki.jp${href}`
                : undefined;
            const eventId = makeEventId(eventText, term);

            events.push({
              eventId,
              eventName: eventText,
              yearTerm: term,
              startDate,
              endDate,
              eventUrl,
            });
          });
        }

        el = el.next();
        depth++;
      }
    }
  });

  console.log(`Found ${events.length} LGP events`);
  return events;
}

/**
 * LGP一覧ページをスクレイプして一覧のみ返す（詳細スクレイプなし）
 */
export async function scrapeLiveGrandPrixList(): Promise<ScrapedLiveGrandPrix[]> {
  return parseLGPList();
}

/**
 * LGP一覧ページをスクレイプ（1リクエスト）し、
 * 詳細URLがあるものは詳細もスクレイプして stages に詰める
 */
export async function scrapeLiveGrandPrixAll(
  existingIds: Set<string>
): Promise<ScrapedLiveGrandPrix[]> {
  const events = await parseLGPList();

  // 詳細スクレイプ: existingIds にない or 詳細URLあり
  for (const event of events) {
    if (!event.eventUrl) continue;
    if (existingIds.has(event.eventId)) {
      console.log(`  ⏭️  Skipping (published): ${event.eventName}`);
      continue;
    }

    try {
      console.log(`  → Scraping detail: ${event.eventName}`);
      event.stages = await scrapeLiveGrandPrixDetail(event.eventUrl);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`  ✗ Detail scrape failed: ${(err as Error).message}`);
    }
  }

  return events;
}

export async function scrapeLiveGrandPrixDetail(
  url: string
): Promise<ScrapedStageDetail[]> {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const stages: ScrapedStageDetail[] = [];
  let foundStageSongs = false;

  $('h2, h3').each((_i, heading) => {
    const text = $(heading).text().trim();
    if (text.includes('ステージ課題曲')) {
      foundStageSongs = true;
    }
    if (!foundStageSongs) return;

    const match = text.match(/ステージ([ABC])/);
    if (!match) return;

    const stage: ScrapedStageDetail = {
      stageName: match[1],
      specialEffect: '',
      sectionEffects: [],
    };

    let el = $(heading).next();
    let sectionOrder = 1;

    for (let depth = 0; depth < 50 && el.length > 0; depth++) {
      if ((el.is('h2') || el.is('h3')) && !el.text().includes('考察')) break;

      const $table = el.is('table') ? el : el.find('table').first();
      if ($table.length > 0) {
        $table.find('tr').each((_rowIdx, row) => {
          const cells = $(row).find('td, th');
          if (cells.length < 2) return;
          const label = $(cells[0]).text().trim();
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
