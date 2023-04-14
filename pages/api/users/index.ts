import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import prisma from 'modules/prisma';
import { JoinFormProps } from 'types/user';
import sendEmail from 'modules/email';

interface Request extends NextApiRequest {
  body: JoinFormProps;
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const sanitisedEmail = req.body.email.toLowerCase();

        const existingUser = await prisma.users?.findUnique({
          where: { email: sanitisedEmail },
        });

        if (existingUser) {
          res
            .status(400)
            .json({ message: 'User with email address already exists' });
          return;
        }

        const salt = `${Math.random()}`;
        const hashed_password = crypto
          .createHmac('sha1', salt)
          .update(req.body.password)
          .digest('hex');

        const { password, ...user } = req.body;

        await prisma.users.create({
          data: {
            salt,
            hashed_password,
            type: 'user',
            ...user,
          },
        });

        await sendEmail({
          template: 'welcome',
          to: user.email,
          data: { first_name: user.first_name },
        });

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
