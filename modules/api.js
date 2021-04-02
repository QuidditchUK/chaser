import cookies from 'js-cookie';
import axios from 'axios';

export const api = axios.create();

api.interceptors.request.use((config) => {
  const token = cookies.get('AUTHENTICATION_TOKEN');

  config.baseURL = process.env.NEXT_PUBLIC_API_URL;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
