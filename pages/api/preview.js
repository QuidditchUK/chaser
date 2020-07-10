import { linkResolver } from 'modules/prismic';
import Prismic from 'prismic-javascript';
import config from '../../config';

const { prismic } = config;

// eslint-disable-next-line consistent-return
export default async (req, res) => {
  const { token, documentId } = req.query;
  const redirectUrl = await Prismic.api(prismic.url).getPreviewResolver(token, documentId).resolve(linkResolver, '/');
  res.redirect(302, redirectUrl);
};
