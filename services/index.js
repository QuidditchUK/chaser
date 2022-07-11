import axios from 'axios';
import cookies from 'js-cookie';
import mapValues from 'lodash/mapValues';

export function generateSettings(reqConfig) {
  const token = cookies.get('AUTHENTICATION_TOKEN');
  const {
    method,
    data,
    params,
    url,
    accept = 'application/json',
    responseType = 'json',
    headers = {},
  } = reqConfig;

  const settings = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    method,
    url,
    responseType,
    headers: {
      ...headers,
      Accept: accept,
    },
  };

  if (token) {
    settings.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    settings.data = data;
  }
  if (params) {
    settings.params = params;
  }

  return settings;
}

export function wrapServiceCall(service, key) {
  function makeCall(params) {
    const { ...config } = service(params);

    let settings = generateSettings(config);

    return axios(settings);
  }

  makeCall.getPath = (params) => {
    const { params: queryParams, url } = service(params);

    let query = '';

    if (queryParams) {
      query = '?' + new URLSearchParams(queryParams).toString();
    }
    return url + query;
  };

  makeCall.key = key;

  return makeCall;
}

export default function createService(serviceConfig) {
  const service = mapValues(serviceConfig, (serviceCallConfig, key) => {
    return wrapServiceCall(serviceCallConfig, key);
  });

  return service;
}
