const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA,
  silent: true,
};

const sentryNextOptions = {
  hideSourceMaps: true,
  disableLogger: true,
  widenClientFileUpload: true,
};

module.exports = { sentryWebpackPluginOptions, sentryNextOptions };
