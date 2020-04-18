import React from 'react';
import Head from 'next/head';

import fonts from '../styles/fonts';
import reset from '../styles/reset';

const DocumentHead = () => (
  <Head>
    <link rel="icon" href="/192.png" />

    <meta name="theme-color" content="#fffff" />

    <meta property="og:site_name" content="QuidditchUK – Find Your Passion" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:site" content="@QuidditchUK" />

    <link rel="preconnect" href="//images.prismic.io" />

    {/* Fonts */}
    <link
      rel="preload"
      href="%PUBLIC_URL%/fonts/PTSans-Regular.ttf"
      as="font"
      type="font/ttf"
    />

    <link
      rel="preload"
      href="%PUBLIC_URL%/fonts/Roboto-Regular.ttf"
      as="font"
      type="font/ttf"
    />

    <link
      rel="preload"
      href="%PUBLIC_URL%/fonts/Roboto-Bold.ttf"
      as="font"
      type="font/ttf"
    />

    <link rel="stylesheet" href="https://use.typekit.net/rub1byg.css" />

    {/* Static CSS */}
    <style dangerouslySetInnerHTML={{ __html: reset }} />
    <style dangerouslySetInnerHTML={{ __html: fonts }} />
  </Head>
);

export default DocumentHead;
