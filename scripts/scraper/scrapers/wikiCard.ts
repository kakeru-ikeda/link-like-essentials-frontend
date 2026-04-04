import * as cheerio from 'cheerio';
import { fetchWithRetry } from '../lib/httpClient';

export interface ScrapedCard {
  /** カード一意ID（cardUrl から生成） */
  cardId: string;
  cardName: string;
  characterName: string;
  rarity: string;
  limited: string;
  styleType: string;
  releaseDate?: string;
  cardUrl: string;
}

const CARD_LIST_URL =
  'https://wikiwiki.jp/llll_wiki/%E3%82%AB%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7';

/**
 * カード一覧ページをスクレイプして基本情報リストを返す
 * 1リクエストのみ
 */
export async function scrapeCardList(): Promise<ScrapedCard[]> {
  console.log(`Fetching card list: ${CARD_LIST_URL}`);
  const html = await fetchWithRetry(CARD_LIST_URL);
  const $ = cheerio.load(html);
  const cards: ScrapedCard[] = [];

  $('table').each((_tableIdx, table) => {
    $(table)
      .find('tr')
      .each((_rowIdx, row) => {
        const $row = $(row);
        if ($row.find('th').length > 0) return; // ヘッダー行スキップ

        const cells = $row.find('td');
        if (cells.length < 6) return;

        const $cardLink = $(cells[2]).find('a');
        const href = $cardLink.attr('href');
        if (!href) return;

        const cardUrl = `https://wikiwiki.jp${href}`;
        const cardId = decodeURIComponent(href)
          .replace(/^\/llll_wiki\//, '')
          .replace(/\//g, '-')
          .replace(/[^\w\-]/g, '_');

        let releaseDate: string | undefined;
        if (cells.length >= 8) {
          const text = $(cells[7]).text().trim();
          if (/^\d{4}\/\d{2}\/\d{2}$/.test(text)) {
            releaseDate = text.replace(/\//g, '-');
          }
        }

        const rarity = $(cells[0]).text().trim();
        const characterName = $(cells[3]).text().trim();

        const isHeaderRow =
          rarity === 'レアリティ' ||
          characterName === 'キャラクター' ||
          $(cells[1]).text().trim() === '恒常/限定';

        if (isHeaderRow) return;

        const card: ScrapedCard = {
          cardId,
          rarity,
          limited: $(cells[1]).text().trim(),
          cardName: $(cells[2]).text().trim(),
          characterName,
          styleType: $(cells[4]).text().trim(),
          releaseDate,
          cardUrl,
        };

        if (card.cardName && card.characterName) {
          cards.push(card);
        }
      });
  });

  console.log(`Found ${cards.length} cards`);
  return cards;
}
