declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// Vercel環境変数の型定義
declare namespace NodeJS {
  interface ProcessEnv {
    // Vercel自動環境変数
    NEXT_PUBLIC_VERCEL_ENV?: 'production' | 'preview' | 'development';
    NEXT_PUBLIC_VERCEL_URL?: string;
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF?: string;
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?: string;
  }
}
