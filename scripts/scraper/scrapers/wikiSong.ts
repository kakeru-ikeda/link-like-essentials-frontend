import * as cheerio from 'cheerio';
import { fetchWithRetry } from '../lib/httpClient';
import { ParticipationResolver } from '../lib/participationResolver';
import { CHARACTER_NAME_MAP } from '@/config/characters';

export interface ScrapedSong {
  songId: string;
  songName: string;
  songUrl?: string;
  category: string;
  attribute: string;
  centerCharacter: string;
  singers: string;
  participations?: string;
}

export interface ScrapedSongDetail {
  jacketImageUrl?: string;
  liveAnalyzerImageUrl?: string;
}

const SONG_LIST_URL =
  'https://wikiwiki.jp/llll_wiki/%E3%82%B9%E3%82%AF%E3%82%B9%E3%83%86/%E3%82%B9%E3%83%86%E3%83%BC%E3%82%B8/%E6%A5%BD%E6%9B%B2%E4%B8%80%E8%A6%A7';

function normalizeCharacterName(name: string): string {
  return CHARACTER_NAME_MAP[name] ?? name;
}

function normalizeSingers(singers: string): string {
  return singers
    .replace(/ソロ/g, '')
    .replace(/\*\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[、,]/)
    .map((c) => normalizeCharacterName(c.trim()))
    .join(',');
}

/**
 * 楽曲一覧ページをスクレイプ（1リクエスト）
 */
export async function scrapeSongList(): Promise<ScrapedSong[]> {
  console.log(`Fetching song list: ${SONG_LIST_URL}`);
  const html = await fetchWithRetry(SONG_LIST_URL);
  const $ = cheerio.load(html);
  const songs: ScrapedSong[] = [];

  $('table').each((_i, table) => {
    const headerTexts = $(table)
      .find('tr')
      .first()
      .find('th, td')
      .map((_j, el) => $(el).text().trim())
      .get();

    const isSongTable = headerTexts.some(
      (h) => h.includes('楽曲名') || h.includes('曲名')
    );
    if (!isSongTable) return;

    $(table)
      .find('tr')
      .slice(1)
      .each((_i, row) => {
        const cells = $(row).find('td');
        if (cells.length < 5) return;

        const $link = $(cells[1]).find('a');
        const href = $link.attr('href');
        const songUrl = href ? `https://wikiwiki.jp${href}` : undefined;
        const songId = href
          ? href.replace(/^\/llll_wiki\//, '').replace(/\//g, '-')
          : $(cells[1]).text().trim().replace(/\s+/g, '-');

        const category = $(cells[0]).text().trim();
        const songName = $(cells[1]).text().trim();

        if (
          category === '区分' ||
          songName === '楽曲名' ||
          $(cells[2]).text().trim() === '属性'
        )
          return;
        if (!songName || !category) return;

        const singers = normalizeSingers($(cells[4]).text().trim());
        const participations = ParticipationResolver.resolve(category, singers);

        songs.push({
          songId,
          songName,
          songUrl,
          category,
          attribute: $(cells[2]).text().trim(),
          centerCharacter: normalizeCharacterName($(cells[3]).text().trim()),
          singers,
          participations,
        });
      });
  });

  console.log(`Found ${songs.length} songs`);
  return songs;
}

/**
 * 楽曲詳細ページをスクレイプ（差分時のみ呼ぶ）
 */
export async function scrapeSongDetail(url: string): Promise<ScrapedSongDetail> {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  let jacketImageUrl = $('img').first().attr('src');
  let liveAnalyzerImageUrl: string | undefined;

  $('h2, h3').each((_i, heading) => {
    if ($(heading).text().trim().includes('ライブアナライザ')) {
      let el = $(heading).next();
      for (let d = 0; d < 5; d++) {
        const img = el.find('img').first();
        if (img.length) {
          liveAnalyzerImageUrl = img.attr('src');
          return false;
        }
        if (el.is('img')) {
          liveAnalyzerImageUrl = el.attr('src');
          return false;
        }
        el = el.next();
      }
    }
  });

  if (!liveAnalyzerImageUrl) {
    const imgs = $('img');
    if (imgs.length > 1) {
      liveAnalyzerImageUrl = $(imgs[1]).attr('src');
    }
  }

  return { jacketImageUrl, liveAnalyzerImageUrl };
}
