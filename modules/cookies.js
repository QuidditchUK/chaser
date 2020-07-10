import cookies from 'js-cookie';
// import getConfig from 'next/config';
import cookie from 'cookie';

// const { publicRuntimeConfig } = getConfig();

export const setCookies = (name, value) => cookies.set(name, value, {
  // ...(publicRuntimeConfig.cookieDomain && { domain: publicRuntimeConfig.cookieDomain }),
  // ...(publicRuntimeConfig.cookieSecure && { secure: publicRuntimeConfig.cookieSecure }),
  expires: 21,
});

export const removeCookie = (name) => cookies.remove(name, {
  // ...(publicRuntimeConfig.cookieDomain && { domain: publicRuntimeConfig.cookieDomain }),
  // ...(publicRuntimeConfig.cookieSecure && { secure: publicRuntimeConfig.cookieSecure }),
});

export const parseCookies = (req) => cookie.parse(req ? req.headers.cookie || '' : document.cookie);
