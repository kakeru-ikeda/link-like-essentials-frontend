/**
 * wikiCardDetail スクレイパーのテスト
 *
 * スクレイプ結果が Sanity card.detail / accessories フィールドに
 * 適合する形に整形されることを検証する。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as httpClient from '../../lib/httpClient';

vi.mock('../../lib/httpClient', () => ({
  fetchWithRetry: vi.fn(),
  fetchHtml: vi.fn(),
}));

const { scrapeCardDetail } = await import('../wikiCardDetail');

// ---------- フィクスチャ ----------

const CARD_DETAIL_HTML = `
<html><body>
<img src="https://example.com/awake-before.webp" />
<img src="https://example.com/awake-after.webp" />

<!-- 基本情報テーブル -->
<table>
  <tr><th>レアリティ</th><th>限定/恒常</th><th>キャラ</th><th>得意ムード</th></tr>
  <tr><td>UR</td><td>恒常</td><td>日野下花帆</td><td>ハッピー</td></tr>
</table>

<!-- 入手手段テーブル -->
<table>
  <tr><th>入手手段</th></tr>
  <tr><td>スカウト</td></tr>
</table>

<!-- ステータステーブル -->
<table>
  <tr><th>ステータス</th><th>Lv1</th><th>Lv最大</th></tr>
  <tr><td>スマイル</td><td>100</td><td>5000</td></tr>
  <tr><td>ピュア</td><td>80</td><td>4000</td></tr>
  <tr><td>クール</td><td>60</td><td>3000</td></tr>
  <tr><td>メンタル</td><td>50</td><td>2500</td></tr>
</table>

<!-- スクステセクション -->
<h3>スクステ</h3>
<h4>スペシャルアピール：テストスペシャル</h4>
<div>
  <table>
    <tr><th>Lv</th><th>消費AP</th><th>効果</th></tr>
    <tr><td>1</td><td>10</td><td>全体スコアを大アップ</td></tr>
    <tr><td>14</td><td>全体スコアを超大アップ</td></tr>
  </table>
</div>
<h4>スキル：テストスキル</h4>
<div>
  <table>
    <tr><th>Lv</th><th>消費AP</th><th>効果</th></tr>
    <tr><td>1</td><td>6</td><td>スマイルスコアをアップ</td></tr>
    <tr><td>14</td><td>スマイルスコアを大アップ</td></tr>
  </table>
</div>
<h4>特性：テスト特性</h4>
<ul>
  <li>特性の効果テキストが入ります。</li>
</ul>
</body></html>
`;

describe('scrapeCardDetail()', () => {
  beforeEach(() => {
    vi.mocked(httpClient.fetchWithRetry).mockResolvedValue(CARD_DETAIL_HTML);
  });

  it('awakeBeforeUrl を取得する', async () => {
    const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
    expect(detail.awakeBeforeUrl).toBe('https://example.com/awake-before.webp');
  });

  it('awakeAfterUrl を取得する', async () => {
    const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
    expect(detail.awakeAfterUrl).toBe('https://example.com/awake-after.webp');
  });

  describe('stats（Sanity stats フィールドに対応）', () => {
    it('smile は最大値の文字列', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.stats.smile).toBe('5000');
    });

    it('pure は最大値の文字列', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.stats.pure).toBe('4000');
    });

    it('cool は最大値の文字列', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.stats.cool).toBe('3000');
    });

    it('mental は最大値の文字列', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.stats.mental).toBe('2500');
    });
  });

  describe('specialAppeal（Sanity specialAppeal フィールドに対応）', () => {
    it('name がパースされる', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.specialAppeal.name).toBe('テストスペシャル');
    });

    it('ap が文字列で取得される', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.specialAppeal.ap).toBe('10');
    });

    it('effect がパースされる（Lv14、最高レベル）', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.specialAppeal.effect).toBe('全体スコアを超大アップ');
    });
  });

  describe('skill（Sanity skill フィールドに対応）', () => {
    it('name がパースされる', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.skill.name).toBe('テストスキル');
    });

    it('ap が文字列で取得される', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.skill.ap).toBe('6');
    });

    it('effect がパースされる（Lv14、最高レベル）', async () => {
      const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
      expect(detail.skill.effect).toBe('スマイルスコアを大アップ');
    });
  });

  it('favoriteMode がパースされる', async () => {
    const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
    expect(detail.favoriteMode).toBe('ハッピー');
  });

  it('acquisitionMethod がパースされる', async () => {
    const detail = await scrapeCardDetail('https://wikiwiki.jp/llll_wiki/test');
    expect(detail.acquisitionMethod).toBe('スカウト');
  });
});
