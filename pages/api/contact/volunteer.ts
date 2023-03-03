import { NextApiRequest, NextApiResponse } from 'next';
import type { VolunteerFormData } from 'modules/email';
import sendEmail from 'modules/email';

interface Request extends NextApiRequest {
  body: VolunteerFormData;
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await sendEmail({
        template: 'volunteerForm',
        to: 'volunteer-form@quidditchuk.org',
        cc: 'admin@quidditchuk.org',
        data: req.body,
      });

      res.status(200).end();
      return;
    default:
      res.status(404).end();
      return;
  }
}
