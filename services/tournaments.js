import createService from './index';

const tournamentsService = {
  getAllTournaments: (params) => ({
    method: 'get',
    url: '/tournaments/all',
    ...params,
  }),

  createTournament: ({ data, ...params }) => ({
    method: 'post',
    url: '/tournaments',
    data,
    ...params,
  }),

  getTournament: ({ tournament_uuid, ...params }) => ({
    method: 'get',
    url: `/tournaments/${tournament_uuid}`,
    ...params,
  }),

  updateTournament: ({ tournament_uuid, data, ...params }) => ({
    method: 'put',
    url: `/tournaments/${tournament_uuid}`,
    data,
    ...params,
  }),

  deleteTournament: ({ tournament_uuid, ...params }) => ({
    method: 'delete',
    url: `/tournaments/${tournament_uuid}`,
    ...params,
  }),
};

export default createService(tournamentsService);
