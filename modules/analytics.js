import getConfig from 'next/config';

function gtag(...args) {
  // eslint-disable-next-line no-unused-expressions
  window.dataLayer && window.dataLayer.push(args);
}
export const pageview = (url) => {
  const { publicRuntimeConfig } = getConfig();

  if (process.env.NODE_ENV !== 'development') {
    if (typeof window !== 'undefined') {
      gtag('config', publicRuntimeConfig.gaToken, {
        page_path: url,
      });
    }
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}) => {
  if (process.env.NODE_ENV !== 'development') {
    try {
      if (typeof window !== 'undefined') {
        gtag('event', action, {
          event_category: category,
          ...(label && { event_label: label }),
          ...(value && { value }),
        });
      }
    } catch (err) {
      // silent error
    }
  }
};
