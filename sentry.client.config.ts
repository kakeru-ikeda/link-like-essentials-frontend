import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV;
const release = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  environment,
  release,
});
