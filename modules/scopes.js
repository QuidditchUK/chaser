import { ADMIN } from 'constants/scopes';
import jwtDecode from 'jwt-decode';

export const getUserScopes = (token) => {
  const { scopes } = jwtDecode(token);
  return scopes.map(({ scope }) => scope);
};

export const hasScope = (scopes, userScopes) => {
  return (
    scopes.some((scope) => userScopes.includes(scope)) ||
    userScopes.includes(ADMIN)
  );
};
