// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const moduleExports = {
  async rewrites() {
    return [
      {
        source: '/merch',
        destination: 'https://www.utilityapparel.com/quidditch-uk/',
      },
      {
        source: '/play/coaching-resources',
        destination:
          'https://docs.google.com/spreadsheets/d/1n_j-gDhC4mE2j4nTkBAhY-8MlvqAX0bLnWm0on54GJA/',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/referees',
        destination: '/volunteer/referees',
        permanent: true,
      },
      {
        source: '/snitches',
        destination: '/volunteer/snitches',
        permanent: true,
      },
      {
        source: '/clubs',
        destination: '/find-quidditch',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/find-quidditch',
        permanent: true,
      },
      {
        source: '/teamuk',
        destination: '/programmes/team-england',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['images.prismic.io', 'chaser.cdn.prismic.io'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
