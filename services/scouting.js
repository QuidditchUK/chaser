import createService from './index';

const scoutingService = {
  getPendingScoutingRequests: (params) => ({
    method: 'get',
    url: '/scouting/pending',
    ...params,
  }),
};

export default createService(scoutingService);
