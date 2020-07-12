import cookies from 'js-cookie';
import cookie from 'cookie';

const { NEXT_PUBLIC_COOKIE_DOMAIN, NEXT_PUBLIC_COOKIE_SECURE } = process.env;

export const setCookies = (name, value) => cookies.set(name, value, {
  ...(NEXT_PUBLIC_COOKIE_DOMAIN && { domain: NEXT_PUBLIC_COOKIE_DOMAIN }),
  ...(NEXT_PUBLIC_COOKIE_SECURE && { secure: NEXT_PUBLIC_COOKIE_SECURE }),
  expires: 21,
});

export const removeCookie = (name) => cookies.remove(name, {
  ...(NEXT_PUBLIC_COOKIE_DOMAIN && { domain: NEXT_PUBLIC_COOKIE_DOMAIN }),
  ...(NEXT_PUBLIC_COOKIE_SECURE && { secure: NEXT_PUBLIC_COOKIE_SECURE }),
});

export const parseCookies = (req) => cookie.parse(req ? req.headers.cookie || '' : document.cookie);
