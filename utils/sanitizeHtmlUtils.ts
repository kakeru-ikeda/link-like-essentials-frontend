import sanitizeHtml from 'sanitize-html';

/**
 * microCMSコンテンツ用のsanitizeHtml設定
 * 画像タグとスタイル属性を許可し、セキュアなHTML表示を実現
 */
export const MICROCMS_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'loading', 'style'],
  },
  allowedStyles: {
    '*': {
      width: [/^\d+(?:px|%|em|rem)?$/],
      height: [/^\d+(?:px|%|em|rem)?$/],
      'max-width': [/^\d+(?:px|%|em|rem)?$/],
      'max-height': [/^\d+(?:px|%|em|rem)?$/],
    },
  },
};

/**
 * microCMSコンテンツをサニタイズする
 * @param html - サニタイズするHTML文字列
 * @returns サニタイズされたHTML文字列
 */
export function sanitizeMicroCMSContent(html: string): string {
  return sanitizeHtml(html, MICROCMS_SANITIZE_OPTIONS);
}
