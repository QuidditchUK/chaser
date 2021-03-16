import Head from 'next/head';

import fonts from 'styles/fonts';
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
    <style dangerouslySetInnerHTML={{ __html: fonts }} />

    {/* Global Site Tag (gtag.js) - Google Analytics */}
    <script
      async
      defer
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.gaToken}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.gaToken}', {
                page_path: window.location.pathname,
              });
            `,
      }}
    />
    {/* Hotjar */}
    <script
      dangerouslySetInnerHTML={{
        __html: `
            (function(h,o,t,j,a,r){
              h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
              h._hjSettings={hjid:2295064,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `,
      }}
    />
  </Head>
);

export default DocumentHead;
