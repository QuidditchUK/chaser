import cookies from 'js-cookie';
import cookie from 'cookie';

const { cookiesDomain, cookiesSecure } = process.env;

export const setCookies = (name, value) => cookies.set(name, value, {
  ...(cookiesDomain && { domain: cookiesDomain }),
  ...(cookiesSecure && { secure: cookiesSecure }),
  expires: 21,
});

export const removeCookie = (name) => cookies.remove(name, {
  ...(cookiesDomain && { domain: cookiesDomain }),
  ...(cookiesSecure && { secure: cookiesSecure }),
});

export const parseCookies = (req) => cookie.parse(req ? req.headers.cookie || '' : document.cookie);
