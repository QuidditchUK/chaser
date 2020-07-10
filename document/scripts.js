import React from 'react';
import Head from 'next/head';

const Scripts = () => (
  <Head>
    <script
      dangerouslySetInnerHTML={{
        __html: `
                  window.prismic = {
                    endpoint: 'https://chaser.cdn.prismic.io/api/v2'
                  };`,
      }}
    />
    <script type="text/javascript" src="https://static.cdn.prismic.io/prismic.min.js?new=true" />
  </Head>
);

export default Scripts;
