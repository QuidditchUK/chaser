/* eslint-disable react/prop-types */
import * as Sentry from '@sentry/node';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import dynamic from 'next/dynamic';
import DocumentHead from 'document/head';
import theme from 'styles/theme';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });

require('intersection-observer');

function App({ Component, pageProps, err }) {
  return (
    <ThemeProvider theme={theme}>
      <DocumentHead />
      <Scripts />

      <Component {...pageProps} err={err} />
    </ThemeProvider>
  );
}

export default App;
