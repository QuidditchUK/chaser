import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import styled from '@emotion/styled';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { TYPES } from 'components/club-type';
import { parseTimestamptz } from 'modules/dates';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { rem } from 'styles/theme';
import { api } from 'modules/api';

const Page404 = dynamic(() => import('pages/404'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Content = dynamic(() => import('components/content'));
const Button = dynamic(() => import('components/button'));
const ExternalLink = dynamic(() => import('components/external-link'));
const PinIcon = dynamic(() => import('public/images/location-pin.svg'));

const Icon = styled.img`
  height: 100px;
  width: 100px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
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
  color: ${({ theme }) => theme.colors.qukBlue};
  border-bottom: 2px dotted ${({ theme }) => theme.colors.qukBlue};
`;

const Time = styled.span`
  color: ${({ theme }) => theme.colors.monarchRed};
  font-weight: bold;
`;

const EventPage = ({ event }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <PageLoading />;
  }

  if (!event) {
    return <Page404 />;
  }

  const location = JSON.parse(event.coordinates);

  return (
    <>
      <Meta
        description={`${event.name} on ${format(
          parseTimestamptz(event.start_time),
          'EEE, d LLL'
        )}`}
        subTitle={event.name}
        image={event.images[0]}
      />

      <Box
        as="section"
        position="relative"
        backgroundImage={`url(${event.images[0]})`}
        backgroundColor="qukBlue"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        <Flex
          position="absolute"
          minHeight={BLOG_MIN_HEIGHTS}
          bg={TYPES[event.league[0]]}
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={BLOG_MIN_HEIGHTS}
          alignItems="center"
          justifyContent="center"
        >
          <Container
            maxWidth={rem(960)}
            textAlign="center"
            px={{ base: 4, sm: 8, md: 9 }}
          >
            <Icon src={event.icon} alt={`${event.name} logo`} />
          </Container>
        </Flex>
      </Box>

      <Box
        as="section"
        position="relative"
        backgroundColor="white"
        color="qukBlue"
        px={{ base: 4, sm: 8, md: 9 }}
        py={{ base: 4, sm: 3, md: 4 }}
      >
        <Container px={{ base: 4, sm: 8, md: 9 }}>
          <Flex flexDirection="column">
            <Heading
              as="h1"
              fontSize="4xl"
              fontFamily="body"
              marginTop="0"
              marginBottom="2"
            >
              {event.name}
            </Heading>

            {event.start_time && (
              <Time>
                {format(
                  parseTimestamptz(event.start_time),
                  'EEE, d LLL h:mm a'
                )}{' '}
                –{' '}
                {format(parseTimestamptz(event.end_time), 'EEE, d LLL h:mm a')}
              </Time>
            )}
            <Flex alignItems="center">
              <LocationIcon />{' '}
              <LocationLink
                href={`https://www.google.com/maps/search/?api=1&query=${location?.coordinates[1]},${location?.coordinates[0]}`}
                rel="noopener noreferrer"
                target="_blank"
                linkColor="qukBlue"
              >
                {event.venue}
              </LocationLink>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Box
        bg="greyLight"
        px={{ base: 4, sm: 8, md: 9 }}
        py={{ base: 4, sm: 8, md: 9 }}
      >
        <Container px={{ base: 4, sm: 8, md: 9 }}>
          <Content>{parse(event.description)}</Content>

          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding="3"
          >
            {event.registerLink &&
              new Date() < parseTimestamptz(event.registerTime) && (
                <ExternalLink href={event.registerLink}>
                  <Button type="button" variant="qukBlue" width="1">
                    Register
                  </Button>
                </ExternalLink>
              )}
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

export default EventPage;
