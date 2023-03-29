import pushNotification from './push';
import {
  NotificationType,
  NOTIFICATION_PAYLOADS,
  PUSH_PAYLOADS,
} from '../constants/notifications';
import prisma from './prisma';

/**
 * Sends a push notification (if enabled) and a regular notification to the user
 * @param  {{user_uuid:string;type_id:NotificationType}}
 * @param  {any} data
 */
const sendNotifications = async (
  { user_uuid, type_id }: { user_uuid: string; type_id: NotificationType },
  data: any
) => {
  if (!user_uuid) {
    return;
  }

  const notificationPayload = NOTIFICATION_PAYLOADS[type_id] || null;

  await prisma?.notifications.create({
    data: {
      user_uuid,
      type_id,
      message: notificationPayload ? notificationPayload(data) : null,
    },
  });

  const pushNotifications = await prisma?.push_notifications?.findMany({
    where: { user_uuid },
  });

  if (!pushNotifications.length) {
    return;
  }

  const payloadLookup = PUSH_PAYLOADS[type_id];
  let payload = {};

  if (typeof payload === 'function') {
    payload = payloadLookup(data);
  } else {
    payload = payloadLookup;
  }

  pushNotifications?.forEach(({ endpoint, p256dh, auth, uuid }) => {
    pushNotification(
      { endpoint, keys: { p256dh, auth } },
      PUSH_PAYLOADS[type_id],
      uuid
    );
  });
};

export default sendNotifications;
