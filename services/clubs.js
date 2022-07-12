import createService from './index';

const clubsService = {
  getPublicClubs: (params) => ({
    method: 'get',
    url: '/clubs/search',
    ...params,
  }),

  getClub: ({ club_uuid, ...params }) => ({
    method: 'get',
    url: `/clubs/${club_uuid}`,
    ...params,
  }),

  registerClub: ({ data, ...params }) => ({
    method: 'post',
    url: '/clubs/register',
    data,
    ...params,
  }),
};

export default createService(clubsService);
