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
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryNextOptions);
