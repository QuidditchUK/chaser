import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import format from 'date-fns/format';
import { RichText } from 'prismic-reactjs';
import { useQuery } from 'react-query';
import get from 'just-safe-get';
import { linkResolver, getDocs, getPrismicDocByUid } from 'modules/prismic';
import {
  Box,
  Flex,
  Heading,
  Image as ChakraImage,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';
import { TYPES } from 'components/club-type';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { rem } from 'styles/theme';

const Page404 = dynamic(() => import('pages/404'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Content = dynamic(() => import('components/content'));
// const Button = dynamic(() => import('components/button'));
// const ExternalLink = dynamic(() => import('components/external-link'));
const PinIcon = dynamic(() => import('public/images/location-pin.svg'));

const Icon = (props) => (
  <ChakraImage
    height={{ base: '100px', md: '200px' }}
    width={{ base: '100px', md: '200px' }}
    {...props}
  />
);

const EventPage = ({ page: initialPage, preview }) => {
  const router = useRouter();
  const { data: queryData } = useQuery(
    ['clubs', router.query.id],
    () => getPrismicDocByUid('events', router.query.id),
    { initialData: initialPage, enabled: Boolean(!router.isFallback) }
  );

  const page = preview ? initialPage : queryData;

  if (router.isFallback && !queryData) {
    return <PageLoading />;
  }

  if (!queryData && !preview) {
    return <Page404 />;
  }

  const event = get(page, 'data');

  return (
    <>
      <Meta
        description={`${event.event_name} on ${format(
          new Date(event.event_start_date),
          'MMMM d, yyyy'
        )}`}
        subTitle={event.event_name}
        image={event.images?.[0].image.url}
      />

      <Box
        as="section"
        position="relative"
        backgroundImage={`url(${event.images?.[0].image.url})`}
        backgroundColor="qukBlue"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        <Flex
          position="absolute"
          minHeight={BLOG_MIN_HEIGHTS}
          bg={TYPES[event.leagues[0].league]}
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
            <Icon src={event.icon.url} alt={`${event.event_name} logo`} />
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
              {event.event_name}
            </Heading>

            {event.event_start_date && (
              <Text as="span" fontWeight="bold" color="monarchRed">
                {format(new Date(event.event_start_date), 'MMMM d, yyyy')}{' '}
                {event.event_start_date !== event.event_end_date && (
                  <>
                    {' '}
                    - {format(new Date(event.event_end_date), 'MMMM d, yyyy')}
                  </>
                )}
              </Text>
            )}
            <Flex alignItems="center">
              <ChakraImage as={PinIcon} height="15px" width="15px" />{' '}
              <ChakraLink
                p={1}
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                color="qukBlue"
                borderBottom="2px dotted"
                borderColor="qukBlue"
                href={`https://www.google.com/maps/search/?api=1&query=${event.coordinates.latitude},${event.coordinates.longitude}`}
                rel="noopener noreferrer"
                target="_blank"
                linkColor="qukBlue"
              >
                {event.venue}
              </ChakraLink>
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
          {RichText.asText(event.description) && (
            <Content>
              <RichText
                render={event.description}
                linkResolver={linkResolver}
              />
            </Content>
          )}

          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding="3"
          >
            {/* {event.registerLink &&
              new Date() < parseTimestamptz(event.registerTime) && (
                <ExternalLink href={event.registerLink}>
                  <Button type="button" variant="qukBlue" width="1">
                    Register
                  </Button>
                </ExternalLink>
              )} */}
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export const getStaticProps = async ({
  params: { id },
  preview = null,
  previewData = {},
}) => {
  const { ref } = previewData;
  const page =
    (await getPrismicDocByUid('events', id, ref ? { ref } : null)) || null;

  return {
    props: { page, preview },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('events', { pageSize: 100 });

  return {
    paths: allPages?.map(({ uid }) => `/events/${uid}`),
    fallback: true,
  };
};

export default EventPage;
