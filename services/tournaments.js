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
};

export default createService(tournamentsService);
