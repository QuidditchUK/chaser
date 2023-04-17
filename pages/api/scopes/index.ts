import { NextApiRequest, NextApiResponse } from 'next';
import { isScoped_ApiRoute } from 'modules/auth';
import { getToken } from 'next-auth/jwt';
import { ADMIN, EMT, BANNED } from 'constants/scopes';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const token = await getToken({ req });

        const { email, scope } = req.body;

        const userScopes = token.user.scopes.map(({ scope }) => scope);

        // Only admins can admin EMT + Admin + Banned scopes
        if (
          [ADMIN, EMT, BANNED].includes(scope) &&
          !userScopes.includes(ADMIN)
        ) {
          res.status(403).end();
          return;
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
          res.status(404).end();
          return;
        }

        const user_uuid = user.uuid;

        await prisma.scopes.create({
          data: { user_uuid, scope },
        });

        if (scope === BANNED) {
          await prisma.users_stripe_products.deleteMany({
            where: { user_uuid },
          });
          await prisma.teams_users.deleteMany({
            where: { user_uuid },
          });
          await prisma.scouting_requests.deleteMany({
            where: { user_uuid },
          });
          await prisma.student_summer_pass.deleteMany({
            where: { user_uuid },
          });
        }

        res.status(201).end();
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
