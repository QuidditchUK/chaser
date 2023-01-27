import createService from './index';

const scopesService = {
  getUsersByScope: ({ scope, ...params }) => ({
    method: 'get',
    url: `/scopes/${scope}`,
    ...params,
  }),

  removeScope: ({ user_uuid, scope, ...params }) => ({
    method: 'delete',
    url: `/scopes/${scope}/users/${user_uuid}`,
    ...params,
  }),

  addScope: ({ data, ...params }) => ({
    method: 'post',
    url: '/scopes',
    data,
    ...params,
  }),
};

export default createService(scopesService);
