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

  getTournamentTeams: ({ tournament_uuid, ...params }) => ({
    method: 'get',
    url: `/tournaments/${tournament_uuid}/teams`,
    ...params,
  }),

  addTeamToTournament: ({ tournament_uuid, data, ...params }) => ({
    method: 'post',
    url: `/tournaments/${tournament_uuid}/teams`,
    data,
    ...params,
  }),

  removeTeamFromTournament: ({ tournament_uuid, team_uuid, ...params }) => ({
    method: 'delete',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}`,
    ...params,
  }),

  getTournamentTeam: ({ tournament_uuid, team_uuid, ...params }) => ({
    method: 'get',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}`,
    ...params,
  }),

  getTournamentTeamPlayers: ({ tournament_uuid, team_uuid, ...params }) => ({
    method: 'get',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}/players`,
    ...params,
  }),
  addPlayerToTeam: ({ tournament_uuid, team_uuid, data, ...params }) => ({
    method: 'post',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}/players`,
    data,
    ...params,
  }),
  removePlayerFromTeam: ({ tournament_uuid, team_uuid, user_uuid, ...params }) => ({
    method: 'delete',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user_uuid}`,
    ...params,
  }),
  getTournamentPlayerRegistration: ({ tournament_uuid, team_uuid, user_uuid, ...params }) => ({
    method: 'get',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user_uuid}/registration`,
    ...params,
  }),
  adminCreatePlayerRegistration: ({ tournament_uuid, team_uuid, user_uuid, data, ...params }) => ({
    method: 'post',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user_uuid}/registration`,
    data,
    ...params,
  }),
  adminDeletePlayerRegistration: ({ tournament_uuid, team_uuid, user_uuid, ...params }) => ({
    method: 'delete',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user_uuid}/registration`,
    ...params,
  }),
  getStripeSessionForPlayerRegistration: ({ tournament_uuid, team_uuid, user_uuid, price_id, ...params }) => ({
    method: 'get',
    url: `/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user_uuid}/session?price_id=${price_id}`,
    ...params,
  }),
};

export default createService(tournamentsService);
