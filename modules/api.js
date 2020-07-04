/* eslint-disable no-param-reassign */
import getConfig from 'next/config';
import cookie from 'js-cookie';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();

export const api = axios.create();

api.interceptors.request.use((config) => {
  const token = cookie.get('AUTHENTICATION_TOKEN');
  config.baseURL = publicRuntimeConfig.apiUrl;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createQueryString = (query) => Object.keys(query).map((key) => (Array.isArray(query[key]) ? query[key].map((value) => `${key}=${value}`).join('&') : `${key}=${query[key]}`)).join('&');
