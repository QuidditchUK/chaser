import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { scopes as Scope, users as User } from '@prisma/client';
import { SafeUserWithScopes } from './user';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: SafeUserWithScopes;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user?: SafeUserWithScopes;
  }
}
