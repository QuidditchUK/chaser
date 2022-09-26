import { setPreviewData, redirectToPreviewURL } from '@prismicio/next';
import { client } from '../../modules/prismic';

const preview = async (req, res) => {
  const createdClient = client({ req });

  await setPreviewData({ req, res });

  await redirectToPreviewURL({ req, res, client: createdClient });
};

export default preview;
