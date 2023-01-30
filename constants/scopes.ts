export const ADMIN = 'admin';
export const VOLUNTEER = 'volunteer';
export const EMT = 'emt';
export const HEAD_SCOUT = 'head-scout';
export const CLUB_MANAGEMENT = 'club-management';

export const USERS_READ = 'users:read';
export const CLUBS_READ = 'clubs:read';
export const CLUBS_WRITE = 'clubs:write';
export const TRANSFER_READ = 'transfer:read';
export const TRANSFER_WRITE = 'transfer:write';

export const NATIONAL_TEAM_READ = 'national-team:read';

export const SCOUTING_ENGLAND_READ = 'scouting-england:read';
export const SCOUTING_ENGLAND_WRITE = 'scouting-england:write';
export const SCOUTING_WALES_READ = 'scouting-wales:read';
export const SCOUTING_WALES_WRITE = 'scouting-wales:write';
export const SCOUTING_SCOTLAND_READ = 'scouting-scotland:read';
export const SCOUTING_SCOTLAND_WRITE = 'scouting-scotland:write';

export const DASHBOARD_SCOPES = [VOLUNTEER, EMT, ADMIN];
export const VOLUNTEER_SCOPES = [
  USERS_READ,
  CLUBS_READ,
  CLUBS_WRITE,
  TRANSFER_READ,
  TRANSFER_WRITE,
];
