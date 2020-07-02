import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, typography, border } from 'styled-system';
import { useRouter } from 'next/router';
import Page404 from 'pages/404';
import PageLoading from 'components/page-loading';
import Heading from 'components/heading';
import { api } from 'modules/api';

import Layout from 'containers/layout';
import Meta from 'components/meta';
import { Box, Flex, Grid } from 'components/layout';
import HeroWithLocation from 'components/hero-with-location';

import { getBlogTags } from 'modules/prismic';
import Content from 'components/content';
import Image from 'components/image';
import ClubNews from 'components/club-news';
import { CenterJustify } from 'components/image-and-content';

import { formatOrdinals } from 'modules/numbers';

import FacebookIcon from 'public/images/facebook.svg';
import TwitterIcon from 'public/images/twitter.svg';
import InstagramIcon from 'public/images/instagram.svg';
import YoutubeIcon from 'public/images/youtube.svg';

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

const TableDataBorder = styled(TableData)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  ${border};
`;

const TableRow = styled.tr`
  border-collapse: separate;
  border-spacing: 0;
  vertical-align: top;
`;

const Support = styled.p`
  color: ${({ theme }) => theme.colors.greyDark};
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
`;

// const TableHead = styled.th`
//   text-align: left;
//   padding: ${({ theme }) => theme.space[1]};
//   border-bottom-style: solid;
//   border-bottom-width: 3px;
// `;

// const RESULTS = [
//   {
//     club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
//     team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b1',
//     position: 2,
//     tournament_name: 'European Qualifier Tournament',
//     tournament_date: '2020-01-30',
//     season: '19/20',
//   },
//   {
//     club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
//     team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b3',
//     position: 2,
//     tournament_name: 'Development Cup',
//     tournament_date: '2020-03-07',
//     season: '19/20',
//   },
//   {
//     club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
//     team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b1',
//     position: 2,
//     tournament_name: 'Southern Cup',
//     tournament_date: '2019-11-12',
//     season: '19/20',
//   },
//   {
//     club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
//     team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b2',
//     position: 2,
//     tournament_name: 'Development Cup',
//     tournament_date: '2019-03-04',
//     season: '18/19',
//   },
//   {
//     club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
//     team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b1',
//     position: 3,
//     tournament_name: 'Southern Cup',
//     tournament_date: '2018-11-12',
//     season: '18/19',
//   },
// ];

const ACTIVE_STATUS = 'active';

const ClubPage = ({ club, posts }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (<PageLoading />);
  }

  if (!club) {
    return <Page404 />;
  }

  return (
    <Layout>
      <Meta
        description={`Club page of ${club.name} with all their latest news, results and details`}
        subTitle={club.name}
        image={club.images[0]}
      />

      <HeroWithLocation
        image={club.images[0]}
        name={club.name}
        venue={club.venue}
        featuredColor={club.featured_color}
        textColor={club.text_color}
        icon={club.icon}
        league={club.league}
        location={JSON.parse(club.coordinates)}
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
                <TableRow>
                  <TableData><strong>Trainings</strong></TableData>
                  <TableData>{club.trainings}</TableData>
                </TableRow>

                <TableRow>
                  <TableData><strong>League</strong></TableData>
                  <TableData>{club.league}</TableData>
                </TableRow>

                <TableRow>
                  <TableData><strong>{club.leader_position}</strong></TableData>
                  <TableData>{club.leader}</TableData>
                </TableRow>

                <TableRow>
                  <TableData><strong>Official Website</strong></TableData>
                  <TableData><a href={club.official_website} rel="noopener noreferrer" target="_blank">{club.official_website}</a></TableData>
                </TableRow>
              </tbody>
            </Table>

            <Flex justifyContent={{ _: 'center', m: 'flex-start' }} mt={5}>
              {club.social_facebook && (
                <SocialIcon
                  aria-label={`Like ${club.name} on Facebook`}
                  href={club.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  featuredColor={club.featured_color}
                >
                  <FacebookIcon />
                </SocialIcon>
              )}

              {club.social_twitter && (
                <SocialIcon
                  aria-label={`Follow ${club.name} on Twitter`}
                  href={club.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
                  featuredColor={club.featured_color}
                >
                  <TwitterIcon />
                </SocialIcon>
              )}

              {club.social_instagram && (
                <SocialIcon
                  aria-label={`Follow ${club.name} on Instagram`}
                  href={club.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
                  featuredColor={club.featured_color}
                >
                  <InstagramIcon />
                </SocialIcon>
              )}

              {club.social_youtube && (
                <SocialIcon
                  aria-label={`Subscribe to ${club.name} Youtube Channel`}
                  href={club.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
                  featuredColor={club.featured_color}
                >
                  <YoutubeIcon />
                </SocialIcon>
              )}
            </Flex>

            {club.status !== ACTIVE_STATUS && <Support>This club is currently inactive, if you are interested in restarting it contact our <a href={`mailto:teams@quidditchuk.org?subject=${club.name}`}>Teams Director</a></Support>}

            {/* <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color}>Club Achievements</Heading>

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
                {results.map((result) => (
                  <TableRow key={`${result.club_uuid}_${result.team_uuid}_${result.tournament_name}_${result.tournament_date}`}>
                    <TableDataBorder>{result.position}{formatOrdinals(result.position)}</TableDataBorder>
                    <TableDataBorder>{result.season}</TableDataBorder>
                    <TableDataBorder>{result.tournament_name}</TableDataBorder>
                    <TableDataBorder>{club.teams.find(({ uuid }) => uuid === result.team_uuid)?.short_name}</TableDataBorder>
                  </TableRow>
                ))}
              </tbody>
            </Table> */}
          </Box>

          <Box py={{ _: 3, m: 9 }} paddingRight={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }} paddingLeft={{ _: 'gutter._', s: 'gutter.s', m: 0 }}>
            <Box bg="white" py={3} px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
              <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color}>Latest News</Heading>
              <ClubNews posts={posts} bgColor={club.featured_color} color={club.text_color} />

              <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color} paddingTop="2">About {club.name}</Heading>
              <Content paddingBottom={3}>{club.description}</Content>

              <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featured_color}>Teams</Heading>

              {club.teams.map((team) => (
                <Grid
                  gridTemplateColumns={{ _: '1fr', m: '1fr 1fr' }}
                  gridGap={{ _: 'gutter._', m: 'gutter.m' }}
                  key={team.uuid}
                  paddingBottom="6"
                >
                  <CenterJustify>
                    <Image alt={team.name} src={team.image} height={9} width={16} />
                  </CenterJustify>

                  <CenterJustify>
                    <Heading as="h3" isBody mt={0}>{team.short_name || team.name}</Heading>
                    <Table>
                      <tbody>
                        <TableRow>
                          <TableDataBorder borderTopWidth="3px" borderTopStyle="solid"><strong>Current Division</strong></TableDataBorder>
                          <TableDataBorder borderTopWidth="3px" borderTopStyle="solid">{team.current_division}</TableDataBorder>
                        </TableRow>

                        <TableRow>
                          <TableDataBorder><strong>Current Position</strong></TableDataBorder>
                          <TableDataBorder>{team.current_position}{formatOrdinals(team.current_position)}</TableDataBorder>
                        </TableRow>
                      </tbody>
                    </Table>
                  </CenterJustify>
                </Grid>
              ))}
            </Box>
          </Box>
        </Grid>
      </Box>
    </Layout>
  );
};

// eslint-disable-next-line no-unused-vars
export const getServerSideProps = async ({ params: { club } }) => {
  const { data } = await api.get(`/clubs/${club}`);

  // const results = RESULTS.sort((a, b) => new Date(b.tournament_date).getTime() - new Date(a.tournament_date).getTime());
  const posts = await getBlogTags(data.tags, { orderings: '[my.post.date desc]', pageSize: 3 });

  return {
    props: {
      club: data,
      posts,
      // results,
    },
  };
};

ClubPage.propTypes = {
  club: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    venue: PropTypes.string,
    icon: PropTypes.string,
    featured_color: PropTypes.string,
    text_color: PropTypes.string,
    league: PropTypes.string,
    leader: PropTypes.string,
    leader_position: PropTypes.string,
    official_website: PropTypes.string,
    trainings: PropTypes.string,
    status: PropTypes.string,
    social_facebook: PropTypes.string,
    social_twitter: PropTypes.string,
    social_youtube: PropTypes.string,
    social_instagram: PropTypes.string,
    teams: PropTypes.arrayOf(PropTypes.shape({})),
    location: PropTypes.shape,
    description: PropTypes.string,
    coordinates: PropTypes.shape,
  }).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default ClubPage;
