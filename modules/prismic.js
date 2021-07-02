import Prismic from '@prismicio/client';
import config from '../config';

const { prismic } = config;

const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};

  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

export const Client = (req = null) =>
  Prismic.client(prismic.url, createClientOptions(req, prismic.token));

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
  const { results } = await Client().query(
    Prismic.Predicates.at('document.type', type),
    options
  );
  return results;
};

export const getBlogCategory = async (category, options = {}) => {
  const { results } = await Client().query(
    Prismic.Predicates.at('my.post.category', category),
    options
  );
  return results;
};

export const getPrismicDocByUid = (type, uid, options = {}) => {
  return Client().getByUID(type, uid, options);
};

export const getBlogTags = async (tags, options = {}) => {
  const { results } = await Client().query(
    [
      Prismic.Predicates.at('document.type', 'post'),
      Prismic.Predicates.any('document.tags', tags),
    ],
    options
  );
  return results;
};

// FIND QUIDDITCH

export const getAllClubs = async ({ showCommunity, showUniversity }) => {
  let leagues = [
    showCommunity ? 'Community' : null,
    showUniversity ? 'University' : null,
  ].filter((league) => league);

  if (!leagues.length) leagues = ['Community', 'University'];

  const { results } = await Client().query(
    [Prismic.Predicates.any('my.clubs.league', leagues)],
    { orderings: '[my.clubs.club_name]', pageSize: 100 }
  );

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

  const { results } = await Client().query(
    [
      Prismic.Predicates.geopoint.near(
        'my.clubs.coordinates',
        latitude,
        longitude,
        distance
      ),
      Prismic.Predicates.any('my.clubs.league', leagues),
    ],
    { pageSize: 100 }
  );

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

  const { results } = await Client().query(
    [
      Prismic.Predicates.geopoint.near(
        'my.events.coordinates',
        latitude,
        longitude,
        distance
      ),
      Prismic.Predicates.any('my.events.leagues.league', leagues),
      // TODO: Uncomment on Wednesday when events are live
      // Prismic.Predicates.dateAfter('my.events.event_start_date', new Date()),
    ],
    { pageSize: 100 }
  );

  return results;
};

export const getAllEvents = async () => {
  const { results } = await Client().query(
    [
      Prismic.Predicates.at('document.type', 'events'),
      // TODO: Uncomment on Wednesday when events are live
      // Prismic.Predicates.dateAfter('my.events.event_start_date', new Date()),
    ],
    { pageSize: 100 }
  );
  return results;
};

export const getScoutingApplicationEvents = async () => {
  var twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  var fourWeeks = new Date();
  fourWeeks.setDate(fourWeeks.getDate() + 28);
  const { results } = await Client().query(
    [
      Prismic.Predicates.at('document.type', 'events'),
      Prismic.Predicates.dateBetween(
        'my.events.event_start_date',
        twoWeeks,
        fourWeeks
      ),
    ],
    { pageSize: 100 }
  );
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
