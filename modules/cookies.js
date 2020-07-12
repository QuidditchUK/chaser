import cookies from 'js-cookie';
import cookie from 'cookie';
import getConfig from 'next/config';

export const setCookies = (name, value) => {
  const { publicRuntimeConfig } = getConfig();

  return cookies.set(name, value, {
    ...(publicRuntimeConfig.cookiesDomain && { domain: publicRuntimeConfig.cookiesDomain }),
    ...(publicRuntimeConfig.cookiesSecure && { secure: publicRuntimeConfig.cookiesSecure }),
    expires: 21,
  });
};

export const removeCookie = (name) => {
  const { publicRuntimeConfig } = getConfig();

  return cookies.remove(name, {
    ...(publicRuntimeConfig.cookiesDomain && { domain: publicRuntimeConfig.cookiesDomain }),
    ...(publicRuntimeConfig.cookiesSecure && { secure: publicRuntimeConfig.cookiesSecure }),
  });
};

export const parseCookies = (req) => cookie.parse(req ? req.headers.cookie || '' : document.cookie);
