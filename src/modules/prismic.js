import Prismic from 'prismic-javascript';

const apiEndpoint = 'https://chaser.cdn.prismic.io/api/v2'; // TODO: CONFIG + API KEY

export const Client = (req = null) => Prismic.client(apiEndpoint, { req });
