import { NextApiRequest, NextApiResponse } from 'next';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT } from 'constants/scopes';
import { getSafeUserWithTransfersAndScopes } from '../me';
import { getPlainScopes } from 'modules/scopes';

interface Request extends NextApiRequest {
  body: {
    [k: string]: boolean;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }
        const uuid = req.query.uuid as string;
        const user = await getSafeUserWithTransfersAndScopes(uuid);

        // array of [transfer:read, user:read] etc
        const userScopes = getPlainScopes(user.scopes);

        // scopes to add (if any)
        // e.g. [transfer:read, user:write]
        const scopesToHave = Object.keys(req.body).filter(
          (scope) => req.body[scope]
        );

        // e.g. [user:write]
        const addScopes = scopesToHave.filter(
          (scope) => !userScopes.includes(scope)
        );

        if (addScopes.length) {
          await prisma.scopes.createMany({
            data: addScopes.map((scope) => ({ scope, user_uuid: uuid })),
          });
        }

        const scopesToRemove = Object.keys(req.body).filter(
          (scope) => !req.body[scope]
        );
        const removeScopes = scopesToRemove.filter((scope) =>
          userScopes.includes(scope)
        );

        if (removeScopes.length) {
          // do it by scope uuid as more direct to delete
          const scopeUuids = removeScopes.map((scopeName) => {
            const scope = user.scopes.find((sc) => sc.scope === scopeName);
            return scope.uuid;
          });

          await Promise.all(
            scopeUuids.map((uuid) => prisma.scopes.delete({ where: { uuid } }))
          );
        }

        res.status(200).end();

        return;
      } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
