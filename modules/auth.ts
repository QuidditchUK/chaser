import { hasScope, getPlainScopes } from 'modules/scopes';
import { GetServerSidePropsContext } from 'next';

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
