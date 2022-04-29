import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import format from 'date-fns/format';
import { RichText } from 'prismic-reactjs';
import { useQuery } from 'react-query';
import { linkResolver, getDocs, getPrismicDocByUid } from 'modules/prismic';

import { Box, Grid, Heading, Image as ChakraImage } from '@chakra-ui/react';
import GoogleMapReact from 'google-map-react';
import { TYPES } from 'components/clubsEvents/league-type';
import PrismicSlice from 'components/prismic';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';

const HeroWithLocation = dynamic(() =>
  import('components/clubsEvents/hero-with-location')
);

const Slice = dynamic(() => import('components/shared/slice'));

const Page404 = dynamic(() => import('pages/404'));
const Meta = dynamic(() => import('components/shared/meta'));
const PageLoading = dynamic(() => import('components/shared/page-loading'));
const Content = dynamic(() => import('components/shared/content'));

const EventPage = ({ page: initialPage, preview }) => {
  const router = useRouter();
  const { data: queryData } = useQuery(
    ['clubs', router.query.uid],
    () => getPrismicDocByUid('events', router.query.uid),
    { initialData: initialPage, enabled: Boolean(!router.isFallback) }
  );

  const page = preview ? initialPage : queryData;

  if (router.isFallback && !queryData) {
    return <PageLoading />;
  }

  if (!queryData && !preview) {
    return <Page404 />;
  }

  const { data: event } = page;

  return (
    <>
      <Meta
        description={`${event.event_name} on ${format(
          new Date(event.event_start_date),
          'MMMM d, yyyy'
        )}`}
        subTitle={event.event_name}
        image={event?.images?.[0]?.image?.url}
      />

      <HeroWithLocation
        images={event.images}
        title={event.event_name}
        venue={event.venue}
        featuredColor={TYPES[event.leagues?.[0]?.league]}
        icon={event.icon}
        leagues={event.leagues.map(({ league }) => league)}
        coordinates={event.coordinates}
        startDate={event.event_start_date}
        endDate={event.event_end_date}
      />

      <Slice>
        <Grid
          gridTemplateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gridGap={{ base: 4, md: 9 }}
        >
          <Box borderRadius="lg" bg="white" p={4}>
            <Heading
              as="h3"
              fontSize="xl"
              color="qukBlue"
              mt={0}
              fontFamily="body"
              mb={4}
            >
              About {event?.event_name}
            </Heading>
            {RichText.asText(event.description) && (
              <Content color="qukBlue">
                <RichText
                  render={event.description}
                  linkResolver={linkResolver}
                />
              </Content>
            )}
          </Box>

          <Box borderRadius="lg" bg="white" p={4}>
            <Heading
              as="h3"
              fontSize="xl"
              color="qukBlue"
              fontFamily="body"
              mt={0}
              mb={4}
            >
              Registration details
            </Heading>
            <DescriptionList>
              <Description
                term="QUK Membership Required"
                description={event.quk_membership_required ? 'Yes' : 'No'}
              />
              <Description
                term="Individual Registration Deadline"
                description={format(
                  new Date(event.individual_registration_deadline),
                  'MMMM d, yyyy'
                )}
              />
              <Description
                term="Individual Fee"
                description={`£${event.player_fee}`}
              />
              <Description
                term="Team Registration Deadline"
                description={format(
                  new Date(event.club_registration_deadline),
                  'MMMM d, yyyy'
                )}
              />
              <Description term="Team Fee" description={`£${event.team_fee}`} />
            </DescriptionList>

            <Box width="100%" h="250px" mt={4}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_MAPS_API_KEY }}
                defaultCenter={{
                  lat: event?.coordinates?.latitude,
                  lng: event?.coordinates?.longitude,
                }}
                defaultZoom={14}
              >
                <ChakraImage
                  src={event?.icon?.url}
                  alt={`${event?.event_name} logo`}
                  height="30px"
                  width="30px"
                  lat={event?.coordinates?.latitude}
                  lng={event?.coordinates?.longitude}
                  transform="translate(-50%, -50%)"
                />
              </GoogleMapReact>
            </Box>
          </Box>
        </Grid>
      </Slice>

      <PrismicSlice sections={event?.body} />
    </>
  );
};

export const getStaticProps = async ({
  params: { uid },
  preview = null,
  previewData = {},
}) => {
  const { ref } = previewData;
  const page =
    (await getPrismicDocByUid('events', uid, ref ? { ref } : null)) || null;

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
