import Prismic from 'prismic-javascript';
import config from '../config';

const { prismic } = config;

export const Client = (req = null) => Prismic.client(prismic.url, { req, accessToken: prismic.token });
