import getConfig from 'next/config';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();

export const api = axios.create();

api.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.baseURL = publicRuntimeConfig.apiUrl;

  return config;
});

export const createQueryString = (query) => Object.keys(query).map((key) => (Array.isArray(query[key]) ? query[key].map((value) => `${key}=${value}`).join('&') : `${key}=${query[key]}`)).join('&');
