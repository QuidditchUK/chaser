import { scopes as PrismaScope } from '@prisma/client';
import { ADMIN } from 'constants/scopes';

export const hasScope = (scopes, userScopes = [], adminFallback = true) => {
  const isScoped = scopes.some((scope) => userScopes?.includes(scope));

  if (isScoped) return true;
  return adminFallback ? userScopes?.includes(ADMIN) : false;
};

export const getPlainScopes = (scopes: PrismaScope[]) =>
  scopes?.map(({ scope }) => scope);
