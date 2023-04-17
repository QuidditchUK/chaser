import { NextApiRequest, NextApiResponse } from 'next';
import { isScoped_ApiRoute } from 'modules/auth';
import prisma from 'modules/prisma';
import sendNotifications from 'modules/sendNotification';
import {
  EMT,
  CLUBS_WRITE,
  CLUB_MANAGEMENT as CLUB_MANAGEMENT_SCOPE,
} from 'constants/scopes';
import { CLUB_MANAGEMENT } from 'constants/notifications';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const club_uuid = req.query.uuid as string;
        const { managed_by: user_uuid } = req.body;

        // find the club
        const club = await prisma?.clubs?.findUnique({
          where: { uuid: club_uuid },
        });

        await prisma?.clubs?.update({
          where: { uuid: club_uuid },
          data: {
            managed_by: user_uuid,
          },
        });

        // remove scope from previous manager
        if (club?.managed_by) {
          await prisma?.scopes?.deleteMany({
            where: {
              scope: CLUB_MANAGEMENT_SCOPE,
              user_uuid: club?.managed_by,
            },
          });
        }

        // Add scope to new manager
        await prisma?.scopes?.create({
          data: {
            scope: CLUB_MANAGEMENT_SCOPE,
            user_uuid,
          },
        });

        // notify user they are now the manager of the club
        await sendNotifications({
          user_uuid,
          type_id: CLUB_MANAGEMENT,
          data: { club_name: club?.name },
        });

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
