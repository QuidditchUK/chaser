import { ADMIN } from 'constants/scopes';
import jwtDecode from 'jwt-decode';
import usersService from 'services/users';

export const getUserScopes = async (headers) => {
  const { data: user } = await usersService.getUser({ headers });
  return user?.scopes.map(({ scope }) => scope);
};

export const hasScope = (scopes, userScopes = []) => {
  return (
    scopes.some((scope) => userScopes?.includes(scope)) ||
    userScopes?.includes(ADMIN)
  );
};

export const getScopesFromToken = (token) => {
  if (!token) {
    return;
  }
  const decoded = jwtDecode(token);
  return decoded?.scopes?.map(({ scope }) => scope);
};
