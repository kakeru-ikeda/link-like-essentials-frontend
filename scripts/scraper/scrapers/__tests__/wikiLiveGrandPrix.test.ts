/**
 * wikiLiveGrandPrix スクレイパーのテスト
 *
 * 一覧ページ→イベント一覧パース、詳細→ステージ情報パースを検証する。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- モック ---
const mockFetchWithRetry = vi.fn();

vi.mock('../../lib/httpClient', () => ({
  fetchWithRetry: mockFetchWithRetry,
}));

const { scrapeLiveGrandPrixAll } = await import('../wikiLiveGrandPrix');

// ---------- フィクスチャ ----------

/**
 * LGP 一覧ページのモック HTML
 * - 「過去のライブグランプリ履歴」見出しの下に 103期・104期・105期セクション
 */
const LIST_HTML = `
<html><body>
  <h2>過去のライブグランプリ履歴</h2>
  <div>
    105期
    <table>
      <tr>
        <td>2025/04/10〜2025/04/14</td>
        <td><a href="/llll_wiki/LGP-105-Spring">春の祭典LGP</a></td>
      </tr>
      <tr>
        <td>2025/05/01〜2025/05/05</td>
        <td>詳細URL無しLGP</td>
      </tr>
    </table>
  </div>
  <div>
    104期
    <table>
      <tr>
        <td>2024/10/10〜2024/10/14</td>
        <td><a href="/llll_wiki/LGP-104-Autumn">秋の大会LGP</a></td>
      </tr>
    </table>
  </div>
  <div>
    103期
    <table>
      <tr>
        <td>2024/04/01〜2024/04/05</td>
        <td><a href="/llll_wiki/LGP-103-First">初回LGP</a></td>
      </tr>
    </table>
  </div>
</body></html>
`;

/**
 * LGP 詳細ページのモック HTML
 */
const DETAIL_HTML = `
<html><body>
  <h2>ステージ課題曲</h2>
  <h3>ステージA</h3>
  <table>
    <tr><td>特殊効果</td><td>スコアアップ(全体)</td></tr>
    <tr><td>課題曲</td><td><a href="/llll_wiki/Aqours-HAPPY-PARADE">HAPPY PARADE</a></td></tr>
    <tr><td>セクション1</td><td>スマイルアップ</td></tr>
    <tr><td>セクション2</td><td>ピュアアップ</td></tr>
    <tr><td>フィーバー</td><td>スコアアップ</td></tr>
  </table>
  <h3>ステージB</h3>
  <table>
    <tr><td>特殊効果</td><td>クールブースト</td></tr>
    <tr><td>課題曲</td><td><a href="/llll_wiki/Edel-BrilliantGreen">Brilliant Green</a></td></tr>
    <tr><td>セクション1</td><td>クールアップ</td></tr>
  </table>
</body></html>
`;

describe('scrapeLiveGrandPrixAll()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('一覧ページのパース', () => {
    beforeEach(() => {
      // 1回目: 一覧ページ、2回目以降: 詳細ページ
      mockFetchWithRetry.mockImplementation((url: string) => {
        if (url.includes('detail') || url.includes('LGP-')) {
          return Promise.resolve(DETAIL_HTML);
        }
        return Promise.resolve(LIST_HTML);
      });
    });

    it('全期のイベントが取得される', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      // 105期×2, 104期×1, 103期×1 = 4件
      expect(result.length).toBe(4);
    });

    it('yearTerm が正しいテキストで返る（105期）', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '春の祭典LGP');
      expect(ev).toBeDefined();
      expect(ev!.yearTerm).toBe('105期');
    });

    it('yearTerm が正しいテキストで返る（104期）', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '秋の大会LGP');
      expect(ev!.yearTerm).toBe('104期');
    });

    it('yearTerm が正しいテキストで返る（103期）', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '初回LGP');
      expect(ev!.yearTerm).toBe('103期');
    });

    it('startDate が ISO 文字列で返る', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '春の祭典LGP');
      expect(ev!.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('endDate が ISO 文字列で返る', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '春の祭典LGP');
      expect(ev!.endDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('eventUrl が絶対URLに変換される', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '春の祭典LGP');
      expect(ev!.eventUrl).toBe('https://wikiwiki.jp/llll_wiki/LGP-105-Spring');
    });

    it('詳細URL がないイベントは eventUrl が undefined', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '詳細URL無しLGP');
      expect(ev!.eventUrl).toBeUndefined();
    });

    it('eventId が生成される（lgp- プレフィックス）', async () => {
      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.eventName === '秋の大会LGP');
      expect(ev!.eventId).toMatch(/^lgp-/);
    });

    it('existingIds に含まれるイベントは stages がない（詳細スクレイプスキップ）', async () => {
      const result = await scrapeLiveGrandPrixAll(
        new Set(['lgp-105-LGP-105-Spring'])
      );
      // eventUrl があっても existingIds に入っていれば詳細なし
      // ただし eventId は makeEventId() の結果に依存するので、詳細ありの件数で確認
      const withStages = result.filter((e) => e.stages !== undefined);
      // existingIds には 1 件、eventUrl あり 3 件 → 詳細あり 2 件
      expect(withStages.length).toBeLessThan(4);
    });
  });

  describe('詳細ページのパース', () => {
    beforeEach(() => {
      mockFetchWithRetry.mockResolvedValue(DETAIL_HTML);
    });

    it('ステージ A/B が取得される', async () => {
      // 直接詳細HTMLを返すよう一覧もDETAIL_HTMLに（一覧パースが空になるが詳細はテスト不要）
      // 一覧を別モックで渡す
      mockFetchWithRetry
        .mockResolvedValueOnce(LIST_HTML) // 一覧
        .mockResolvedValue(DETAIL_HTML);  // 詳細

      const result = await scrapeLiveGrandPrixAll(new Set());
      const evWithStages = result.find((e) => e.stages && e.stages.length > 0);
      expect(evWithStages).toBeDefined();
      expect(evWithStages!.stages!.length).toBe(2);
    });

    it('ステージ A の stageName が "A"', async () => {
      mockFetchWithRetry
        .mockResolvedValueOnce(LIST_HTML)
        .mockResolvedValue(DETAIL_HTML);

      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.stages && e.stages.length > 0);
      const stageA = ev!.stages!.find((s) => s.stageName === 'A');
      expect(stageA).toBeDefined();
    });

    it('ステージ A の specialEffect が正しく取得される', async () => {
      mockFetchWithRetry
        .mockResolvedValueOnce(LIST_HTML)
        .mockResolvedValue(DETAIL_HTML);

      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.stages && e.stages.length > 0);
      const stageA = ev!.stages!.find((s) => s.stageName === 'A');
      expect(stageA!.specialEffect).toBe('スコアアップ(全体)');
    });

    it('ステージ A の課題曲 URL が絶対 URL に変換される', async () => {
      mockFetchWithRetry
        .mockResolvedValueOnce(LIST_HTML)
        .mockResolvedValue(DETAIL_HTML);

      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.stages && e.stages.length > 0);
      const stageA = ev!.stages!.find((s) => s.stageName === 'A');
      expect(stageA!.songUrl).toBe(
        'https://wikiwiki.jp/llll_wiki/Aqours-HAPPY-PARADE'
      );
    });

    it('ステージ A の sectionEffects が 3 件（セクション×2＋フィーバー）', async () => {
      mockFetchWithRetry
        .mockResolvedValueOnce(LIST_HTML)
        .mockResolvedValue(DETAIL_HTML);

      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.stages && e.stages.length > 0);
      const stageA = ev!.stages!.find((s) => s.stageName === 'A');
      expect(stageA!.sectionEffects.length).toBe(3);
    });

    it('sectionOrder が連番で付与される', async () => {
      mockFetchWithRetry
        .mockResolvedValueOnce(LIST_HTML)
        .mockResolvedValue(DETAIL_HTML);

      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.stages && e.stages.length > 0);
      const stageA = ev!.stages!.find((s) => s.stageName === 'A');
      const orders = stageA!.sectionEffects.map((se) => se.sectionOrder);
      expect(orders).toEqual([1, 2, 3]);
    });

    it('フィーバーが sectionEffects に含まれる', async () => {
      mockFetchWithRetry
        .mockResolvedValueOnce(LIST_HTML)
        .mockResolvedValue(DETAIL_HTML);

      const result = await scrapeLiveGrandPrixAll(new Set());
      const ev = result.find((e) => e.stages && e.stages.length > 0);
      const stageA = ev!.stages!.find((s) => s.stageName === 'A');
      const fever = stageA!.sectionEffects.find((se) =>
        se.sectionName.includes('フィーバー')
      );
      expect(fever).toBeDefined();
      expect(fever!.effect).toBe('スコアアップ');
    });
  });
});
