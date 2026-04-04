import { nanoid } from 'nanoid';

/**
 * microCMS news エンドポイントのレスポンス型。
 * REST API が返すフィールドに対応する。
 */
export interface MicrocmsNews {
  id: string;
  title: string;
  /** microCMS リッチテキスト（HTML 文字列） */
  body?: string;
  content?: string;
  thumbnail?: {
    url: string;
    width?: number;
    height?: number;
  };
  category?: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// Portable Text 型定義（Sanity スキーマに準拠）
// ─────────────────────────────────────────────

interface MarkDef {
  _key: string;
  _type: 'link';
  href: string;
}

interface Span {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style: string;
  markDefs: MarkDef[];
  children: Span[];
  listItem?: 'bullet' | 'number';
  level?: number;
}

interface PortableTextImage {
  _type: 'image';
  _key: string;
  _sanityAsset: string;
  alt?: string;
}

type PortableTextNode = PortableTextBlock | PortableTextImage;

/**
 * Sanity に投入する news ドキュメントの型。
 * スキーマ定義（repositories/sanity/schemas/news.ts）に準拠。
 */
export interface SanityNews {
  _id: string;
  _type: 'news';
  title: string;
  body: PortableTextNode[];
  thumbnail?: {
    asset: {
      _type: 'image';
      /** Sanity CLI dataset import が URL から画像を自動アップロードする特殊記法 */
      _sanityAsset: string;
    };
  };
  category?: {
    id: string;
    name: string;
  };
  publishedAt?: string;
}

// ─────────────────────────────────────────────
// HTML → Portable Text 変換
// ─────────────────────────────────────────────

/**
 * テキスト内の HTML エンティティをデコードする。
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * インライン HTML を解析して Span と MarkDef の配列に変換する。
 * <img> タグはブロックレベルで処理するためここでは扱わない。
 *
 * 対応タグ: <strong>, <b>, <em>, <i>, <a href="...">, <br>
 * 非対応タグ（<u>, <span> 等）はテキストのみ抽出する。
 */
function parseInline(html: string, markDefs: MarkDef[]): Span[] {
  const spans: Span[] = [];
  let remaining = html;

  while (remaining.length > 0) {
    // <br> → 改行
    const brMatch = remaining.match(/^<br\s*\/?>/i);
    if (brMatch) {
      spans.push({ _type: 'span', _key: nanoid(6), text: '\n', marks: [] });
      remaining = remaining.slice(brMatch[0].length);
      continue;
    }

    // <img> → ブロックレベルで処理するためスキップ
    const imgMatch = remaining.match(/^<img\s[^>]*\/?>/i);
    if (imgMatch) {
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // <a href="...">...</a>
    const anchorMatch = remaining.match(/^<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (anchorMatch) {
      const href = anchorMatch[1];
      const innerHtml = anchorMatch[2];
      const linkKey = nanoid(6);
      markDefs.push({ _key: linkKey, _type: 'link', href });
      const innerSpans = parseInline(innerHtml, markDefs);
      innerSpans.forEach((span) => {
        span.marks = [...span.marks, linkKey];
      });
      spans.push(...innerSpans);
      remaining = remaining.slice(anchorMatch[0].length);
      continue;
    }

    // <strong> / <b>
    const strongMatch = remaining.match(/^<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/i);
    if (strongMatch) {
      const innerSpans = parseInline(strongMatch[1], markDefs);
      innerSpans.forEach((span) => {
        if (!span.marks.includes('strong')) span.marks = [...span.marks, 'strong'];
      });
      spans.push(...innerSpans);
      remaining = remaining.slice(strongMatch[0].length);
      continue;
    }

    // <em> / <i>
    const emMatch = remaining.match(/^<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/i);
    if (emMatch) {
      const innerSpans = parseInline(emMatch[1], markDefs);
      innerSpans.forEach((span) => {
        if (!span.marks.includes('em')) span.marks = [...span.marks, 'em'];
      });
      spans.push(...innerSpans);
      remaining = remaining.slice(emMatch[0].length);
      continue;
    }

    // その他の HTML タグ（<u>, <span>, <code> 等）→ 内部テキストのみ再帰処理
    const genericTagMatch = remaining.match(/^<([a-zA-Z][a-zA-Z0-9]*)[^>]*>([\s\S]*?)<\/\1>/i);
    if (genericTagMatch) {
      spans.push(...parseInline(genericTagMatch[2], markDefs));
      remaining = remaining.slice(genericTagMatch[0].length);
      continue;
    }

    // 開始タグのみ（自己終了でないもの）をスキップ
    const openTagMatch = remaining.match(/^<[^>]+>/);
    if (openTagMatch) {
      remaining = remaining.slice(openTagMatch[0].length);
      continue;
    }

    // テキストノード（次のタグの手前まで）
    const textMatch = remaining.match(/^([^<]+)/);
    if (textMatch) {
      const text = decodeEntities(textMatch[1]);
      if (text) {
        spans.push({ _type: 'span', _key: nanoid(6), text, marks: [] });
      }
      remaining = remaining.slice(textMatch[0].length);
      continue;
    }

    // 想定外のケース: 1文字進める
    remaining = remaining.slice(1);
  }

  return spans;
}

/**
 * テキスト用のブロックを生成する。空テキストも許容（空行を保持するため）。
 */
function makeTextBlock(
  innerHtml: string,
  style: string,
  options: { listItem?: 'bullet' | 'number' } = {},
): PortableTextBlock {
  const markDefs: MarkDef[] = [];
  const childSpans = parseInline(innerHtml.trim(), markDefs);
  const children: Span[] =
    childSpans.length > 0
      ? childSpans
      : [{ _type: 'span', _key: nanoid(6), text: '', marks: [] }];

  const block: PortableTextBlock = {
    _type: 'block',
    _key: nanoid(8),
    style,
    markDefs,
    children,
  };
  if (options.listItem) {
    block.listItem = options.listItem;
    block.level = 1;
  }
  return block;
}

/**
 * <img> タグから PortableTextImage ブロックを生成する。
 * Sanity CLI dataset import が `_sanityAsset: 'image@<url>'` を認識して自動アップロードする。
 */
function makeImageBlock(imgTag: string): PortableTextImage | null {
  const srcMatch = imgTag.match(/src="([^"]*)"/i);
  if (!srcMatch || !srcMatch[1]) return null;

  const altMatch = imgTag.match(/alt="([^"]*)"/i);
  const block: PortableTextImage = {
    _type: 'image',
    _key: nanoid(8),
    _sanityAsset: `image@${srcMatch[1]}`,
  };
  if (altMatch && altMatch[1]) {
    block.alt = altMatch[1];
  }
  return block;
}

/**
 * HTML の断片（<img> を含む可能性がある）を
 * テキストブロックと画像ブロックの混合配列に変換する。
 *
 * 例: "テキスト<img src="...">続き" →
 *   [textBlock("テキスト"), imageBlock, textBlock("続き")]
 */
function parseBlockContent(innerHtml: string, style: string): PortableTextNode[] {
  const nodes: PortableTextNode[] = [];
  const imgPattern = /(<img\s[^>]*\/?>)/gi;
  const parts = innerHtml.split(imgPattern);

  for (const part of parts) {
    if (!part) continue;

    if (/^<img\s/i.test(part)) {
      const imgBlock = makeImageBlock(part);
      if (imgBlock) nodes.push(imgBlock);
    } else {
      const trimmed = part.trim();
      // テキスト内容がある、または空行を保持する場合のみ追加
      if (trimmed || parts.length === 1) {
        nodes.push(makeTextBlock(part, style));
      }
    }
  }

  // 何も生成されなかった場合は空のテキストブロックを返す
  if (nodes.length === 0) {
    nodes.push(makeTextBlock('', style));
  }

  return nodes;
}

/**
 * microCMS リッチテキスト（HTML 文字列）を Sanity Portable Text ノード配列に変換する。
 *
 * 対応ブロックタグ: h1〜h6, p, blockquote, ul>li, ol>li
 * <img> タグはブロックレベルの画像ノードに変換する（<p> 内でも分割して対応）。
 */
export function htmlToPortableText(html: string): PortableTextNode[] {
  if (!html) return [];

  const nodes: PortableTextNode[] = [];
  let remaining = html.trim().replace(/[\r\n]+/g, ' ');

  while (remaining.length > 0) {
    remaining = remaining.trimStart();
    if (!remaining) break;

    // <ul>...</ul>
    const ulMatch = remaining.match(/^<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (ulMatch) {
      const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liPattern.exec(ulMatch[1])) !== null) {
        nodes.push(makeTextBlock(liMatch[1], 'normal', { listItem: 'bullet' }));
      }
      remaining = remaining.slice(ulMatch[0].length);
      continue;
    }

    // <ol>...</ol>
    const olMatch = remaining.match(/^<ol[^>]*>([\s\S]*?)<\/ol>/i);
    if (olMatch) {
      const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liPattern.exec(olMatch[1])) !== null) {
        nodes.push(makeTextBlock(liMatch[1], 'normal', { listItem: 'number' }));
      }
      remaining = remaining.slice(olMatch[0].length);
      continue;
    }

    // <h1> ~ <h6>
    const headingMatch = remaining.match(/^<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/i);
    if (headingMatch) {
      nodes.push(...parseBlockContent(headingMatch[2], headingMatch[1].toLowerCase()));
      remaining = remaining.slice(headingMatch[0].length);
      continue;
    }

    // <blockquote>
    const bqMatch = remaining.match(/^<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
    if (bqMatch) {
      nodes.push(...parseBlockContent(bqMatch[1], 'blockquote'));
      remaining = remaining.slice(bqMatch[0].length);
      continue;
    }

    // <p>
    const pMatch = remaining.match(/^<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      nodes.push(...parseBlockContent(pMatch[1], 'normal'));
      remaining = remaining.slice(pMatch[0].length);
      continue;
    }

    // <img> がブロック直下に来るケース（<p> の外）
    const topImgMatch = remaining.match(/^(<img\s[^>]*\/?>)/i);
    if (topImgMatch) {
      const imgBlock = makeImageBlock(topImgMatch[1]);
      if (imgBlock) nodes.push(imgBlock);
      remaining = remaining.slice(topImgMatch[0].length);
      continue;
    }

    // その他のブロックレベルタグ（div, section 等）→ 再帰処理
    const divMatch = remaining.match(/^<(?:div|section|article|header|footer)[^>]*>([\s\S]*?)<\/(?:div|section|article|header|footer)>/i);
    if (divMatch) {
      nodes.push(...htmlToPortableText(divMatch[1]));
      remaining = remaining.slice(divMatch[0].length);
      continue;
    }

    // 不認識のタグ・コメント等をスキップ
    const skipMatch = remaining.match(/^<[^>]+>/);
    if (skipMatch) {
      remaining = remaining.slice(skipMatch[0].length);
      continue;
    }

    // ブロック外テキストノード
    const textMatch = remaining.match(/^([^<]+)/);
    if (textMatch) {
      const text = decodeEntities(textMatch[1].trim());
      if (text) {
        nodes.push(makeTextBlock(text, 'normal'));
      }
      remaining = remaining.slice(textMatch[0].length);
      continue;
    }

    // フォールバック
    remaining = remaining.slice(1);
  }

  return nodes;
}

// ─────────────────────────────────────────────
// メイン変換関数
// ─────────────────────────────────────────────

/**
 * microCMS の news アイテムを Sanity ドキュメント形式に変換する。
 *
 * - `content` (HTML) を優先、なければ `body` を使用 → Portable Text ブロック配列に変換
 * - `thumbnail.url` → `_sanityAsset: 'image@<url>'` 形式（Sanity CLI が自動アップロード）
 * - `category` は inline object としてそのまま保持
 * - `publishedAt` が存在しない場合は `createdAt` を代用
 * - `createdAt` / `updatedAt` / `revisedAt` は除外
 */
export function transformNews(news: MicrocmsNews): SanityNews {
  const doc: SanityNews = {
    _id: `news-${news.id}`,
    _type: 'news',
    title: news.title,
    body: htmlToPortableText(news.content ?? news.body ?? ''),
  };

  if (news.thumbnail?.url) {
    doc.thumbnail = {
      asset: {
        _type: 'image',
        _sanityAsset: `image@${news.thumbnail.url}`,
      },
    };
  }

  if (news.category) {
    doc.category = {
      id: news.category.id,
      name: news.category.name,
    };
  }

  const publishedAt = news.publishedAt ?? news.createdAt;
  if (publishedAt) {
    doc.publishedAt = publishedAt;
  }

  return doc;
}
