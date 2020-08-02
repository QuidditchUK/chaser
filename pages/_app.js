/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Router from 'next/router';
import * as Sentry from '@sentry/node';
import { ThemeProvider } from 'styled-components';
import dynamic from 'next/dynamic';
import DocumentHead from 'document/head';
import theme from 'styles/theme';
import { pageview } from 'modules/analytics';

const Layout = dynamic(() => import('containers/layout'));

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });

require('intersection-observer');

function App({ Component, pageProps, err }) {
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <DocumentHead />
      <Scripts />
      <Layout {...pageProps}>
        <Component {...pageProps} err={err} />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
