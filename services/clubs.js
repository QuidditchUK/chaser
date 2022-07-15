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

  getClubMembers: ({ club_uuid, ...params }) => ({
    method: 'get',
    url: `/clubs/${club_uuid}/members`,
    ...params,
  }),

  getClubTeams: ({ club_uuid, ...params }) => ({
    method: 'get',
    url: `/clubs/${club_uuid}/teams`,
    ...params,
  }),

  registerClub: ({ data, ...params }) => ({
    method: 'post',
    url: '/clubs/register',
    data,
    ...params,
  }),

  createClub: ({ data, ...params }) => ({
    method: 'post',
    url: '/clubs',
    data,
    ...params,
  }),

  getAllClubs: (params) => ({
    method: 'get',
    url: '/clubs/all',
    ...params,
  }),

  deleteClub: ({ club_uuid, ...params }) => ({
    method: 'delete',
    url: `/clubs/${club_uuid}`,
    ...params,
  }),

  updateClub: ({ club_uuid, data, ...params }) => ({
    method: 'put',
    url: `/clubs/${club_uuid}`,
    data,
    ...params,
  }),

  createClubTeam: ({ club_uuid, data, ...params }) => ({
    method: 'post',
    url: `/clubs/${club_uuid}/teams`,
    data,
    ...params,
  }),
};

export default createService(clubsService);
