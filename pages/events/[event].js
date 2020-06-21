import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { Box, Flex } from 'components/layout';
import Page404 from 'pages/404';
import Layout from 'containers/layout';
import Meta from 'components/meta';
import Container from 'components/container';
import { TYPES } from 'components/club-type';
import PageLoading from 'components/page-loading';
import Heading from 'components/heading';
import Content from 'components/content';
import { parseTimestamptz } from 'modules/dates';
import Button from 'components/button';
import ExternalLink from 'components/external-link';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { rem } from 'styles/theme';
import PinIcon from 'public/images/location-pin.svg';

const EVENT = {
  uuid: '36f03565-f622-43e6-90c5-fae022c5444z',
  name: 'Northern Cup 2020',
  league: 'University',
  slug: 'northern-cup-2020',
  location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
  venue: 'Sheffield Hallam University Sports Park',
  start_time: '2020-11-14 07:00:00Z',
  end_time: '2020-11-15 17:00:00Z',
  images: ['https://images.prismic.io/chaser/239db290-616f-4839-8d5f-3fa0ea83ab4d_DSC04508-2000x1200.jpg?auto=compress,format'],
  icon: 'https://images.prismic.io/chaser/65d65868-3e13-4024-871a-6f23d1467042_Northern-Cup-2019-Logo.png?auto=compress,format',
  description: '<p>Welcome to Northern Cup 2019! The UK’s Northern teams will be competing for the title of Northern Cup Champions, as well as fighting to earn their place at the inaugural European Qualifying Tournament and the British Quidditch Cup 2019.</p><p> Welcome to Northern Cup 2019! The UK’s Northern teams will be competing for the title of Northern Cup Champions, as well as fighting to earn their place at the inaugural European Qualifying Tournament and the British Quidditch Cup 2019.</p>',
  registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdqKtdD2MoUfobYHtlzIbItUeOsgjJgWmylPnnP4vrkOCgpUg/viewform',
  registerTime: '2020-09-13 07:00:00Z',
};

const Icon = styled.img`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.box};

  @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    height: 200px;
    width: 200px;
  }
`;

const LocationIcon = styled(PinIcon)`
  height: 15px;
  width: 15px;
`;

const LocationLink = styled.a`
  padding: ${({ theme }) => theme.space[1]};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 2px dotted ${({ theme }) => theme.colors.primary};
`;

const Time = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
`;

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

      <Box
        as="section"
        position="relative"
        backgroundImage={`url(${event.images[0]})`}
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={BLOG_MIN_HEIGHTS}
      >

        <Flex
          position="absolute"
          minHeight={BLOG_MIN_HEIGHTS}
          zIndex={1}
          bg={TYPES[event.league]}
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={BLOG_MIN_HEIGHTS}
          alignItems="center"
          justifyContent="center"
          zIndex={2}
        >
          <Container maxWidth={rem(960)} textAlign="center" px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
            <Icon src={event.icon} alt={`${event.name} logo`} />
          </Container>
        </Flex>
      </Box>

      <Box
        as="section"
        position="relative"
        backgroundColor="white"
        color="primary"
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        py={{ _: 'gutter._', s: 3, m: 4 }}
      >
        <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
          <Flex flexDirection="column">
            <Heading as="h1" fontSize={[4, 5]} isBody marginTop="0" marginBottom="2">{event.name}</Heading>

            {event.start_time && (<Time>{format(parseTimestamptz(event.start_time), 'EEE, d LLL H:mm a')} – {format(parseTimestamptz(event.end_time), 'EEE, d LLL H:mm a')}</Time>)}
            <Flex alignItems="center">
              <LocationIcon />{' '}
              <LocationLink
                href={`https://www.google.com/maps/search/?api=1&query=${event.location?.coordinates[1]},${event.location?.coordinates[0]}`}
                rel="noopener noreferrer"
                target="_blank"
                linkColor="primary"
              >
                {event.venue}
              </LocationLink>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Box
        bg="greyLight"
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        py={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
          <Content>{parse(event.description)}</Content>

          <Flex flexDirection="column" justifyContent="center" alignItems="center" padding="3">
            {event.registerLink && new Date() < parseTimestamptz(event.registerTime) && (<ExternalLink href={event.registerLink}><Button type="button" variant="primary" width="1">Register</Button></ExternalLink>)}
          </Flex>
        </Container>
      </Box>

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
    description: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    venue: PropTypes.string,
    icon: PropTypes.string,
    league: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape,
    registerLink: PropTypes.string,
    registerTime: PropTypes.string,
  }).isRequired,
};

export default EventPage;
