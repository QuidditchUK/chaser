import createService from './index';

const usersService = {
  getUser: (params) => ({
    method: 'get',
    url: '/users/me',
    ...params,
  }),

  updateUser: ({ data, ...params }) => ({
    method: 'put',
    url: '/users/me',
    data,
    ...params,
  }),

  updatePassword: ({ data, ...params }) => ({
    method: 'put',
    url: '/users/password',
    data,
    ...params,
  }),

  login: ({ data, ...params }) => ({
    method: 'post',
    url: '/users/login',
    data,
    ...params,
  }),

  createUser: ({ data, ...params }) => ({
    method: 'post',
    url: '/users',
    data,
    ...params,
  }),

  updateUserNationalProfile: ({ data, ...params }) => ({
    method: 'put',
    url: '/users/national',
    data,
    ...params,
  }),

  scoutingRequest: ({ data, ...params }) => ({
    method: 'put',
    url: '/users/scouting',
    data,
    ...params,
  }),

  forgotPassword: ({ data, ...params }) => ({
    method: 'post',
    url: '/users/forgot',
    data,
    ...params,
  }),

  resetPassword: ({ data, ...params }) => ({
    method: 'post',
    url: '/users/reset',
    data,
    ...params,
  }),

  getNotifications: (params) => ({
    method: 'get',
    url: '/users/notifications',
    ...params,
  }),

  getUnreadNoticationsCount: (params) => ({
    method: 'get',
    url: '/users/notifications/unread',
    ...params,
  }),

  markNotificationRead: ({ notification_uuid, data, ...params }) => ({
    method: 'put',
    url: `/users/notifications/${notification_uuid}`,
    data,
    ...params,
  }),

  deleteNotification: ({ notification_uuid, ...params }) => ({
    method: 'delete',
    url: `/users/notifications/${notification_uuid}`,
    ...params,
  }),

  getPushNotifications: (params) => ({
    method: 'get',
    url: '/users/push-notifications',
    ...params,
  }),

  createPushNotification: ({ data, ...params }) => ({
    method: 'post',
    url: '/users/push-notifications',
    data,
    ...params,
  }),

  deletePushNotification: ({ push_uuid, ...params }) => ({
    method: 'delete',
    url: `/users/push-notifications/${push_uuid}`,
    ...params,
  }),
};

export default createService(usersService);
