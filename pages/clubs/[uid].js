import { RichText } from 'prismic-reactjs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';

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
  Image as ChakraImage,
  Text,
} from '@chakra-ui/react';

const HeroWithLocation = dynamic(() =>
  import('components/clubsEvents/hero-with-location')
);
const Content = dynamic(() => import('components/shared/content'));
const SchemaClub = dynamic(() => import('components/clubsEvents/schema-club'));
const ClubNews = dynamic(() => import('components/clubsEvents/club-news'));

const FacebookIcon = dynamic(() => import('public/images/facebook.svg'));
const TwitterIcon = dynamic(() => import('public/images/twitter.svg'));
const InstagramIcon = dynamic(() => import('public/images/instagram.svg'));
const YoutubeIcon = dynamic(() => import('public/images/youtube.svg'));

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/shared/page-loading'));
const Meta = dynamic(() => import('components/shared/meta'));

const Icon = (props) => (
  <Box color="greyDark" height="30px" width="30px" {...props} />
);
const Td = (props) => (
  <ChakraTd p={1} fontSize={{ base: 'sm', md: 'md' }} {...props} />
);
const Th = (props) => (
  <ChakraTh
    textAlign="left"
    p={1}
    textTransform="normal"
    fontFamily="body"
    fontWeight="normal"
    fontSize={{ base: 'xs', md: 'sm' }}
    {...props}
  />
);

const ClubPage = ({ page: initialPage, posts: initialPosts, preview }) => {
  const router = useRouter();
  const { data: queryData } = useQuery(
    ['clubs', router.query.uid],
    () => getPrismicDocByUid('clubs', router.query.uid),
    { initialData: initialPage, enabled: Boolean(!router.isFallback) }
  );
  const { data: posts } = useQuery(
    ['posts', router.query.uid],
    () =>
      getBlogTags(page?.tags, {
        orderings: '[my.post.date desc]',
        pageSize: 3,
      }),
    { initialData: initialPosts, enabled: Boolean(queryData) }
  );

  const page = preview ? initialPage : queryData;

  if (router.isFallback && !queryData) {
    return <PageLoading />;
  }

  if (!queryData && !preview) {
    return <Page404 />;
  }

  const { data: club } = page;

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
        title={club.club_name}
        venue={club.venue}
        featuredColor={club.featured_color}
        textColor={club.text_color}
        icon={club.icon}
        leagues={[club.league]}
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
              <Tbody>
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
              </Tbody>
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
                  <RichText
                    render={club.description}
                    linkResolver={linkResolver}
                  />
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

                    <Tbody bg="gray.50">
                      {club?.tournament_results?.map((result) => (
                        <Tr
                          key={`${club.club_name}_${result.team_name}_${result.tournament_name}_${result.season}`}
                        >
                          <Td>
                            <Flex
                              direction={{ base: 'column', md: 'row' }}
                              alignItems="center"
                            >
                              {result?.medal_icon?.url && (
                                <ChakraImage
                                  src={result.medal_icon.url}
                                  alt={`Medal: ${
                                    result.position
                                  }${formatOrdinals(result.position)} ${
                                    result.team_name
                                  } ${result.tournament_name} ${result.season}`}
                                  height="30px"
                                  width="30px"
                                  sx={{
                                    filter:
                                      'drop-shadow(0px 0px 2px rgba(0, 0, 0, .3))',
                                  }}
                                />
                              )}
                              <Box>
                                {result.position}
                                {formatOrdinals(result.position)}
                              </Box>
                            </Flex>
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
  params: { uid },
  preview = null,
  previewData = {},
}) => {
  const { ref } = previewData;
  const page =
    (await getPrismicDocByUid('clubs', uid, ref ? { ref } : null)) || null;

  if (page?.tags) {
    const posts = await getBlogTags(page?.tags, {
      orderings: '[my.post.date desc]',
      pageSize: 3,
    });

    return {
      props: { page, preview, posts },
      revalidate: 1,
    };
  }

  return {
    props: { page, preview },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('clubs', { pageSize: 100 });

  return {
    paths: allPages?.map(({ uid }) => `/clubs/${uid}`),
    fallback: true,
  };
};

export default ClubPage;
