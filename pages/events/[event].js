import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { Box, Flex } from 'components/layout';
import { TYPES } from 'components/club-type';
import { parseTimestamptz } from 'modules/dates';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { rem } from 'styles/theme';
import { api } from 'modules/api';

const Page404 = dynamic(() => import('pages/404'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Heading = dynamic(() => import('components/heading'));
const Content = dynamic(() => import('components/content'));
const Button = dynamic(() => import('components/button'));
const ExternalLink = dynamic(() => import('components/external-link'));
const PinIcon = dynamic(() => import('public/images/location-pin.svg'));

const Icon = styled.img`
  height: 100px;
  width: 100px;

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

  const location = JSON.parse(event.coordinates);

  return (
    <>
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
          bg={TYPES[event.league[0]]}
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

            {event.start_time && (<Time>{format(parseTimestamptz(event.start_time), 'EEE, d LLL h:mm a')} – {format(parseTimestamptz(event.end_time), 'EEE, d LLL h:mm a')}</Time>)}
            <Flex alignItems="center">
              <LocationIcon />{' '}
              <LocationLink
                href={`https://www.google.com/maps/search/?api=1&query=${location?.coordinates[1]},${location?.coordinates[0]}`}
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

    </>
  );
};

// eslint-disable-next-line no-unused-vars
export const getServerSideProps = async ({ params: { event } }) => {
  const { data } = await api.get(`/events/${event}`);

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
    league: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape,
    registerLink: PropTypes.string,
    registerTime: PropTypes.string,
    coordinates: PropTypes.shape,
  }).isRequired,
};

export default EventPage;
