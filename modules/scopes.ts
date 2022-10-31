import { scopes as PrismaScope } from '@prisma/client';
import { ADMIN } from 'constants/scopes';
import usersService from 'services/users';

export const getUserScopes = async (headers) => {
  const { data: user } = await usersService.getUser({ headers });
  return user?.scopes.map(({ scope }) => scope);
};

export const hasScope = (scopes, userScopes = [], adminFallback = true) => {
  const isScoped = scopes.some((scope) => userScopes?.includes(scope));

  if (isScoped) return true;
  return adminFallback ? userScopes?.includes(ADMIN) : false;
};

export const getPlainScopes = (scopes: PrismaScope[]) =>
  scopes.map(({ scope }) => scope);
