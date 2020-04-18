import Prismic from 'prismic-javascript';
import config from '../config';

const { prismic } = config;

export const Client = (req = null) => Prismic.client(prismic.url, { req, accessToken: prismic.token });

export const getBlogPosts = async (pageSize) => {
  const { results } = await Client().query(Prismic.Predicates.at('document.type', 'post'), {
    orderings: '[my.post.date desc]',
    pageSize: pageSize || 18,
  });
  return results;
};


export const formatMetadata = (data) => ({
  description: data.meta_description,
  subTitle: data.meta_title,
  image: data.meta_image.url,
});