import createService from './index';

const transfersService = {
  getPendingTransfers: (params) => ({
    method: 'get',
    url: '/transfers/pending',
    ...params,
  }),

  getActionedTransfers: ({ page, ...params }) => ({
    method: 'get',
    url: `/transfers/actioned/${page}`,
    ...params,
  }),

  updateTransfer: ({ transfer_uuid, method, ...params }) => ({
    method: 'put',
    url: `/transfers/${transfer_uuid}/${method}`,
    ...params,
  }),

  requestTransfer: ({ data, ...params }) => ({
    method: 'post',
    url: '/transfers',
    data,
    ...params,
  }),
};

export default createService(transfersService);
