import fs from 'fs';
import path from 'path';

/**
 * .env.local を読み込んで process.env にセットする。
 * dotenv 未インストール環境向けの簡易ローダー。
 * 既に設定済みの変数は上書きしない。
 */
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const raw = trimmed.slice(eqIndex + 1).trim();
    const value = raw.replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  });
}
