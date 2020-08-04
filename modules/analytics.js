import getConfig from 'next/config';

export const pageview = (url) => {
  const { publicRuntimeConfig } = getConfig();

  if (process.env.NODE_ENV !== 'development') {
    if (typeof window !== 'undefined') {
      window.gtag('config', publicRuntimeConfig.gaToken, {
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
        window.gtag('event', action, {
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
