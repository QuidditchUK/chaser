import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import crypto from 'crypto';
import prisma from 'modules/prisma';

interface Request extends NextApiRequest {
  body: {
    old_password: string;
    password: string;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const user = await prisma.users?.findUnique({
          where: { uuid: token.user.uuid },
        });

        if (user) {
          // check old password is correct
          const check =
            crypto
              .createHmac('sha1', user.salt)
              .update(req.body.old_password)
              .digest('hex') === user.hashed_password;

          if (!check) {
            res
              .status(400)
              .json({ error: { message: 'Current password is incorrect' } });
            return;
          }
          const salt = `${Math.random()}`;
          const newHashedPassword = crypto
            .createHmac('sha1', salt)
            .update(req.body.password)
            .digest('hex');

          await prisma.users.update({
            where: { uuid: token.user.uuid },
            data: {
              hashed_password: newHashedPassword,
              salt,
            },
          });
          return res.status(200).end();
        }
        return res.status(200).end();
      } catch (err) {
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
