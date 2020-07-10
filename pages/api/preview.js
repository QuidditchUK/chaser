import { Client, linkResolver } from 'modules/prismic';

export default async (req, res) => {
  const { token, documentId } = req.query;
  const redirectUrl = await Client(req).getPreviewResolver(token, documentId).resolve(linkResolver, '/');
  res.redirect(302, redirectUrl);
};
