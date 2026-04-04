import { request } from 'undici';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Charset': 'utf-8',
};

/** レート制限を避けるためのディレイ（ms） */
const REQUEST_DELAY_MS = 100;

/**
 * HTML ページを取得する（undici ベース）
 * 全スクレイパー共通のフェッチ処理
 */
export async function fetchHtml(url: string): Promise<string> {
  const { statusCode, body } = await request(url, {
    headers: DEFAULT_HEADERS,
  });

  if (statusCode !== 200) {
    throw new Error(`HTTP ${statusCode}: ${url}`);
  }

  const text = await body.text();
  await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
  return text;
}

/**
 * 429 を含む一時エラーに対してリトライするフェッチ
 */
export async function fetchWithRetry(
  url: string,
  maxRetries = 5,
  baseDelayMs = 2000
): Promise<string> {
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { statusCode, body } = await request(url, {
        headers: DEFAULT_HEADERS,
      });

      if (statusCode === 429) {
        const delay = baseDelayMs * attempt;
        console.warn(`  ⚠ 429 Too Many Requests. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (statusCode !== 200) {
        throw new Error(`HTTP ${statusCode}: ${url}`);
      }

      const text = await body.text();
      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        const delay = baseDelayMs * attempt;
        console.warn(`  ⚠ Attempt ${attempt} failed: ${lastError.message}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
