import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { isScoped_ApiRoute } from 'modules/auth';
import sendEmail from 'modules/email';
import sendNotifications from 'modules/sendNotification';
import { TRANSFER_DECLINED } from 'constants/notifications';
import { EMT, TRANSFER_WRITE } from 'constants/scopes';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, TRANSFER_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const token = await getToken({ req });
        const { uuid: actioned_by } = token.user;

        const uuid = req.query.uuid as string;

        const { reason } = req.body;

        const transfer = await prisma.transfers.update({
          where: { uuid },
          data: {
            status: 'DECLINED',
            actioned_by,
            updated: new Date(),
            reason,
          },
          include: {
            newClub: true,
          },
        });

        const user = await prisma.users.findUnique({
          where: { uuid: transfer?.user_uuid },
        });

        // Notifications
        sendEmail({
          to: user?.email,
          template: 'transferDeclined',
          data: {
            first_name: user?.first_name,
            new_club_name: transfer?.newClub?.name,
          },
          from: 'clubs@quidditchuk.org',
        });

        await sendNotifications(
          { user_uuid: transfer?.user_uuid, type_id: TRANSFER_DECLINED },
          { club_name: transfer?.newClub?.name }
        );

        res.status(200).end();
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
