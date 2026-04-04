import fs from 'fs';
import path from 'path';

const DUMPS_DIR = path.resolve(process.cwd(), 'dumps');

/**
 * ドキュメント配列を NDJSON 形式で dumps/{filename}.ndjson に書き出す。
 * dumps/ ディレクトリが存在しない場合は自動で作成する。
 */
export function writeNdjson(
  filename: string,
  docs: Record<string, unknown>[]
): void {
  if (!fs.existsSync(DUMPS_DIR)) {
    fs.mkdirSync(DUMPS_DIR, { recursive: true });
  }

  const filePath = path.join(DUMPS_DIR, `${filename}.ndjson`);
  const content = docs.map((doc) => JSON.stringify(doc)).join('\n') + '\n';
  fs.writeFileSync(filePath, content, 'utf-8');

  console.log(`✅ ${docs.length} 件 → ${filePath}`);
}
