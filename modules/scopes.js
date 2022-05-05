import { ADMIN } from 'constants/scopes';
import { api } from './api';

export const getUserScopes = async (token) => {
  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return user?.scopes.map(({ scope }) => scope);
};

export const hasScope = (scopes, userScopes = []) => {
  return (
    scopes.some((scope) => userScopes?.includes(scope)) ||
    userScopes?.includes(ADMIN)
  );
};
