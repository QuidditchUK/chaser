import cookies from 'js-cookie';
import cookie from 'cookie';

export const setCookies = (name, value) => {
  const cookiesDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  const cookiesSecure = process.env.NEXT_PUBLIC_COOKIE_SECURE;

  return cookies.set(name, value, {
    ...(cookiesDomain && { domain: cookiesDomain }),
    ...(cookiesSecure && { secure: cookiesSecure }),
    expires: 21,
  });
};

export const removeCookie = (name) => {
  const cookiesDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  const cookiesSecure = process.env.NEXT_PUBLIC_COOKIE_SECURE;

  return cookies.remove(name, {
    ...(cookiesDomain && { domain: cookiesDomain }),
    ...(cookiesSecure && { secure: cookiesSecure }),
  });
};

export const parseCookies = (req) =>
  cookie.parse(req ? req.headers.cookie || '' : document.cookie);
