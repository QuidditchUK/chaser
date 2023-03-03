import { NextApiRequest, NextApiResponse } from 'next';
import type { EdiCommitteeFormData } from 'modules/email';
import sendEmail from 'modules/email';

interface Request extends NextApiRequest {
  body: EdiCommitteeFormData;
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await sendEmail({
        template: 'ediCommitteeForm',
        to: 'president@quidditchuk.org, vicepresident@quidditchuk.org, volunteer-form@quidditchuk.org',
        data: req.body,
      });

      res.status(200).end();
      return;
    default:
      res.status(404).end();
      return;
  }
}
