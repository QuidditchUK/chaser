import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { SafeUserWithTransfersAndScopes } from 'types/user';
import sendEmail from 'modules/email';
import prisma from 'modules/prisma';
import sendNotifications from 'modules/sendNotification';
import { CLUB_MEMBER_ADDED } from 'constants/notifications';
import axios from 'axios';
// import { authOptions } from 'pages/api/auth/[...nextauth]';
// import { unstable_getServerSession } from 'next-auth/next';

export const getSafeUserWithTransfersAndScopes = async (uuid: string) => {
  const { hashed_password, salt, ...user } = await prisma.users.findUnique({
    where: { uuid },

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

  return user;
};

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

        const user = await getSafeUserWithTransfersAndScopes(token.user.uuid);

        res.status(200).json({ user });

        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    case 'PUT':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const { club_uuid, first_name, last_name } =
          await prisma.users.findUnique({ where: { uuid: token.user.uuid } });

        await prisma.users.update({
          where: { uuid: token.user.uuid },
          data: req.body,
        });

        // if update is to join club, send notification to club
        if (req.body.club_uuid && req.body.club_uuid !== club_uuid) {
          const club = await prisma.clubs.findUnique({
            where: { uuid: req.body.club_uuid },
          });

          sendEmail({
            template: 'newMember',
            data: {
              first_name: token.user.first_name,
              last_name: token.user.last_name,
              email: token.user.email,
              name: club.name,
            },
            to: club.email,
          });

          await sendNotifications(
            { user_uuid: club.managed_by, type_id: CLUB_MEMBER_ADDED },
            { club_name: name, user_name: `${first_name} ${last_name}` }
          );
        }

        const user = await getSafeUserWithTransfersAndScopes(token.user.uuid);

        res.status(200).json({ user });
      } catch (err) {
        res.status(400).end();
      }
    default:
      res.status(404).end();
      return;
  }
}
