import { NextApiRequest, NextApiResponse } from 'next';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT, CLUB_MANAGEMENT } from 'constants/scopes';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'DELETE':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const token = await getToken({ req });

        const scope = req.query.scope as string;
        const user_uuid = req.query.uuid as string;

        const userScopes = token.user.scopes.map(({ scope }) => scope);

        // Only admins can remove EMT + Admin scopes
        if ([ADMIN, EMT].includes(scope) && !userScopes.includes(ADMIN)) {
          res.status(403).end();
          return;
        }

        await prisma.scopes.deleteMany({
          where: { user_uuid, scope },
        });

        // remove any scopes NOT club-management
        await prisma.scopes.deleteMany({
          where: {
            user_uuid,
            NOT: { scope: CLUB_MANAGEMENT },
          },
        });

        res.status(204).end();
        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
