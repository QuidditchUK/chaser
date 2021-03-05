import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  space,
  typography,
  color,
  border,
} from 'styled-system';
import { RichText } from 'prismic-reactjs';
import { useRouter } from 'next/router';
import get from 'just-safe-get';
import dynamic from 'next/dynamic';
import {
  linkResolver, getDocs, getPrismicDocByUid, getBlogTags,
} from 'modules/prismic';
import { formatOrdinals } from 'modules/numbers';
import { Box, Flex, Grid } from 'components/layout';

const Heading = dynamic(() => import('components/heading'));
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

const SocialIcon = styled.a`
  ${space};

  svg {
      color: ${({ theme }) => theme.colors.greyDark};
      height: 30px;
      width: 30px;
    }

    &:hover {
      svg {
        color: ${({ featuredColor }) => featuredColor};
      }
    }
`;

const Table = styled.table`
  ${typography};
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
`;

const TableData = styled.td`
  padding: ${({ theme }) => theme.space[1]};
`;

const TableRow = styled.tr`
  border-collapse: separate;
  border-spacing: 0;
  vertical-align: top;
`;

const TableDataBorder = styled(TableData)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  ${border};
`;

const TableHead = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[1]};
  border-bottom-style: solid;
  border-bottom-width: 3px;
`;

const Support = styled.p`
  color: ${({ theme }) => theme.colors.greyDark};
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
`;

const StyledLink = styled.a`
  word-break: break-all;
  ${color};
`;

const ClubPage = ({ page, posts }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (<PageLoading />);
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
        image={club.images?.[0]?.url}
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

      <Box
        bg="greyLight"
        py={0}
        px={0}
      >
        <Grid
          gridTemplateColumns={{ _: '1fr', l: '1fr 3fr' }}
          gridGap={{ _: 'gutter._', l: 'gutter.m' }}
          mt={0}
        >
          <Box bg="white" py={{ _: 6, m: 10 }} px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
            <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color}>Club Details</Heading>

            <Table>
              <tbody>
                {club.trainings && (
                  <TableRow>
                    <TableData><strong>Trainings</strong></TableData>
                    <TableData>{club.trainings}</TableData>
                  </TableRow>
                )}

                <TableRow>
                  <TableData><strong>League</strong></TableData>
                  <TableData>{club.league}</TableData>
                </TableRow>

                <TableRow>
                  <TableData><strong>{club.leader_position}</strong></TableData>
                  <TableData>{club.leader}</TableData>
                </TableRow>

                {club?.official_website?.url && (
                  <TableRow>
                    <TableData><strong>Official Website</strong></TableData>
                    <TableData><StyledLink href={club?.official_website?.url} rel="noopener noreferrer" target="_blank" color={club.featured_color}>{club?.official_website?.url}</StyledLink></TableData>
                  </TableRow>
                )}
                {club?.email && (
                  <TableRow>
                    <TableData><strong>Email</strong></TableData>
                    <TableData><StyledLink href={`mailto:${club?.email}`} rel="noopener noreferrer" target="_blank" color={club.featured_color}>{club?.email}</StyledLink></TableData>
                  </TableRow>
                )}
              </tbody>
            </Table>

            <Flex justifyContent={{ _: 'center', m: 'flex-start' }} mt={5}>
              {club?.social_facebook?.url && (
                <SocialIcon
                  aria-label={`Like ${club.club_name} on Facebook`}
                  href={club?.social_facebook?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  featuredColor={club.featured_color}
                >
                  <FacebookIcon />
                </SocialIcon>
              )}

              {club?.social_twitter?.url && (
                <SocialIcon
                  aria-label={`Follow ${club.club_name} on Twitter`}
                  href={club?.social_twitter?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
                  featuredColor={club.featured_color}
                >
                  <TwitterIcon />
                </SocialIcon>
              )}

              {club?.social_instagram?.url && (
                <SocialIcon
                  aria-label={`Follow ${club.club_name} on Instagram`}
                  href={club?.social_instagram?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
                  featuredColor={club.featured_color}
                >
                  <InstagramIcon />
                </SocialIcon>
              )}

              {club?.social_youtube?.url && (
                <SocialIcon
                  aria-label={`Subscribe to ${club.club_name} Youtube Channel`}
                  href={club.social_youtube?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
                  featuredColor={club.featured_color}
                >
                  <YoutubeIcon />
                </SocialIcon>
              )}
            </Flex>

            {!club.active && <Support>This club is currently inactive, if you are interested in restarting it contact our <a href={`mailto:teams@quidditchuk.org?subject=${club.name}`}>Teams Director</a></Support>}

            {club.tournament_results.length !== 0 ? (
              <>
                <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color}>Club Achievements</Heading>

                <Table fontSize="1">
                  <thead>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead>Tournament</TableHead>
                      <TableHead>Team</TableHead>
                    </TableRow>
                  </thead>

                  <tbody>
                    {club?.tournament_results?.map((result) => (
                      <TableRow key={`${club.club_name}_${result.team_name}_${result.tournament_name}_${result.season}`}>
                        <TableDataBorder>{result.position}{formatOrdinals(result.position)}</TableDataBorder>
                        <TableDataBorder>{result.season}</TableDataBorder>
                        <TableDataBorder>{result.tournament_name}</TableDataBorder>
                        <TableDataBorder>{result.team_name}</TableDataBorder>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : null}
          </Box>

          <Box py={{ _: 3, m: 9 }} paddingRight={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }} paddingLeft={{ _: 'gutter._', s: 'gutter.s', m: 0 }}>
            <Box bg="white" py={3} px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }} borderRadius={1}>
              <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color} paddingTop="2">About {club.name}</Heading>
              {RichText.asText(club.description) && (<Content>{RichText.render(club.description, linkResolver)}</Content>)}

              {!!posts.length && (
                <>
                  <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color}>Latest News</Heading>
                  <ClubNews posts={posts} bgColor={club.featured_color} color={club.text_color} />
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export const getStaticProps = async ({ params: { id }, preview = null, previewData = {} }) => {
  const { ref } = previewData;
  const page = await getPrismicDocByUid('clubs', id, ref ? { ref } : null) || null;
  const posts = await getBlogTags(page.tags, { orderings: '[my.post.date desc]', pageSize: 3 });

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

ClubPage.propTypes = {
  page: PropTypes.shape({}).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default ClubPage;
