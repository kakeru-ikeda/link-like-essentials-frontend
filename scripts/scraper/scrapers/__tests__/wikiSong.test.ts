/**
 * wikiSong スクレイパーのテスト
 *
 * スクレイプ結果が Sanity song スキーマに適合する形に整形されることを検証する。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as httpClient from '../../lib/httpClient';

vi.mock('../../lib/httpClient', () => ({
  fetchWithRetry: vi.fn(),
  fetchHtml: vi.fn(),
}));

const { scrapeSongList, scrapeSongDetail } = await import('../wikiSong');

// ---------- フィクスチャ ----------

const SONG_LIST_HTML = `
<html><body>
<table>
  <tr>
    <th>区分</th><th>楽曲名</th><th>属性</th><th>センター</th><th>歌唱</th>
  </tr>
  <tr>
    <td>103期</td>
    <td><a href="/llll_wiki/%E6%9B%B2A">曲A</a></td>
    <td>スマイル</td>
    <td>花帆</td>
    <td>スリーズブーケ</td>
  </tr>
  <tr>
    <td>104期</td>
    <td><a href="/llll_wiki/%E6%9B%B2B">曲B</a></td>
    <td>クール</td>
    <td>さやか</td>
    <td>DOLLCHESTRA</td>
  </tr>
  <tr>
    <td>105期</td>
    <td><a href="/llll_wiki/%E6%9B%B2C">曲C</a></td>
    <td>ピュア</td>
    <td>セラス</td>
    <td>Edel Note</td>
  </tr>
</table>
</body></html>
`;

const SONG_DETAIL_HTML = `
<html><body>
<img src="https://example.com/jacket.webp" />
<h2>ライブアナライザー</h2>
<img src="https://example.com/live-analyzer.webp" />
</body></html>
`;

describe('scrapeSongList()', () => {
  beforeEach(() => {
    vi.mocked(httpClient.fetchWithRetry).mockResolvedValue(SONG_LIST_HTML);
  });

  it('楽曲一覧を正しい件数でパースする', async () => {
    const songs = await scrapeSongList();
    expect(songs).toHaveLength(3);
  });

  describe('1件目（103期スリーズブーケ）', () => {
    it('songId は href から生成される', async () => {
      const [song] = await scrapeSongList();
      expect(song.songId).toBe('%E6%9B%B2A');
    });

    it('songName が正しい', async () => {
      const [song] = await scrapeSongList();
      expect(song.songName).toBe('曲A');
    });

    it('category が正しい', async () => {
      const [song] = await scrapeSongList();
      expect(song.category).toBe('103期');
    });

    it('attribute が正しい（スマイル）', async () => {
      const [song] = await scrapeSongList();
      expect(song.attribute).toBe('スマイル');
    });

    it('centerCharacter がフルネームに正規化される（花帆→日野下花帆）', async () => {
      const [song] = await scrapeSongList();
      expect(song.centerCharacter).toBe('日野下花帆');
    });

    it('singers がスリーズブーケのまま保持される', async () => {
      const [song] = await scrapeSongList();
      expect(song.singers).toBe('スリーズブーケ');
    });

    it('participations で103期スリーズブーケのメンバーが解決される', async () => {
      const [song] = await scrapeSongList();
      // 103期スリーズブーケ = 花帆+梢
      expect(song.participations).toBe('日野下花帆,乙宗梢');
    });

    it('songUrl が絶対URL', async () => {
      const [song] = await scrapeSongList();
      expect(song.songUrl).toMatch(/^https:\/\/wikiwiki\.jp\//);
    });
  });

  describe('2件目（104期DOLLCHESTRA）', () => {
    it('participations で104期DOLLCHESTRAのメンバーが解決される', async () => {
      const songs = await scrapeSongList();
      // 104期DOLLCHESTRA = さやか+綴理+小鈴
      expect(songs[1].participations).toBe('村野さやか,夕霧綴理,徒町小鈴');
    });
  });

  describe('3件目（105期Edel Note）', () => {
    it('centerCharacter セラスはそのまま（マップ済み）', async () => {
      const songs = await scrapeSongList();
      expect(songs[2].centerCharacter).toBe('セラス');
    });

    it('participations で105期Edel Noteのメンバーが解決される', async () => {
      const songs = await scrapeSongList();
      expect(songs[2].participations).toBe('桂城泉,セラス');
    });
  });

  it('ヘッダー行はスキップされる', async () => {
    const songs = await scrapeSongList();
    expect(songs.every((s) => s.songName !== '楽曲名')).toBe(true);
  });
});

describe('scrapeSongDetail()', () => {
  beforeEach(() => {
    vi.mocked(httpClient.fetchWithRetry).mockResolvedValue(SONG_DETAIL_HTML);
  });

  it('jacketImageUrl を取得する', async () => {
    const detail = await scrapeSongDetail('https://wikiwiki.jp/llll_wiki/test');
    expect(detail.jacketImageUrl).toBe('https://example.com/jacket.webp');
  });

  it('liveAnalyzerImageUrl を取得する', async () => {
    const detail = await scrapeSongDetail('https://wikiwiki.jp/llll_wiki/test');
    expect(detail.liveAnalyzerImageUrl).toBe('https://example.com/live-analyzer.webp');
  });
});
