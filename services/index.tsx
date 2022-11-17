import axios, { AxiosRequestConfig } from 'axios';
import mapValues from 'lodash/mapValues';

export function generateSettings({
  method,
  data,
  params,
  url,
  accept = 'application/json',
  responseType = 'json',
  headers = {},
}: {
  method: string;
  data?: any;
  params?: any;
  url: string;
  accept?: string;
  responseType?: string;
  headers?: object;
}) {
  const settings = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    method,
    url,
    responseType,
    headers: {
      ...headers,
      Accept: accept,
    },
  } as AxiosRequestConfig;

  if (params) {
    settings.params = params;
  }

  if (data) {
    settings.data = data;
  }

  return settings;
}

export function wrapServiceCall(service, key) {
  async function makeCall(params?: object) {
    const config = service(params);

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
