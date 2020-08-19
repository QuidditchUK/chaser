import cookies from 'js-cookie';
import cookie from 'cookie';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const setCookies = (name, value) => cookies.set(name, value, {
  ...(publicRuntimeConfig.cookiesDomain && { domain: publicRuntimeConfig.cookiesDomain }),
  ...(publicRuntimeConfig.cookiesSecure && { secure: publicRuntimeConfig.cookiesSecure }),
  expires: 21,
});

export const removeCookie = (name) => cookies.remove(name, {
  ...(publicRuntimeConfig.cookiesDomain && { domain: publicRuntimeConfig.cookiesDomain }),
  ...(publicRuntimeConfig.cookiesSecure && { secure: publicRuntimeConfig.cookiesSecure }),
});

export const parseCookies = (req) => cookie.parse(req ? req.headers.cookie || '' : document.cookie);
