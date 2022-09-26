import { setPreviewData, redirectToPreviewURL } from '@prismicio/next';
import { createClient } from '../../modules/prismic';

const preview = async (req, res) => {
  const client = createClient({ req });

  await setPreviewData({ req, res });

  await redirectToPreviewURL({ req, res, client });
};

export default preview;
