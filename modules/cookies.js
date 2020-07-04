import cookies from 'js-cookie';
import getConfig from 'next/config';
import cookie from 'cookie';
// import React from 'react';
// import Router from 'next/router';

const { publicRuntimeConfig } = getConfig();

export const setCookies = (name, value) => cookies.set(name, value, {
  ...(publicRuntimeConfig.cookieDomain && { domain: publicRuntimeConfig.cookieDomain }),
  ...(publicRuntimeConfig.cookieSecure && { secure: publicRuntimeConfig.cookieSecure }),
  expires: 21,
});

export const parseCookies = (req) => cookie.parse(req ? req.headers.cookie || '' : document.cookie);
