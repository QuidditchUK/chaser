import { NextApiRequest, NextApiResponse } from 'next';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, USERS_READ } from 'constants/scopes';
import { getSafeUserWithIncludes } from '../me';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, USERS_READ]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }
        const uuid = req.query.uuid as string;

        const user = await getSafeUserWithIncludes(uuid);
        res.json(user);

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
