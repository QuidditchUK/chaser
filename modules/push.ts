import * as push from 'web-push';
import prisma from './prisma';

const client = push;
client.setVapidDetails(
  'https://quadballuk.org/about/contact',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const pushNotification = async (subscription, payload, uuid) => {
  try {
    client.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    // if sendNotification fails, remove the subscription
    prisma.push_notifications.delete({
      where: { uuid },
    });
  }
};

export default pushNotification;
