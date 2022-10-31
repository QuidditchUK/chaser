import { users as PrismaUser, scopes as PrismaScope } from '@prisma/client';

export type SafeUser = Omit<PrismaUser, 'hashed_password' | 'salt'>;
export type SafeUserWithScopes = SafeUser & { scopes: PrismaScope[] };
