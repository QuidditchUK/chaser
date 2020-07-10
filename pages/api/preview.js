import { Client, linkResolver } from 'modules/prismic';

// eslint-disable-next-line consistent-return
export default async (req, res) => {
  const { token: ref, documentId } = req.query;
  try {
    const redirectUrl = await Client(req).getPreviewResolver(ref, documentId).resolve(linkResolver, '/');

    if (!redirectUrl) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.setPreviewData({ ref });
    res.setHeader('location', redirectUrl);
    res.statusCode = 302;
    res.end();
  } catch {
    res.status(400).json({ message: 'Something went wrong' });
  }
};
