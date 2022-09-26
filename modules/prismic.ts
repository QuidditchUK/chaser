import * as prismicNext from '@prismicio/next';
import * as prismic from '@prismicio/client';
import add from 'date-fns/add';
import sm from '../sm.json';

export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint);

export const routes = [
  { type: 'volunteer', path: '/volunteer/:uid' },
  { type: 'play', path: '/play/:uid' },
  { type: 'about', path: '/about/:uid' },
  { type: 'post', path: '/post/:uid' },
  { type: 'programmes', path: '/programmes/:uid' },
  { type: 'clubs', path: '/clubs/:uid' },
  { type: 'events', path: '/events/:uid' },
  { type: 'youth', path: '/youth/:uid' },
  { type: 'pages', path: '/:uid' },
] as prismic.ClientConfig['routes'];

export const client = (config?: prismicNext.CreateClientConfig) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    ...config,
  });

  prismicNext.enableAutoPreviews({
    client,
    previewData: config?.previewData,
    req: config?.req,
  });

  return client;
};

export const formatMetadata = ({
  meta_description,
  meta_title,
  meta_image,
}) => ({
  description: meta_description,
  subTitle: meta_title,
  image: meta_image.url,
});

export const getDocs = async (type, options = {}) => {
  const { results } = await client().get({
    predicates: prismic.predicate.at('document.type', type),
    ...options,
  });

  return results;
};

export const getBlogCategory = async (category, options = {}) => {
  const { results } = await client().get({
    predicates: prismic.predicate.at('my.post.category', category),
    ...options,
  });
  return results;
};

export const getPrismicDocByUid = (type, uid, previewData) => {
  return client({ previewData }).getByUID(type, uid);
};

export const getBlogTags = async (tags, options = {}) => {
  const { results } = await client().get({
    predicates: [
      prismic.predicate.at('document.type', 'post'),
      prismic.predicate.any('document.tags', tags),
    ],
    ...options,
  });

  return results;
};

// FIND QUIDDITCH

export const getAllClubs = async ({ showCommunity, showUniversity }) => {
  let leagues = [
    showCommunity ? 'Community' : null,
    showUniversity ? 'University' : null,
  ].filter((league) => league);

  if (!leagues.length) leagues = ['Community', 'University'];

  const { results } = await client().get({
    predicates: prismic.predicate.any('my.clubs.league', leagues),
    orderings: {
      field: 'my.clubs.club_name',
    },
    pageSize: 100,
  });

  return results;
};

export const getClubs = async ({
  longitude,
  latitude,
  distance,
  showCommunity,
  showUniversity,
}) => {
  let leagues = [
    showCommunity ? 'Community' : null,
    showUniversity ? 'University' : null,
  ].filter((league) => league);

  const { results } = await client().get({
    predicates: [
      prismic.predicate.geopointNear(
        'my.clubs.coordinates',
        latitude,
        longitude,
        distance
      ),
      prismic.predicate.any('my.clubs.league', leagues),
    ],
    pageSize: 100,
  });

  return results;
};

export const getEvents = async ({
  longitude,
  latitude,
  distance,
  showCommunity,
  showUniversity,
}) => {
  let leagues = [
    showCommunity ? 'Community' : null,
    showUniversity ? 'University' : null,
  ].filter((league) => league);

  const { results } = await client().get({
    predicates: [
      prismic.predicate.geopointNear(
        'my.events.coordinates',
        latitude,
        longitude,
        distance
      ),
      prismic.predicate.any('my.events.leagues.league', leagues),
      prismic.predicate.dateAfter('my.events.event_start_date', new Date()),
    ],
    pageSize: 100,
  });

  return results;
};

export const getAllEvents = async () => {
  const { results } = await client().get({
    predicates: [
      prismic.predicate.at('document.type', 'events'),
      prismic.predicate.dateAfter('my.events.event_start_date', new Date()),
    ],
    pageSize: 100,
  });
  return results;
};

export const getScoutingApplicationEvents = async () => {
  const twoWeeks = add(new Date(), { days: 12 });
  const fourWeeks = add(new Date(), { days: 28 });
  const { results } = await client().get({
    predicates: [
      prismic.predicate.at('document.type', 'events'),
      prismic.predicate.dateBetween(
        'my.events.event_start_date',
        twoWeeks,
        fourWeeks
      ),
    ],
    pageSize: 100,
  });

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
    case 'events':
      return `/events/${uid}`;
    case 'youth':
      return `/youth/${uid}`;
    default:
      return `/${uid}`;
  }
};

export async function getStaticPrismicProps({ type, uid, previewData }) {
  const [basePageProps, page, posts] = await Promise.all([
    getBasePageProps(),
    getPrismicDocByUid(type, uid, previewData),
    getDocs('post', {
      orderings: {
        field: 'my.post.date',
        direction: 'desc',
      },
      pageSize: PAGE_SIZE,
      page: 1,
    }),
  ]);

  return {
    ...basePageProps,
    page,
    posts,
  };
}

export async function getBasePageProps() {
  const [header, footer] = await Promise.all([
    client().getSingle('header'),
    client().getSingle('footer'),
  ]);

  return {
    header: header?.data,
    footer: footer?.data,
  };
}
