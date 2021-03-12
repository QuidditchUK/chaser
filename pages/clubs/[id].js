import { RichText } from 'prismic-reactjs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import get from 'just-safe-get';
import {
  linkResolver,
  getDocs,
  getPrismicDocByUid,
  getBlogTags,
} from 'modules/prismic';
import { formatOrdinals } from 'modules/numbers';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Table,
  Td as ChakraTd,
  Tr,
  Th as ChakraTh,
  Tbody,
  Thead,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';

const HeroWithLocation = dynamic(() => import('components/hero-with-location'));
const Content = dynamic(() => import('components/content'));
const SchemaClub = dynamic(() => import('components/schema-club'));
const ClubNews = dynamic(() => import('components/club-news'));

const FacebookIcon = dynamic(() => import('public/images/facebook.svg'));
const TwitterIcon = dynamic(() => import('public/images/twitter.svg'));
const InstagramIcon = dynamic(() => import('public/images/instagram.svg'));
const YoutubeIcon = dynamic(() => import('public/images/youtube.svg'));

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Meta = dynamic(() => import('components/meta'));

const Icon = (props) => (
  <Box color="greyDark" height="30px" width="30px" {...props} />
);
const Td = (props) => <ChakraTd p={1} {...props} />;
const Th = (props) => (
  <ChakraTh
    textAlign="left"
    p={1}
    textTransform="normal"
    fontFamily="body"
    fontWeight="normal"
    fontSize="sm"
    {...props}
  />
);

const ClubPage = ({ page: initialPage, posts: initialPosts }) => {
  const router = useRouter();
  const { data: page } = useQuery(
    ['clubs', router.query.id],
    () => getPrismicDocByUid('clubs', router.query.id),
    { initialData: initialPage }
  );
  const { data: posts } = useQuery(
    ['posts', router.query.id],
    () =>
      getBlogTags(page.tags, { orderings: '[my.post.date desc]', pageSize: 3 }),
    { initialData: initialPosts }
  );

  if (router.isFallback) {
    return <PageLoading />;
  }

  if (!page) {
    return <Page404 />;
  }

  const club = get(page, 'data');

  return (
    <>
      <Meta
        description={`Club page of ${club.club_name} with all their latest news, results and details`}
        subTitle={club.club_name}
        image={club.images?.[0]?.image?.url}
      />
      <SchemaClub club={club} />

      <HeroWithLocation
        images={club.images}
        club_name={club.club_name}
        venue={club.venue}
        featuredColor={club.featured_color}
        textColor={club.text_color}
        icon={club.icon}
        league={club.league}
        coordinates={club.coordinates}
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
              color={club.featured_color}
            >
              Club Details
            </Heading>

            <Table mx={0} variant="unstyled">
              {club.trainings && (
                <Tr>
                  <Td fontWeight="bold">Trainings</Td>
                  <Td>{club.trainings}</Td>
                </Tr>
              )}

              <Tr>
                <Td fontWeight="bold">League</Td>
                <Td>{club.league}</Td>
              </Tr>

              <Tr>
                <Td fontWeight="bold">{club.leader_position}</Td>
                <Td>{club.leader}</Td>
              </Tr>

              {club?.official_website?.url && (
                <Tr>
                  <Td fontWeight="bold">Official Website</Td>
                  <Td>
                    <ChakraLink
                      href={club?.official_website?.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      color={club.featured_color}
                      wordBreak="break-all"
                    >
                      {club?.official_website?.url}
                    </ChakraLink>
                  </Td>
                </Tr>
              )}
              {club?.email && (
                <Tr>
                  <Td fontWeight="bold">Email</Td>
                  <Td>
                    <ChakraLink
                      href={`mailto:${club?.email}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      color={club.featured_color}
                      wordBreak="break-all"
                    >
                      {club?.email}
                    </ChakraLink>
                  </Td>
                </Tr>
              )}
            </Table>

            <Flex justifyContent={{ base: 'center', md: 'flex-start' }} mt={5}>
              {club?.social_facebook?.url && (
                <ChakraLink
                  aria-label={`Like ${club.club_name} on Facebook`}
                  href={club?.social_facebook?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    as={FacebookIcon}
                    _hover={{ color: club.featured_color }}
                  />
                </ChakraLink>
              )}

              {club?.social_twitter?.url && (
                <ChakraLink
                  aria-label={`Follow ${club.club_name} on Twitter`}
                  href={club?.social_twitter?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ base: 5, md: 3 }}
                  featuredColor={club.featured_color}
                >
                  <Icon
                    as={TwitterIcon}
                    _hover={{ color: club.featured_color }}
                  />
                </ChakraLink>
              )}

              {club?.social_instagram?.url && (
                <ChakraLink
                  aria-label={`Follow ${club.club_name} on Instagram`}
                  href={club?.social_instagram?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ base: 5, md: 3 }}
                >
                  <Icon
                    as={InstagramIcon}
                    _hover={{ color: club.featured_color }}
                  />
                </ChakraLink>
              )}

              {club?.social_youtube?.url && (
                <ChakraLink
                  aria-label={`Subscribe to ${club.club_name} Youtube Channel`}
                  href={club.social_youtube?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ base: 5, md: 3 }}
                >
                  <Icon
                    as={YoutubeIcon}
                    _hover={{ color: club.featured_color }}
                  />
                </ChakraLink>
              )}
            </Flex>

            {!club.active && (
              <Text color="greyDark" fontSize="xs">
                This club is currently inactive, if you are interested in
                restarting it contact our{' '}
                <a href={`mailto:teams@quidditchuk.org?subject=${club.name}`}>
                  Teams Director
                </a>
              </Text>
            )}
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
                color={club.featured_color}
              >
                About {club.club_name}
              </Heading>
              {RichText.asText(club.description) && (
                <Content>
                  {RichText.render(club.description, linkResolver)}
                </Content>
              )}

              {!!posts.length && (
                <>
                  <Heading
                    as="h3"
                    fontSize="xl"
                    fontFamily="body"
                    color={club.featured_color}
                  >
                    Latest News
                  </Heading>
                  <ClubNews
                    posts={posts}
                    bgColor={club.featured_color}
                    color={club.text_color}
                  />
                </>
              )}

              {club.tournament_results.length !== 0 ? (
                <>
                  <Heading
                    as="h3"
                    fontSize="xl"
                    fontFamily="body"
                    color={club.featured_color}
                  >
                    Club Achievements
                  </Heading>

                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Position</Th>
                        <Th>Season</Th>
                        <Th>Tournament</Th>
                        <Th>Team</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {club?.tournament_results?.map((result) => (
                        <Tr
                          key={`${club.club_name}_${result.team_name}_${result.tournament_name}_${result.season}`}
                        >
                          <Td>
                            {result.position}
                            {formatOrdinals(result.position)}
                          </Td>
                          <Td>{result.season}</Td>
                          <Td>{result.tournament_name}</Td>
                          <Td>{result.team_name}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </>
              ) : null}
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
    (await getPrismicDocByUid('clubs', id, ref ? { ref } : null)) || null;
  const posts = await getBlogTags(page.tags, {
    orderings: '[my.post.date desc]',
    pageSize: 3,
  });

  return {
    props: { page, preview, posts },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('clubs');

  return {
    paths: allPages?.map(({ uid }) => `/clubs/${uid}`),
    fallback: true,
  };
};

export default ClubPage;
