import axios from 'axios';

export const api = axios.create();

api.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.baseURL = process.env.API_URL;

  return config;
});
