import Script from 'next/script';

export const pageview = (url) => {
  if (
    process.env.NODE_ENV !== 'development' &&
    typeof window !== 'undefined' &&
    typeof window?.gtag !== 'undefined'
  ) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_TOKEN, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }) => {
  if (
    process.env.NODE_ENV !== 'development' &&
    typeof window !== 'undefined' &&
    typeof window?.gtag !== 'undefined'
  ) {
    window?.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

// Global Site Tag (gtag.js) - Google Analytics
const GTag = () => (
  <>
    <Script
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TOKEN}`}
    />
    <Script id="google-gtag" strategy="lazyOnload">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_TOKEN}', {
          page_path: window.location.pathname,
        });
      `}
    </Script>
  </>
);

export default GTag;
