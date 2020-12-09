/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Router from 'next/router';
import * as Sentry from '@sentry/node';
import { ThemeProvider } from 'styled-components';
import dynamic from 'next/dynamic';
import DocumentHead from 'document/head';
import normalTheme from 'styles/theme';
import capeTheme from 'styles/cape';
import { pageview } from 'modules/analytics';
import useCapeMode from 'hooks/useCapeMode';

const Layout = dynamic(() => import('containers/layout'));

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });

require('intersection-observer');

function App({ Component, pageProps, err }) {
  const [theme] = useCapeMode();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const themeMode = theme === 'normal' ? normalTheme : capeTheme;

  return (
    <>
      <ThemeProvider theme={themeMode}>
        <DocumentHead />
        <Layout {...pageProps}>
          <Component {...pageProps} err={err} />
        </Layout>
      </ThemeProvider>
      <Scripts />
    </>
  );
}

export default App;
