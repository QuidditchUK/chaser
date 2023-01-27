import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from 'modules/prisma';
import crypto from 'crypto';
import { scopes, users as User } from '@prisma/client';
import omit from 'lodash/omit';
import { SafeUserWithScopes } from 'types/user';

export const checkPassword = ({
  user,
  password,
}: {
  user: User;
  password: string;
}) => {
  try {
    return (
      crypto.createHmac('sha1', user?.salt).update(password).digest('hex') ===
      user?.hashed_password
    );
  } catch (err) {
    return false;
  }
};

export const authOptions: NextAuthOptions = {
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        try {
          const user = (await prisma.users.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              scopes: true,
            },
          })) as User & { scopes: scopes[] };

          const check = checkPassword({ user, password: credentials.password });

          if (check) {
            return omit(user, [
              'salt',
              'hashed_password',
            ]) as unknown as NextAuthUser;
          }
          return null;
        } catch (err) {
          // TODO: handle
          console.log(err);
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // pass user in to JWT token, which is then passed into the session
    // making that data available in session hooks e.g. useSession
    async jwt({ token, user }) {
      user && (token.user = user as unknown as SafeUserWithScopes);
      return token;
    },
    async session({ session, token }) {
      const user = token.user as SafeUserWithScopes;
      session.user = user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
