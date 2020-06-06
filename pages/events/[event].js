import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { Box } from 'components/layout';
import Page404 from 'pages/404';
import Layout from 'containers/layout';
import Meta from 'components/meta';
import HeroWithLocation from 'components/hero-with-location';
import PageLoading from 'components/page-loading';
import { parseTimestamptz } from 'modules/dates';

const EVENT = {
  uuid: '36f03565-f622-43e6-90c5-fae022c5444z',
  name: 'Northern Cup 2020',
  league: 'University',
  slug: 'northern-cup-2020',
  location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
  venue: 'Sheffield Hallam University Sports Park',
  postcode: 'S9 1UA',
  start_time: '2020-11-13 07:00:00Z',
  images: ['https://images.prismic.io/chaser/239db290-616f-4839-8d5f-3fa0ea83ab4d_DSC04508-2000x1200.jpg?auto=compress,format'],
  icon: 'https://images.prismic.io/chaser/65d65868-3e13-4024-871a-6f23d1467042_Northern-Cup-2019-Logo.png?auto=compress,format',
};

const EventPage = ({ event }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (<PageLoading />);
  }

  if (!event) {
    return <Page404 />;
  }

  return (
    <Layout>
      <Meta
        description={`${event.name} on ${format(parseTimestamptz(event.start_time), 'EEE, d LLL')}`}
        subTitle={event.name}
        image={event.images[0]}
      />

      <HeroWithLocation
        image={event.images[0]}
        name={event.name}
        venue={event.venue}
        featuredColor="primary"
        textColor="white"
        icon={event.icon}
        league={event.league}
        location={event.location}
        startTime={event.start_time}
      />

      <Box
        bg="greyLight"
        px={10}
        py={20}
      />
    </Layout>
  );
};

// eslint-disable-next-line no-unused-vars
export const getServerSideProps = async ({ params: { event } }) => {
  const data = EVENT;

  return {
    props: {
      event: data,
    },
  };
};

EventPage.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    start_time: PropTypes.string,
    venue: PropTypes.string,
    icon: PropTypes.string,
    league: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape,
  }).isRequired,
};

export default EventPage;
