import { NextApiRequest, NextApiResponse } from 'next';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }
        const scope = req.query.scope as string;

        const users = await prisma.users.findMany({
          where: {
            scopes: {
              some: {
                scope,
              },
            },
          },
          include: {
            scopes: true,
          },
        });
        res.json(users);

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
