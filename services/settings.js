import createService from './index';

const settingsService = {
  getSettings: (params) => ({
    method: 'get',
    url: '/settings',
    ...params,
  }),

  updateSettings: ({ data, ...params }) => ({
    method: 'post',
    url: '/settings',
    data,
    ...params,
  }),
};

export default createService(settingsService);
