import type { Metadata } from 'next';

const SITE_TITLE_SUFFIX = 'Link! Like! デッキビルダー';
const DEFAULT_DESCRIPTION = 'スクステのカードデッキビルダー';
const DEFAULT_OG_IMAGE = '/images/og-image.png';
const DESCRIPTION_SUFFIX = ' | Link! Like! ラブライブ!（リンクラ）のスクールアイドルステージに特化した、デッキ構築・公開デッキ閲覧・カード検索ツール。Webブラウザ上で簡単にデッキを作成・管理できます。スクステのデッキ構築ならリンクラデッキビルダーにお任せ！';

interface PageMetadataOptions {
  title?: string;
  description?: string;
  ogImagePath?: string;
  skipTitleSuffix?: boolean;
  skipDescriptionSuffix?: boolean;
}

export const metadataDefaults = {
  siteTitleSuffix: SITE_TITLE_SUFFIX,
  defaultDescription: DEFAULT_DESCRIPTION,
  defaultOgImage: DEFAULT_OG_IMAGE,
};

/**
 * ページメタデータを構築するヘルパー関数。
 * タイトル、説明、OG画像などを一括で設定可能。
 * @param options ページメタデータのオプション
 * @returns 構築されたメタデータオブジェクト
 */
export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImagePath = DEFAULT_OG_IMAGE,
  skipTitleSuffix = false,
  skipDescriptionSuffix = false,
}: PageMetadataOptions = {}): Metadata {
  const resolvedDescription = skipDescriptionSuffix
    ? description
    : appendDescriptionSuffix(description);
  const resolvedTitle = buildPageTitle(title, skipTitleSuffix);
  const images = ogImagePath ? [{ url: ogImagePath }] : undefined;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images,
    },
  };
}

/**
 * ページタイトルを構築するヘルパー関数。
 * 
 * @param title 
 * @param skipTitleSuffix 
 * @returns 
 */
export function buildPageTitle(title?: string, skipTitleSuffix: boolean = false): string {
  if (!title) return SITE_TITLE_SUFFIX;
  return skipTitleSuffix ? title : `${title} - ${SITE_TITLE_SUFFIX}`;
}

interface ClientMetadataParams {
  title?: string;
  description?: string;
  ogImagePath?: string | null | undefined;
  skipDescriptionSuffix?: boolean;
  skipTitleSuffix?: boolean;
}

/**
 * クライアント側でメタデータを同期するためのヘルパー。
 * SSRでトークンが必要なリソースを取れない場合のフォールバック用途。
 */
export function syncClientMetadata({
  title,
  description,
  ogImagePath,
  skipDescriptionSuffix = false,
  skipTitleSuffix = false,
}: ClientMetadataParams) {
  if (typeof document === 'undefined') return;

  const resolvedTitle = title ? buildPageTitle(title, skipTitleSuffix) : undefined;
  const resolvedDescription = description
    ? skipDescriptionSuffix
      ? description
      : appendDescriptionSuffix(description)
    : undefined;

  if (resolvedTitle) {
    document.title = resolvedTitle;
  }

  if (resolvedDescription) {
    const descTag = document.querySelector('meta[name="description"]') ??
      createMetaTag('description', 'name');
    if (descTag) descTag.setAttribute('content', resolvedDescription);
  }

  const ogTags: Array<{ selector: string; content?: string | null | undefined }> = [
    { selector: 'meta[property="og:title"]', content: resolvedTitle },
    { selector: 'meta[property="og:description"]', content: resolvedDescription },
    { selector: 'meta[property="og:image"]', content: ogImagePath },
    { selector: 'meta[name="twitter:title"]', content: resolvedTitle },
    { selector: 'meta[name="twitter:description"]', content: resolvedDescription },
    { selector: 'meta[name="twitter:image"]', content: ogImagePath },
  ];

  ogTags.forEach(({ selector, content }) => {
    // null / undefined のみスキップし、空文字列は有効な値として扱う
    if (content == null) return;
    const tag = document.querySelector(selector) ?? createOpenGraphTag(selector);
    if (tag) tag.setAttribute('content', content);
  });
}

function createMetaTag(name: string, attr: 'name' | 'property'): HTMLMetaElement | null {
  const meta = document.createElement('meta');
  meta.setAttribute(attr, name);
  document.head.appendChild(meta);
  return meta;
}

function createOpenGraphTag(selector: string): HTMLMetaElement | null {
  const match = selector.match(/(property|name)="([^"]+)"/);
  if (!match) return null;
  const [, attr, value] = match;
  return createMetaTag(value, attr as 'name' | 'property');
}

function appendDescriptionSuffix(desc: string): string {
  if (desc == null) return DESCRIPTION_SUFFIX.trim();
  if (desc.includes(DESCRIPTION_SUFFIX.trim())) return desc;
  return `${desc}${DESCRIPTION_SUFFIX}`;
}
