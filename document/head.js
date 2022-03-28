import Head from 'next/head';
import reset from 'styles/reset';

const DocumentHead = () => (
  <Head>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#0e375f" />

    <meta property="og:site_name" content="QuidditchUK – Find Your Passion" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:site" content="@QuidditchUK" />

    <link rel="preconnect" href="//images.prismic.io" />
    <link rel="preconnect" href="//chaser.prismic.io" />
    <link rel="manifest" href="/manifest.json" />

    {/* Fonts */}
    <link rel="preload" href="https://use.typekit.net/tla4oaq.css" as="style" />
    <link rel="stylesheet" href="https://use.typekit.net/tla4oaq.css" />

    {/* Static CSS */}
    <style dangerouslySetInnerHTML={{ __html: reset }} />
  </Head>
);

export default DocumentHead;
