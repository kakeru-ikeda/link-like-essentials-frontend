/**
 * wikiGradeChallenge スクレイパーのテスト
 *
 * スクレイプ結果が Sanity gradeChallenge スキーマに適合する形に整形されることを検証する。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as httpClient from '../../lib/httpClient';

vi.mock('../../lib/httpClient', () => ({
  fetchWithRetry: vi.fn(),
  fetchHtml: vi.fn(),
}));

const { scrapeGradeChallengeAll } = await import('../wikiGradeChallenge');

// ---------- フィクスチャ ----------

/** 一覧ページ（詳細URLなし版：詳細スクレイプを発生させない） */
const GC_LIST_HTML_NO_DETAIL = `
<html><body>
<h3>ステージ詳細</h3>
<ul>
  <li>104期 1st Term
    <ul>
      <li><a href="/llll_wiki/GC-2025-01">2025年1月</a> 2025/01/01～2025/01/31</li>
      <li><a href="/llll_wiki/GC-2025-02">2025年2月</a> 2025/02/01～2025/02/28</li>
    </ul>
  </li>
  <li>105期 1st Term
    <ul>
      <li><a href="/llll_wiki/GC-2025-03">2025年3月</a> 2025/03/01～2025/03/31</li>
    </ul>
  </li>
</ul>
</body></html>
`;

/** 詳細ページフィクスチャ */
const GC_DETAIL_HTML = `
<html><body>
<h2>ステージ詳細</h2>
<h3>ステージA</h3>
<table>
  <tr><td>特殊効果</td><td>スマイルスコアが1.5倍</td></tr>
  <tr><td>課題曲</td><td><a href="/llll_wiki/%E6%9B%B2A">曲A</a></td></tr>
  <tr><td>セクション1</td><td>スコアアップ</td></tr>
  <tr><td>セクション2</td><td>APゲイン増加</td></tr>
</table>
<h3>ステージB</h3>
<table>
  <tr><td>特殊効果</td><td>クールスコアが1.3倍</td></tr>
  <tr><td>課題曲</td><td><a href="/llll_wiki/%E6%9B%B2B">曲B</a></td></tr>
  <tr><td>フィーバー</td><td>フィーバー中スコア10倍</td></tr>
</table>
</body></html>
`;

describe('scrapeGradeChallengeAll()', () => {
  describe('一覧パース（詳細スクレイプなし）', () => {
    beforeEach(() => {
      vi.mocked(httpClient.fetchWithRetry).mockResolvedValue(GC_LIST_HTML_NO_DETAIL);
    });

    it('GCエントリを正しい件数でパースする', async () => {
      // 全て公開済みとしてスキップ（詳細スクレイプ不要）
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02', 'gc-2025-03']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      // detailUrlなしのエントリ含め3件
      expect(challenges.length).toBeGreaterThanOrEqual(2);
    });

    it('challengeId が "gc-YYYY-MM" 形式', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02', 'gc-2025-03']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const jan = challenges.find((c) => c.title === '2025年1月');
      expect(jan?.challengeId).toBe('gc-2025-01');
    });

    it('startDate がISO形式', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02', 'gc-2025-03']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const jan = challenges.find((c) => c.title === '2025年1月');
      expect(jan?.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('termName がパースされる', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02', 'gc-2025-03']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const jan = challenges.find((c) => c.title === '2025年1月');
      expect(jan?.termName).toBeDefined();
      expect(jan?.termName).toContain('104期');
    });

    it('公開済みエントリの stages が undefined（詳細スクレイプなし）', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02', 'gc-2025-03']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const jan = challenges.find((c) => c.title === '2025年1月');
      expect(jan?.stages).toBeUndefined();
    });
  });

  describe('詳細スクレイプ（新規エントリのみ）', () => {
    beforeEach(() => {
      // 1回目(一覧)→GC_LIST_HTML_NO_DETAIL、2回目以降(詳細)→GC_DETAIL_HTML
      vi.mocked(httpClient.fetchWithRetry)
        .mockResolvedValueOnce(GC_LIST_HTML_NO_DETAIL)
        .mockResolvedValue(GC_DETAIL_HTML);
    });

    it('新規エントリの stages がパースされる', async () => {
      // gc-2025-03 だけ新規（existingIds に含めない）
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const mar = challenges.find((c) => c.title === '2025年3月');
      expect(mar?.stages).toBeDefined();
      expect(mar?.stages).toHaveLength(2);
    });

    it('ステージAの specialEffect が正しい', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const mar = challenges.find((c) => c.title === '2025年3月');
      const stageA = mar?.stages?.find((s) => s.stageName === 'A');
      expect(stageA?.specialEffect).toBe('スマイルスコアが1.5倍');
    });

    it('ステージAの songUrl が絶対URL', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const mar = challenges.find((c) => c.title === '2025年3月');
      const stageA = mar?.stages?.find((s) => s.stageName === 'A');
      expect(stageA?.songUrl).toMatch(/^https:\/\/wikiwiki\.jp\//);
    });

    it('ステージAの sectionEffects が正しい件数', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const mar = challenges.find((c) => c.title === '2025年3月');
      const stageA = mar?.stages?.find((s) => s.stageName === 'A');
      expect(stageA?.sectionEffects).toHaveLength(2);
    });

    it('sectionEffects の sectionOrder が連番（1始まり）', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const mar = challenges.find((c) => c.title === '2025年3月');
      const stageA = mar?.stages?.find((s) => s.stageName === 'A');
      const orders = stageA?.sectionEffects.map((e) => e.sectionOrder) ?? [];
      expect(orders).toEqual([1, 2]);
    });

    it('ステージBの フィーバー効果がパースされる', async () => {
      const existingIds = new Set(['gc-2025-01', 'gc-2025-02']);
      const challenges = await scrapeGradeChallengeAll(existingIds);
      const mar = challenges.find((c) => c.title === '2025年3月');
      const stageB = mar?.stages?.find((s) => s.stageName === 'B');
      const fever = stageB?.sectionEffects.find((e) =>
        e.sectionName.includes('フィーバー')
      );
      expect(fever?.effect).toBe('フィーバー中スコア10倍');
    });
  });
});
