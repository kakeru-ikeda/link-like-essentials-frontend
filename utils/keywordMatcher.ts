/**
 * キーワードマッチングユーティリティ
 *
 * バックスラッシュを含むキーワードは正規表現として解釈し、
 * それ以外は単純な部分文字列マッチを行う。
 */

/**
 * テキストが単一のキーワードにマッチするか判定する
 * @param text 検索対象テキスト
 * @param keyword キーワード（バックスラッシュを含む場合は正規表現として解釈）
 * @returns マッチする場合 true
 */
export function matchesKeyword(text: string, keyword: string): boolean {
  if (keyword.includes('\\')) {
    try {
      const regex = new RegExp(keyword);
      return regex.test(text);
    } catch {
      return text.includes(keyword);
    }
  }
  return text.includes(keyword);
}

/**
 * テキストがキーワード配列のいずれかにマッチするか判定する
 * @param text 検索対象テキスト
 * @param keywords キーワードの配列
 * @returns いずれかのキーワードにマッチする場合 true
 */
export function matchesKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => matchesKeyword(text, keyword));
}
