
import { Client, linkResolver } from 'modules/prismic';

export default async (req, res) => {
  const { token } = req.query;

  if (token) {
    try {
      const url = await Client(req).previewSession(token, linkResolver, '/');
      res.writeHead(302, { Location: url });
      res.end();
    } catch {
      res.status(400).send('Something went wrong with the previewSession request');
    }
  } else {
    res.status(400).send('Missing token from preview request');
  }
};
