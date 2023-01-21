import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { push_notifications as PrismaPushNotifications } from '@prisma/client';
import prisma from 'modules/prisma';
import pushNotification from 'modules/push';
import { PUSH_PAYLOADS } from 'constants/notifications';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ pushNotifications: PrismaPushNotifications[] }>
) {
  switch (req.method) {
    case 'GET':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const pushNotifications = await prisma?.push_notifications?.findMany({
          where: {
            user_uuid: token.user?.uuid,
          },
        });

        res.status(200).json({ pushNotifications });
        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    case 'POST':
      try {
        const pn = await prisma?.push_notifications?.create({
          data: req.body,
        });

        pushNotification(
          {
            endpoint: pn.endpoint,
            keys: { p256dh: pn.p256dh, auth: pn.auth },
          },
          PUSH_PAYLOADS.PUSH_NOTIFICATION_ENABLED,
          pn.uuid
        );

        res.status(200).end();
        return;
      } catch (error) {
        res.status(400).end();
      }
    default:
      res.status(404).end();
      return;
  }
}
