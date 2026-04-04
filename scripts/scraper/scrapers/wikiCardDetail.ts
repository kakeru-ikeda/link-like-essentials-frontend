import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { fetchWithRetry } from '../lib/httpClient';

export interface ScrapedAccessory {
  parentType: 'special_appeal' | 'skill' | 'trait';
  name: string;
  ap: string;
  effect: string;
  traitName: string;
  traitEffect: string;
}

export interface ScrapedCardDetail {
  favoriteMode?: string;
  acquisitionMethod?: string;
  awakeBeforeUrl?: string;
  awakeAfterUrl?: string;
  stats: { smile: string; pure: string; cool: string; mental: string };
  specialAppeal: { name: string; ap: string; effect: string };
  skill: { name: string; ap: string; effect: string };
  trait: { name: string; effect: string };
  accessories: ScrapedAccessory[];
}

/**
 * カード詳細ページをスクレイプして詳細情報を返す
 * 呼び出し元がドラフト判定・差分検出を行った後にのみ呼ぶこと
 */
export async function scrapeCardDetail(url: string): Promise<ScrapedCardDetail> {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const detail: ScrapedCardDetail = {
    stats: { smile: '', pure: '', cool: '', mental: '' },
    specialAppeal: { name: '', ap: '', effect: '' },
    skill: { name: '', ap: '', effect: '' },
    trait: { name: '', effect: '' },
    accessories: [],
  };

  // レアリティ取得（画像枚数判定に使用）
  let rarity = '';
  $('table').each((_i, table) => {
    const rows = $(table).find('tr');
    const headerTexts = rows
      .first()
      .find('th, td')
      .map((_j, el) => $(el).text().trim())
      .get();
    if (headerTexts.includes('レアリティ') && headerTexts.includes('限定/恒常')) {
      const dataCells = $(rows[1]).find('td');
      if (dataCells.length >= 1) {
        rarity = $(dataCells[0]).text().trim();
      }
    }
  });

  // 覚醒前後画像 URL
  const images = $('img');
  if (images.length >= 2) {
    detail.awakeBeforeUrl = $(images[0]).attr('src') ?? '';
    detail.awakeAfterUrl = $(images[1]).attr('src') ?? '';
  } else if (images.length === 1) {
    detail.awakeBeforeUrl = $(images[0]).attr('src') ?? '';
    detail.awakeAfterUrl = detail.awakeBeforeUrl;
  }

  // DR/BR/LR は覚醒後 = 覚醒前
  if (['DR', 'BR', 'LR'].includes(rarity) && detail.awakeBeforeUrl) {
    detail.awakeAfterUrl = detail.awakeBeforeUrl;
  }

  // テーブル解析
  $('table').each((_i, table) => {
    const rows = $(table).find('tr');
    const headerTexts = rows
      .first()
      .find('th, td')
      .map((_j, el) => $(el).text().trim())
      .get();

    // 基本情報テーブル
    if (headerTexts.includes('レアリティ') && headerTexts.includes('限定/恒常')) {
      const dataCells = $(rows[1]).find('td');
      if (dataCells.length >= 4) {
        detail.favoriteMode = $(dataCells[3]).text().trim();
      }
    }

    // 入手手段
    if (headerTexts.includes('入手手段')) {
      detail.acquisitionMethod = $(rows[1]).find('td').first().text().trim();
    }

    // ステータス（最右列 = 最大レベル）
    if (headerTexts.includes('ステータス')) {
      rows.each((_rowIdx, row) => {
        const cells = $(row).find('td, th');
        if (cells.length <= 1) return;
        const statName = $(cells[0]).text().trim();
        const maxVal = $(cells[cells.length - 1]).text().trim();
        if (statName === 'スマイル') detail.stats.smile = maxVal;
        else if (statName === 'ピュア') detail.stats.pure = maxVal;
        else if (statName === 'クール') detail.stats.cool = maxVal;
        else if (statName === 'メンタル') detail.stats.mental = maxVal;
      });
    }
  });

  // スクステセクション（スペシャルアピール・スキル・特性）
  let scsteSection: cheerio.Cheerio<Element> | null = null;
  $('h3').each((_i, el) => {
    if ($(el).text().trim() === 'スクステ') {
      scsteSection = $(el);
    }
  });

  if (scsteSection) {
    let skillIndex = 0;
    let el = (scsteSection as cheerio.Cheerio<Element>).next();

    while (el.length > 0 && !el.is('h2') && !el.is('h3')) {
      if (el.is('h4')) {
        const text = el.text().trim();

        if (text.includes('スペシャルアピール')) {
          detail.specialAppeal.name = text.replace(/スペシャルアピール[：:]\s*/, '').trim();
          extractAccessoriesToArray($, el, detail.accessories, 'special_appeal');
        } else if (text.includes('スキル') && !text.includes('スペシャル')) {
          detail.skill.name = text.replace(/スキル[：:]\s*/, '').trim();
          extractAccessoriesToArray($, el, detail.accessories, 'skill');
        } else if (text.includes('特性:') || text.includes('特性：')) {
          detail.trait.name = text.replace(/特性[：:]\s*/, '').trim();
          const nextEl = el.next();
          if (nextEl.is('ul')) {
            const li = nextEl.find('li').first();
            if (li.length) {
              const cloned = li.clone();
              cloned.find('div').remove();
              detail.trait.effect = cloned.text().trim();
            }
            extractAccessoriesToArray($, nextEl, detail.accessories, 'trait');
          }
        }
      }

      // AP・効果テーブル
      if (el.is('div')) {
        el.find('table').each((_tableIdx, table) => {
          const { ap, effect } = extractApEffect($, table);
          if (effect && !effect.includes('○○○') && effect !== '効果') {
            if (skillIndex === 0) {
              detail.specialAppeal.ap = ap;
              detail.specialAppeal.effect = effect;
            } else if (skillIndex === 1) {
              detail.skill.ap = ap;
              detail.skill.effect = effect;
            }
            skillIndex++;
          }
        });
      }

      el = el.next();
    }
  }

  return detail;
}

function extractApEffect(
  $: cheerio.CheerioAPI,
  table: Element
): { ap: string; effect: string } {
  let ap = '';
  let effect = '';

  $(table)
    .find('tr')
    .each((_i, row) => {
      const cells = $(row).find('th, td');
      const label = $(cells[0]).text().trim();
      const value = $(cells[1])?.text().trim() ?? '';
      if (label === 'AP') ap = value;
      else if (label === '効果') effect = value;
    });

  return { ap, effect };
}

function extractAccessoriesToArray(
  $: cheerio.CheerioAPI,
  startEl: cheerio.Cheerio<Element>,
  accessories: ScrapedAccessory[],
  parentType: 'special_appeal' | 'skill' | 'trait'
): void {
  let el = startEl.next();
  if (el.is('ul')) el = el.next();

  while (el.length > 0 && !el.is('h2') && !el.is('h3') && !el.is('h4')) {
    if (el.is('p')) {
      const pText = el.text().trim();
      if (pText.includes('カード')) {
        const div = el.next();
        if (div.is('div')) {
          let accAp = '';
          let accEffect = '';

          div.find('table').each((_i, table) => {
            const { ap, effect } = extractApEffect($, table);
            if (effect) {
              accAp = ap;
              accEffect = effect;
            }
          });

          let traitName = '';
          let traitEffect = '';
          let afterDiv = div.next();
          while (afterDiv.length > 0 && !afterDiv.is('h2') && !afterDiv.is('h3') && !afterDiv.is('h4') && !afterDiv.is('p')) {
            if (afterDiv.is('ul')) {
              afterDiv.find('li').each((_i, li) => {
                const liText = $(li).text().trim();
                if (liText.includes('特性：') || liText.includes('特性:')) {
                  const match = liText.match(/特性[：:]\s*(.+)/);
                  if (match) {
                    const firstLine = match[1].trim();
                    const end = firstLine.search(/[\n。]/);
                    traitName = end > 0 ? firstLine.substring(0, end) : firstLine;
                    const cloned = $(li).clone();
                    cloned.find('div').remove();
                    const full = cloned.text().trim();
                    traitEffect = full.substring(full.indexOf(traitName) + traitName.length).trim();
                  }
                }
              });
            }
            afterDiv = afterDiv.next();
          }

          if (accEffect) {
            accessories.push({
              parentType,
              name: pText,
              ap: accAp,
              effect: accEffect,
              traitName,
              traitEffect,
            });
          }

          el = div.next();
          continue;
        }
      }
    }
    el = el.next();
  }
}
