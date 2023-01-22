import { NextApiRequest, NextApiResponse } from 'next';
import pushNotification from 'modules/push';
import { client } from 'modules/prismic';
import format from 'date-fns/format';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const { documents, masterRef } = req.body;
      if (!documents[0]) {
        res.status(200).end();
        return;
      }

      const document = await client({ ref: masterRef }).getByID(documents[0]);

      // push on events and news, first time published
      if (
        !document ||
        (document?.type !== 'post' && document?.type !== 'events') ||
        document?.first_publication_date !== document?.last_publication_date
      ) {
        res.status(200).end();
        return;
      }

      const payload = {
        post: {
          title: `News | ${document?.data?.title}`,
          body: document?.data?.meta_description || null,
          image: document?.data?.meta_image?.url || document?.data?.image?.url,
          data: { url: `/news/${document.uid}` },
        },
        events: {
          title: `Event | ${document?.data?.event_name}`,
          body: `${format(
            new Date(document?.data?.event_start_date),
            'MMMM d, yyyy'
          )} | ${document?.data?.venue}`,
          image: document?.data?.images?.[0]?.image?.url || null,
          data: { url: `/events/${document.uid}` },
        },
      };

      // send push notifications to those with push notifications
      const pushes = await prisma?.push_notifications?.findMany();

      pushes?.forEach(({ endpoint, auth, p256dh, uuid }) => {
        pushNotification(
          { endpoint, keys: { auth, p256dh } },
          payload[document.type],
          uuid
        );
      });

      res.status(200).end();

    default:
      res.status(404).end();
      return;
  }
}
