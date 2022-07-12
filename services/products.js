import createService from './index';

const productsService = {
  getProducts: (params) => ({
    method: 'get',
    url: '/products',
    ...params,
  }),

  getUserProducts: (params) => ({
    method: 'get',
    url: '/products/me',
    ...params,
  }),

  getProductSession: ({ price_id, ...params }) => ({
    method: 'get',
    url: `/products/session?price_id=${price_id}`,
    ...params,
  }),
};

export default createService(productsService);
