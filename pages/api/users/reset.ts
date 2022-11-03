import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from 'modules/prisma';
import crypto from 'crypto';

interface Request extends NextApiRequest {
  body: {
    email: string;
    token: string;
    password: string;
  };
}

/**
 * is a paired endpoint with /forgot
 * go to /pages/api/forgot.ts for the first half of the flow
 *
 */
export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const existingUser = await prisma.users?.findUnique({
          where: { email: req.body.email },
        });

        if (existingUser) {
          const { hashed_password, uuid, created } = existingUser;
          jwt.verify(
            req.body.token,
            `${hashed_password}-${created.toISOString()}`
          );

          const salt = `${Math.random()}`;
          const newHashedPassword = crypto
            .createHmac('sha1', salt)
            .update(req.body.password)
            .digest('hex');

          await prisma.users.update({
            where: { uuid },
            data: {
              hashed_password: newHashedPassword,
              salt,
            },
          });
          return res.status(200).end();
        }

        return res.status(400).json({ message: 'Invalid token' });
      } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
      }
    default:
      res.status(404).end();
      return;
  }
}
