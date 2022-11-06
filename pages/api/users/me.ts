import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { SafeUserWithTransfersAndScopes } from 'types/user';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ user: SafeUserWithTransfersAndScopes }>
) {
  switch (req.method) {
    case 'GET':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const { hashed_password, salt, ...user } =
          await prisma.users.findUnique({
            where: { uuid: token.user.uuid },

            include: {
              scopes: true,
              transfers: {
                select: {
                  prevClub: {
                    select: {
                      name: true,
                    },
                  },
                  newClub: {
                    select: {
                      name: true,
                    },
                  },
                  status: true,
                  updated: true,
                  uuid: true,
                  created: true,
                },
              },
            },
          });

        res.status(200).json({ user });

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
