import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import dynamic from 'next/dynamic';
import DocumentHead from '../document/head';
import theme from '../styles/theme';

const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <DocumentHead />
      <Scripts />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
