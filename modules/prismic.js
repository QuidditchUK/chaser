import Prismic from 'prismic-javascript';
import config from '../config';

const { prismic } = config;

const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken ? { accessToken: prismicAccessToken } : {};

  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

export const Client = (req = null) => Prismic.client(prismic.url, createClientOptions(req, prismic.token));

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

export const getPrismicDocByUid = (type, uid, options = {}) => Client().getByUID(type, uid, options);

export const getBlogTags = async (tags, options = {}) => {
  const { results } = await Client().query([
    Prismic.Predicates.at('document.type', 'post'),
    Prismic.Predicates.any('document.tags', tags),
  ], options);
  return results;
};

export const PAGE_SIZE = 6;

export const linkResolver = ({ type, uid }) => {
  switch (type) {
    case 'volunteer':
      return `/volunteer/${uid}`;
    case 'play':
      return `/play/${uid}`;
    case 'about':
      return `/about/${uid}`;
    case 'post':
      return `/news/${uid}`;
    case 'programmes':
      return `/programmes/${uid}`;
    case 'clubs':
      return `/clubs/${uid}`;
    default:
      return `/${uid}`;
  }
};
