import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import dynamic from 'next/dynamic';
import DocumentHead from '../document/head';
import theme from '../styles/theme';

const Scripts = dynamic(() => import('../document/scripts'), { ssr: false });

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <DocumentHead />
      <Scripts />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
