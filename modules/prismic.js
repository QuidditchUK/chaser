import Prismic from 'prismic-javascript';
import config from '../config';

const { prismic } = config;

export const Client = (req = null) => Prismic.client(prismic.url, { req, accessToken: prismic.token });

export const formatMetadata = ({ meta_description, meta_title, meta_image }) => ({
  description: meta_description,
  subTitle: meta_title,
  image: meta_image.url,
});

export const getDocs = async (type, options = {}) => {
  const { results } = await Client().query(Prismic.Predicates.at('document.type', type), options);
  return results;
};

export const getBlogCategory = async (category, options = {}) => {
  const { results } = await Client().query(Prismic.Predicates.at('my.post.category', category), options);
  return results;
};

export const getPrismicDocByUid = (type, uid) => Client().getByUID(type, uid, {});

export const getBlogTags = async (tags, options = {}) => {
  const { results } = await Client().query(Prismic.Predicates.any('document.tags', tags), options);
  return results;
};

export const PAGE_SIZE = 6;
