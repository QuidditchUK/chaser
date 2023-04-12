import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { system_settings as PrismaSystemSettings } from '@prisma/client';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT } from 'constants/scopes';
import pushNotification from 'modules/push';
import {
  TRANSFERS_OPEN,
  TRANSFERS_CLOSED,
  PUSH_PAYLOADS,
} from 'constants/notifications';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PrismaSystemSettings>
) {
  switch (req.method) {
    case 'GET':
      try {
        const [settings] = await prisma.system_settings.findMany({
          orderBy: {
            created: 'desc',
          },
          take: 1,
        });

        res.status(200).json(settings);
        return;
      } catch (err) {
        res.status(400).end();
        return;
      }

    case 'POST':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const [oldSettings] = await prisma.system_settings.findMany({
          orderBy: {
            created: 'desc',
          },
          take: 1,
        });

        const { uuid, created, ...rest } = oldSettings;
        const data = { ...rest, ...req.body };

        // new settings
        const settings = await prisma.system_settings.create({
          data,
        });

        // delete old settings
        await prisma.system_settings.delete({
          where: {
            uuid: oldSettings.uuid,
          },
        });

        // TRANSFER WINDOW UPDATE
        if (oldSettings?.transfer_window !== settings?.transfer_window) {
          // find all users that want transfer window updates
          const users = await prisma?.users?.findMany({
            where: { transfer_window_notifications: true },
            select: {
              uuid: true,
              push_notifications: true,
            },
          });

          const type_id = settings?.transfer_window
            ? TRANSFERS_OPEN
            : TRANSFERS_CLOSED;

          await prisma?.notifications?.createMany({
            data: users.map(({ uuid: user_uuid }) => ({
              user_uuid,
              type_id,
            })),
          });

          // push notifications
          // only users that have push notifications
          const pushUsers = users.filter(
            ({ push_notifications }) => push_notifications?.length !== 0
          );

          // for Each of the users, loop over their push notifications and send a notification
          pushUsers.forEach((pushUser) => {
            pushUser.push_notifications.forEach(
              ({ endpoint, auth, p256dh, uuid }) => {
                pushNotification(
                  { endpoint, keys: { auth, p256dh } },
                  PUSH_PAYLOADS[type_id],
                  uuid
                );
              }
            );
          });
        }

        // update active student summer passes
        if (
          oldSettings?.student_summer_pass_expiry !==
          settings.student_summer_pass_expiry
        ) {
          await prisma.student_summer_pass.updateMany({
            where: {
              expires: {
                gt: oldSettings.student_summer_pass_expiry,
              },
            },
            data: {
              expires: settings.student_summer_pass_expiry,
            },
          });
        }

        res.status(200).json(settings);
        return;
      } catch (error) {
        res.status(400).end();
      }

    default:
      res.status(404).end();
      return;
  }
}
