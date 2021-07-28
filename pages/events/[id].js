import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import format from 'date-fns/format';
import isFuture from 'date-fns/isFuture';
import differenceInDays from 'date-fns/differenceInDays';
import { RichText } from 'prismic-reactjs';
import { useQuery } from 'react-query';
import get from 'just-safe-get';
import { linkResolver, getDocs, getPrismicDocByUid } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';
import {
  Box,
  Grid,
  Heading,
  Table,
  Td as ChakraTd,
  Tr,
  Tbody,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { TYPES } from 'components/club-type';

const HeroWithLocation = dynamic(() => import('components/hero-with-location'));
const Page404 = dynamic(() => import('pages/404'));
const Meta = dynamic(() => import('components/meta'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Content = dynamic(() => import('components/content'));
const Button = dynamic(() => import('components/button'));
const ExternalLink = dynamic(() => import('components/external-link'));

const Td = (props) => (
  <ChakraTd p={1} fontSize={{ base: 'sm', md: 'md' }} {...props} />
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
        image={event?.images?.[0]?.image?.url}
      />

      <HeroWithLocation
        images={event.images}
        title={event.event_name}
        venue={event.venue}
        featuredColor={TYPES[event.leagues?.[0]?.league]}
        textColor="white"
        icon={event.icon}
        leagues={event.leagues.map(({ league }) => league)}
        coordinates={event.coordinates}
        startDate={event.event_start_date}
        endDate={event.event_end_date}
      />

      <Box bg="greyLight" py={0} px={0}>
        <Grid
          templateColumns={{ base: '1fr', lg: '3fr 10fr' }}
          gap={{ base: 4, lg: 9 }}
          mt={0}
        >
          <Box
            bg="white"
            py={{ base: 6, md: 10 }}
            px={{ base: 4, sm: 8, md: 9 }}
          >
            <Heading
              as="h3"
              fontSize="xl"
              fontFamily="body"
              color={TYPES[event?.leagues?.[0]?.league]}
            >
              Event Details
            </Heading>

            <Table mx={0} variant="unstyled">
              <Tbody>
                <Tr>
                  <Td fontWeight="bold">Length</Td>
                  <Td>
                    {event.event_end_date
                      ? `${
                          differenceInDays(
                            new Date(event.event_end_date),
                            new Date(event.event_start_date)
                          ) + 1
                        } day${
                          differenceInDays(
                            new Date(event.event_end_date),
                            new Date(event.event_start_date)
                          ) >= 1
                            ? 's'
                            : ''
                        }`
                      : '1 day'}
                  </Td>
                </Tr>

                <Tr>
                  <Td fontWeight="bold">Location</Td>
                  <Td>{event.venue}</Td>
                </Tr>

                <Tr>
                  <Td fontWeight="bold">
                    League{event.leagues?.length > 1 ? 's' : ''}
                  </Td>
                  <Td>
                    {event.leagues.map(({ league }) => league).join(', ')}
                  </Td>
                </Tr>
                {event?.social_facebook?.url && (
                  <Tr>
                    <Td fontWeight="bold">Facebook event</Td>
                    <Td>
                      <ChakraLink
                        href={event?.social_facebook?.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        color={TYPES[event?.leagues?.[0]?.league]}
                        wordBreak="break-all"
                      >
                        Link
                      </ChakraLink>
                    </Td>
                  </Tr>
                )}

                <Tr>
                  <Td fontWeight="bold">QUK Membership Required?</Td>
                  <Td>{event.quk_membership_required ? 'Yes' : 'No'}</Td>
                </Tr>
              </Tbody>
            </Table>

            <Heading
              as="h3"
              fontSize="xl"
              fontFamily="body"
              color={TYPES[event?.leagues?.[0]?.league]}
            >
              Fees
            </Heading>

            <Table mx={0} variant="unstyled">
              <Tbody>
                {event.player_fee && (
                  <Tr>
                    <Td fontWeight="bold">Player Fee</Td>
                    <Td>£{event.player_fee}</Td>
                  </Tr>
                )}

                {event.team_fee && (
                  <Tr>
                    <Td fontWeight="bold">Team Fee</Td>
                    <Td>£{event.team_fee}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>

            <Heading
              as="h3"
              fontSize="xl"
              fontFamily="body"
              color={TYPES[event?.leagues?.[0]?.league]}
            >
              Registration
            </Heading>
            <Table mx={0} variant="unstyled">
              <Tbody>
                {event.club_registration_deadline && (
                  <>
                    <Tr>
                      <Td fontWeight="bold">Club Deadline</Td>
                      <Td>
                        {format(
                          new Date(event.club_registration_deadline),
                          'MMMM d, yyyy'
                        )}
                      </Td>
                    </Tr>
                    <Tr mb={4}>
                      <Td colSpan="2" textAlign="center">
                        {event.club_registration_link?.url &&
                          isFuture(
                            new Date(event.club_registration_deadline)
                          ) && (
                            <ExternalLink
                              href={event.club_registration_link?.url}
                            >
                              <Button type="button" variant="primary">
                                Club Registration
                              </Button>
                            </ExternalLink>
                          )}
                      </Td>
                    </Tr>
                  </>
                )}

                {event.player_registration_deadline && (
                  <>
                    <Tr>
                      <Td fontWeight="bold">Individual Deadline</Td>
                      <Td>
                        {format(
                          new Date(event.player_registration_deadline),
                          'MMMM d, yyyy'
                        )}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan="2" textAlign="center">
                        {event.player_registration_link?.url &&
                          isFuture(
                            new Date(event.player_registration_deadline)
                          ) && (
                            <ExternalLink
                              href={event.player_registration_link?.url}
                            >
                              <Button type="button" variant="primary">
                                Individual Registration
                              </Button>
                            </ExternalLink>
                          )}
                      </Td>
                    </Tr>
                  </>
                )}
              </Tbody>
            </Table>
          </Box>

          <Box
            py={{ base: 3, md: 9 }}
            pr={{ base: 4, sm: 8, md: 9 }}
            pl={{ base: 4, sm: 8, md: 0 }}
          >
            <Box
              bg="white"
              pt={2}
              pb={4}
              px={{ base: 4, sm: 8, md: 9 }}
              borderRadius="md"
            >
              <Heading
                as="h3"
                fontSize="xl"
                fontFamily="body"
                color={TYPES[event?.leagues?.[0]?.league]}
              >
                About {event.event_name}
              </Heading>
              {RichText.asText(event.description) && (
                <Content>
                  <RichText
                    render={event.description}
                    linkResolver={linkResolver}
                  />
                </Content>
              )}

              <Box
                mr={{ base: '-1rem', sm: '-2rem', md: '-2.25rem' }}
                ml={{ base: '-1rem', sm: '-2rem', md: '-2.25rem' }}
              >
                {renderPrismicSections(event?.body)}
              </Box>
            </Box>
          </Box>
        </Grid>
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
