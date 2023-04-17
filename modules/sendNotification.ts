import pushNotification from './push';
import {
  NotificationType,
  NotificationDataType,
  NOTIFICATION_PAYLOADS,
  PUSH_PAYLOADS,
} from '../constants/notifications';
import prisma from './prisma';

/**
 * Sends a push notification (if enabled) and a regular notification to the user
 */
export default async function sendNotifications<T extends NotificationType>({
  type_id,
  user_uuid,
  data,
}: {
  type_id: T;
  user_uuid: string;
  data: NotificationDataType<T>;
}) {
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
  const payload = payloadLookup(data);

  pushNotifications?.forEach(({ endpoint, p256dh, auth, uuid }) => {
    pushNotification({ endpoint, keys: { p256dh, auth } }, payload, uuid);
  });
}
