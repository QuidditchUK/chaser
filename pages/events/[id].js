import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import format from 'date-fns/format';
import { RichText } from 'prismic-reactjs';
import { useQuery } from 'react-query';
import get from 'just-safe-get';
import { linkResolver, getDocs, getPrismicDocByUid } from 'modules/prismic';
import { Box, Flex } from '@chakra-ui/react';
import theme from 'styles/theme';

const HeroWithLocation = dynamic(() => import('components/hero-with-location'));
const Page404 = dynamic(() => import('pages/404'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Content = dynamic(() => import('components/content'));
// const Button = dynamic(() => import('components/button'));
// const ExternalLink = dynamic(() => import('components/external-link'));

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

      <HeroWithLocation
        images={event.images}
        title={event.event_name}
        venue={event.venue}
        featuredColor="white"
        textColor={theme.colors.qukBlue}
        icon={event.icon}
        leagues={event.leagues.map(({ league }) => league)}
        coordinates={event.coordinates}
        startDate={event.event_start_date}
        endDate={event.event_end_date}
      />

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
