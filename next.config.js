const { withSentryConfig } = require('@sentry/nextjs');
const { sentryNextOptions, sentryWebpackPluginOptions } = require('./sentry.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    // Vercel自動環境変数をクライアントサイドで利用可能にする
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  },
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryNextOptions);
