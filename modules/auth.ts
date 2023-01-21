import { hasScope, getPlainScopes } from 'modules/scopes';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';

import { unstable_getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export const isScoped_ServerProps = async (
  context: GetServerSidePropsContext,
  pageScopes: string[]
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const userScopes = getPlainScopes(session.user.scopes);
  return hasScope(pageScopes, userScopes);
};

/**
 * Check to see if a user has the appropriate scopes to access an API route
 * @param  {NextApiRequest} req
 * @param  {string[]} routeScopes
 * @returns boolean
 */
export const isScoped_ApiRoute = async (
  req: NextApiRequest,
  routeScopes: string[]
) => {
  const token = await getToken({ req });

  if (!token || !token?.user) {
    return false;
  }

  const userScopes = getPlainScopes(token.user.scopes);
  return hasScope(routeScopes, userScopes);
};
