import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, typography, border } from 'styled-system';
import { useRouter } from 'next/router';
import Page404 from 'pages/404';
import PageLoading from 'components/page-loading';
import Heading from 'components/heading';

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

const TableHead = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[1]};
  border-bottom-style: solid;
  border-bottom-width: 3px;
`;

const UNSPEAKABLES = {
  uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
  name: 'London Unspeakables Quidditch',
  slug: 'london-unspeakables-quidditch',
  league: 'Community',
  location: { type: 'POINT', coordinates: ['-0.148176', '51.453825'] },
  images: ['https://images.prismic.io/chaser/475578b7-a77c-4abc-90f2-de1547bbacf2_72886220_1438371239645635_5936997713475272704_o.jpg?auto=compress,format'],
  venue: 'Clapham South, London',
  featuredColor: '#381e51',
  textColor: '#ffffff',
  icon: 'https://images.prismic.io/chaser/98cc10fb-4840-40ac-a973-1bc54e7d86c5_unspeakables.png?auto=compress,format',
  tags: ['London Unspeakables Quidditch', 'Unspeakables', 'Unbreakables'],
  trainings: 'Saturdays 12-4PM',
  leaderPosition: 'President',
  leader: 'John Morris',
  officialWebsite: 'https://www.facebook.com/UnspeakablesLDN/',
  status: 'active',
  social_facebook: 'https://www.facebook.com/UnspeakablesLDN/',
  social_twitter: 'https://twitter.com/UnspeakablesLDN',
  social_youtube: 'https://www.youtube.com/user/UnspeakablesLDN',
  social_instagram: 'https://www.instagram.com/londonunspeakables',
  description: 'The Unspeakables are London’s first quidditch team. Through our regular open sessions, we have introduced many new players to the sport who missed out on the more well-trodden university route; this makes us a true community team. We pride ourselves both on our diversity- we are diverse in every way possible- and our spirit of competitiveness while never losing our sense of humour. Our core of passionate, friendly and dedicated regular members, supplemented by talented players from far and wide, has allowed us to consistently improve over the past two years and we were thrilled to finish fifth at the most recent British Quidditch Cup. The Unbreakables, our second team, were formed in 2017. A bigger club enables us to continue our traditions of developing brand new people and helping players transition from other sports.',
  teams: [{
    uuid: '789e0d73-af14-4a35-a37f-8c854728c9b1',
    name: 'London Unspeakables',
    short_name: 'Unspeakables',
    slug: 'unspeakables',
    current_division: 1,
    current_position: 4,
    image: 'https://images.prismic.io/chaser/79143992-e8a4-4f90-a39a-830664d1f342_83868043_799470787197707_7665980757470347264_o.jpg?auto=compress,format',
  },
  {
    uuid: '789e0d73-af14-4a35-a37f-8c854728c9b2',
    name: 'London Unstoppables',
    short_name: 'Unstoppables',
    slug: 'unstoppables',
    current_division: 2,
    current_position: 3,
    image: 'https://images.prismic.io/chaser/7c170182-bd18-4787-a4e7-2f9df1607a88_Unbreakables-1024x683.jpg?auto=compress,format',
  },
  {
    uuid: '789e0d73-af14-4a35-a37f-8c854728c9b3',
    name: 'Unbreakables',
    short_name: 'Unbreakables',
    slug: 'unbreakables',
    current_division: 3,
    current_position: 1,
    image: 'https://images.prismic.io/chaser/7c170182-bd18-4787-a4e7-2f9df1607a88_Unbreakables-1024x683.jpg?auto=compress,format',
  }],
};

const RESULTS = [
  {
    club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
    team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b1',
    position: 2,
    tournament_name: 'European Qualifier Tournament',
    tournament_date: '2020-01-30',
    season: '19/20',
  },
  {
    club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
    team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b3',
    position: 2,
    tournament_name: 'Development Cup',
    tournament_date: '2020-03-07',
    season: '19/20',
  },
  {
    club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
    team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b1',
    position: 2,
    tournament_name: 'Southern Cup',
    tournament_date: '2019-11-12',
    season: '19/20',
  },
  {
    club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
    team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b2',
    position: 2,
    tournament_name: 'Development Cup',
    tournament_date: '2019-03-04',
    season: '18/19',
  },
  {
    club_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
    team_uuid: '789e0d73-af14-4a35-a37f-8c854728c9b1',
    position: 3,
    tournament_name: 'Southern Cup',
    tournament_date: '2018-11-12',
    season: '18/19',
  },
];

const ACTIVE_STATUS = 'active';

const ClubPage = ({ club, posts, results }) => {
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
        featuredColor={club.featuredColor}
        textColor={club.textColor}
        icon={club.icon}
        league={club.league}
        location={club.location}
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
            <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featuredColor}>Club Details</Heading>

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
                  <TableData><strong>{club.leaderPosition}</strong></TableData>
                  <TableData>{club.leader}</TableData>
                </TableRow>

                <TableRow>
                  <TableData><strong>Official Website</strong></TableData>
                  <TableData><a href={club.officialWebsite} rel="noopener noreferrer" target="_blank">{club.officialWebsite}</a></TableData>
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
                  featuredColor={club.featuredColor}
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
                  featuredColor={club.featuredColor}
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
                  featuredColor={club.featuredColor}
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
                  featuredColor={club.featuredColor}
                >
                  <YoutubeIcon />
                </SocialIcon>
              )}
            </Flex>

            {club.status !== ACTIVE_STATUS && <Support>This club is currently inactive, if you are interested in restarting it contact our <a href={`mailto:teams@quidditchuk.org?subject=${club.name}`}>Teams Director</a></Support>}

            <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featuredColor}>Club Achievements</Heading>

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
            </Table>
          </Box>

          <Box py={{ _: 3, m: 9 }} paddingRight={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }} paddingLeft={{ _: 'gutter._', s: 'gutter.s', m: 0 }}>
            <Box bg="white" py={3} px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
              <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featuredColor}>Latest News</Heading>
              <ClubNews posts={posts} bgColor={club.featuredColor} color={club.textColor} />

              <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featuredColor} paddingTop="2">About {club.name}</Heading>
              <Content paddingBottom={3}>{club.description}</Content>

              <Heading as="h3" fontSize={[2, 2, 3]} isBody color={club.featuredColor}>Teams</Heading>

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
  const data = UNSPEAKABLES;
  const results = RESULTS.sort((a, b) => new Date(b.tournament_date).getTime() - new Date(a.tournament_date).getTime());
  const posts = await getBlogTags(data.tags, { orderings: '[my.post.date desc]', pageSize: 3 });

  return {
    props: {
      club: data,
      posts,
      results,
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
    featuredColor: PropTypes.string,
    textColor: PropTypes.string,
    league: PropTypes.string,
    leader: PropTypes.string,
    leaderPosition: PropTypes.string,
    officialWebsite: PropTypes.string,
    trainings: PropTypes.string,
    status: PropTypes.string,
    social_facebook: PropTypes.string,
    social_twitter: PropTypes.string,
    social_youtube: PropTypes.string,
    social_instagram: PropTypes.string,
    teams: PropTypes.array,
    location: PropTypes.shape,
    description: PropTypes.string,
  }).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape).isRequired,
  results: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default ClubPage;
