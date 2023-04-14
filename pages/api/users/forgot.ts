import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from 'modules/prisma';
import sendEmail from 'modules/email';

interface Request extends NextApiRequest {
  body: { email: string };
}

/**
 * is a paired endpoint with /reset
 * go to /pages/api/reset.ts for the second half of the flow
 *
 */

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const sanitisedEmail = req.body.email.toLowerCase();

        const existingUser = await prisma.users?.findUnique({
          where: { email: sanitisedEmail },
        });

        if (existingUser) {
          const { hashed_password, uuid, created, first_name } = existingUser;
          const token = jwt.sign(
            { uuid, email: sanitisedEmail },
            `${hashed_password}-${created.toISOString()}`,
            { expiresIn: '1d' }
          );

          const reset_url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/reset?token=${token}&email=${req.body.email}`;

          await sendEmail({
            template: 'forgotPassword',
            data: { reset_url, first_name },
            to: sanitisedEmail,
          });
        }

        return res.status(200).end();
      } catch (err) {
        // "fail" silently, regardless of if there is a user with that email or not
        // so an attacker can't use this functionality to sniff for user emails
        res.status(200).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
