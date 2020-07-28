import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

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
    <script type="text/javascript" src="https://static.cdn.prismic.io/prismic.min.js?new=true" defer async />

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
