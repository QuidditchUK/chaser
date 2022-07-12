import createService from './index';

const clubsService = {
  getPublicClubs: (params) => ({
    method: 'get',
    url: '/clubs/search',
    ...params,
  }),

  getClub: ({ club_uuid, params }) => ({
    method: 'get',
    url: `/clubs/${club_uuid}`,
    ...params,
  }),
};

export default createService(clubsService);
