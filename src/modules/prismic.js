import Prismic from 'prismic-javascript';
import config from '../config';

const { prismic } = config;

export const Client = (req = null) => Prismic.client(prismic.url, { req, accessToken: prismic.token });

export const getTopNavigation = async () => {
  const { results } = await Client().query(Prismic.Predicates.at('my.pages.top_navigation', true));
  return results;
};
