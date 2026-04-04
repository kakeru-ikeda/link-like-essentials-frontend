/**
 * wikiCard スクレイパーのテスト
 *
 * 実際のHTTPリクエストは行わず、WikiのHTML構造を模したフィクスチャを用いて
 * スクレイプ結果が Sanity cardスキーマに適合する形に整形されることを検証する。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as httpClient from '../../lib/httpClient';

// fetchWithRetry をモック
vi.mock('../../lib/httpClient', () => ({
  fetchWithRetry: vi.fn(),
  fetchHtml: vi.fn(),
}));

// モック後にインポート
const { scrapeCardList } = await import('../wikiCard');

// ---------- フィクスチャ ----------

const CARD_LIST_HTML = `
<html><body>
<table>
  <tr>
    <th>レアリティ</th><th>恒常/限定</th><th>カード名</th>
    <th>キャラクター</th><th>スタイルタイプ</th><th>属性</th>
    <th>AP</th><th>リリース日</th>
  </tr>
  <tr>
    <td>UR</td>
    <td>恒常</td>
    <td><a href="/llll_wiki/%E8%8A%B1%E5%B8%86%2FUR01">花帆UR01</a></td>
    <td>日野下花帆</td>
    <td>チアリーダー</td>
    <td>スマイル</td>
    <td>10</td>
    <td>2024/04/01</td>
  </tr>
  <tr>
    <td>SR</td>
    <td>限定</td>
    <td><a href="/llll_wiki/%E3%81%95%E3%82%84%E3%81%8B%2FSR01">さやかSR01</a></td>
    <td>村野さやか</td>
    <td>トリックスター</td>
    <td>クール</td>
    <td>8</td>
    <td>2024/05/01</td>
  </tr>
  <tr>
    <td>R</td>
    <td>恒常</td>
    <td><a href="/llll_wiki/%E7%91%A0%E7%92%83%E4%B9%83%2FR01">瑠璃乃R01</a></td>
    <td>大沢瑠璃乃</td>
    <td>パフォーマー</td>
    <td>ピュア</td>
    <td>6</td>
    <td></td>
  </tr>
</table>
</body></html>
`;

describe('scrapeCardList()', () => {
  beforeEach(() => {
    vi.mocked(httpClient.fetchWithRetry).mockResolvedValue(CARD_LIST_HTML);
  });

  it('カード一覧を正しくパースする', async () => {
    const cards = await scrapeCardList();
    expect(cards).toHaveLength(3);
  });

  describe('ScrapedCard の各フィールド（1件目）', () => {
    it('cardId は href から生成される（URLデコード後に特殊文字を_置換）', async () => {
      const [card] = await scrapeCardList();
      // href: /llll_wiki/%E8%8A%B1%E5%B8%86%2FUR01
      // → decodeURIComponent → /llll_wiki/花帆/UR01
      // → /llll_wiki/ 除去 → 花帆/UR01
      // → / を - に → 花帆-UR01
      // → [^\w\-] を _ に → __-UR01
      expect(card.cardId).toBe('__-UR01');
    });

    it('cardName が正しい', async () => {
      const [card] = await scrapeCardList();
      expect(card.cardName).toBe('花帆UR01');
    });

    it('characterName が正しい', async () => {
      const [card] = await scrapeCardList();
      expect(card.characterName).toBe('日野下花帆');
    });

    it('rarity が正しい（Sanity enum値と一致するrawテキスト）', async () => {
      const [card] = await scrapeCardList();
      expect(card.rarity).toBe('UR');
    });

    it('limited が正しい', async () => {
      const [card] = await scrapeCardList();
      expect(card.limited).toBe('恒常');
    });

    it('styleType が正しい', async () => {
      const [card] = await scrapeCardList();
      expect(card.styleType).toBe('チアリーダー');
    });

    it('releaseDate が YYYY-MM-DD 形式', async () => {
      const [card] = await scrapeCardList();
      expect(card.releaseDate).toBe('2024-04-01');
    });

    it('cardUrl が絶対URL', async () => {
      const [card] = await scrapeCardList();
      expect(card.cardUrl).toMatch(/^https:\/\/wikiwiki\.jp\//);
    });
  });

  it('releaseDate がない場合 undefined', async () => {
    const cards = await scrapeCardList();
    const last = cards[2];
    expect(last.releaseDate).toBeUndefined();
  });

  it('limited が「限定」の場合も正しくパース', async () => {
    const cards = await scrapeCardList();
    expect(cards[1].limited).toBe('限定');
  });

  it('ヘッダー行はスキップされる', async () => {
    const cards = await scrapeCardList();
    expect(cards.every((c) => c.cardName !== 'カード名')).toBe(true);
  });
});
