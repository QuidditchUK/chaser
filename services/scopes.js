import createService from './index';

const scopesService = {
  getUsersByScope: ({ scope, ...params }) => ({
    method: 'get',
    url: `/scopes/users/${scope}`,
    ...params,
  }),

  removeScope: ({ user_uuid, scope, ...params }) => ({
    method: 'delete',
    url: `/scopes/${scope}/users/${user_uuid}`,
    ...params,
  }),
};

export default createService(scopesService);
