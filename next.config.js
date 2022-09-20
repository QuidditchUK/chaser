// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa')({ dest: 'public' });

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
        source: '/find-quidditch',
        destination: '/clubs',
        permanent: true,
      },
      {
        source: '/teamuk',
        destination: '/programmes/england',
        permanent: true,
      },
      {
        source: '/teamuk',
        destination: '/programmes/england',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'images.prismic.io',
      'chaser.cdn.prismic.io',
      'qs-prod-team-logo.s3.eu-west-2.amazonaws.com',
      'qs-staging-team-logo.s3.eu-west-2.amazonaws.com',
      'i.ytimg.com',
      'files.stripe.com',
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = withPWA(
  withSentryConfig(moduleExports, SentryWebpackPluginOptions)
);
