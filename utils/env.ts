/**
 * Vercel環境判定ユーティリティ
 *
 * Vercel環境変数を使用して現在の実行環境を判定します。
 * クライアントサイドでも使用できるよう、NEXT_PUBLIC_プレフィックス付き環境変数を使用しています。
 */

/**
 * Vercel環境種別
 * - production: 本番環境（タグプッシュでデプロイ）
 * - preview: プレビュー環境（developmentブランチ等へのプッシュでデプロイ）
 * - development: ローカル開発環境
 */
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

/**
 * 本番環境判定
 * タグプッシュによるデプロイ環境
 */
export const isProduction = vercelEnv === 'production';

/**
 * プレビュー環境判定
 * developmentブランチ等へのプッシュによるデプロイ環境
 */
export const isPreview = vercelEnv === 'preview';

/**
 * ローカル開発環境判定
 * npm run dev で起動している環境
 */
export const isDevelopment = !vercelEnv || vercelEnv === 'development';

/**
 * デプロイURL
 * 例: development--project.vercel.app
 */
export const deployUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

/**
 * Git ブランチ名
 * 例: development, main
 */
export const branchName = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;

/**
 * Git コミットハッシュ
 * 例: 1a2b3c4d5e6f7g8h9i0j
 */
export const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

/**
 * デバッグ情報の取得
 * 開発時の環境確認に使用
 */
export const getDebugInfo = () => ({
  vercelEnv,
  isProduction,
  isPreview,
  isDevelopment,
  deployUrl,
  branchName,
  commitSha,
});
