import getConfig from 'next/config';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();

export const api = axios.create();

api.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.baseURL = publicRuntimeConfig.apiUrl;

  return config;
});

// export const api = (url, ...params) => fetch(`${publicRuntimeConfig.apiUrl}${url}`, ...params).then((response) => response.json());
