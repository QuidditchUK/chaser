import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const Scripts = () => (
  <Head>
    <script async defer src="//static.cdn.prismic.io/prismic.js?repo=chaser&new=true" />
    <link rel="preconnect" href="https://chaser.prismic.io" />

    {/* Global Site Tag (gtag.js) - Google Analytics */}
    <script
      async
      defer
      src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.gaToken}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${publicRuntimeConfig.gaToken}', {
              page_path: window.location.pathname,
            });
          `,
      }}
    />
  </Head>
);

export default Scripts;
