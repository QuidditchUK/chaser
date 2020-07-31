import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useSWR from 'swr';
import Link from 'next/link';
import { color, border } from 'styled-system';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import Meta from 'components/meta';
import { Box, Grid, Flex } from 'components/layout';
import Container from 'components/container';
import Heading from 'components/heading';
import Content from 'components/content';
import Image from 'components/image';
import ProductCard from 'components/product-card';
import ClubCard from 'components/club-card';
import { CenterJustify } from 'components/image-and-content';

const StyledLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ListItem = styled.li`
  ${color};
   margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Checkmark = styled.span`
  margin-left: ${({ theme }) => theme.space[3]};
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;
    background-color: ${({ theme }) => theme.colors.keeperGreen};

  &:after {
    content: "";
    display: block;
    position: relative;
    left: 10px;
    top: 7px;
    width: 5px;
    height: 10px;
    border: solid ${({ theme }) => theme.colors.white};
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;
`;

const Span = styled.span`
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};
  ${color};
  ${border};
  line-height: 1.5rem;
`;

const StyledList = styled.ol`
  padding: 0;
  padding-left: 1rem;
`;

const Dashboard = ({ user }) => {
  const [setupProfile] = useState(user.is_student !== null);
  const { data: memberships } = useSWR('/products/me', api);
  const { data: rawClub } = useSWR(`/clubs/${user.club_uuid}`, api);

  const [membership] = memberships?.data || [];
  const club = rawClub?.data || null;

  return (
    <>
      <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Dashboard" />
      <Box
        bg="greyLight"
        py={{ _: 4, l: 10 }}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container>
          <Heading as="h1" isBody color="primary" mt={0}>Hello, {user.first_name} 👋</Heading>
          <Box bg="primary" borderRadius={1}>
            <Grid
              gridTemplateColumns={{ _: '1fr', m: '1fr 1fr', l: '2fr 1fr' }}
              gridGap={{ _: 'gutter._', m: 'gutter.m' }}
              color="white"
              borderRadius={1}
              overflow="hidden"
            >
              <CenterJustify px={{ _: 6, m: 8 }} py={4}>
                <Heading as="h2" isBody mt={0}>Get ready for brooms up</Heading>
                <Content fontSize="1">As the new season approaches, complete the following list to be ready when the season kicks off:</Content>

                <StyledList>
                  <ListItem color={setupProfile ? 'keeperGreen' : 'white'}>
                    <Flex alignItems="center">
                      <Link href="/dashboard/account/info" passHref>
                        <StyledAnchor>
                          <Span color={setupProfile ? 'keeperGreen' : 'white'} borderColor={setupProfile ? 'keeperGreen' : 'white'}>Add your user information</Span>
                        </StyledAnchor>
                      </Link>

                      {setupProfile && <Checkmark />}
                    </Flex>
                  </ListItem>

                  <ListItem color={membership ? 'keeperGreen' : 'white'}>
                    <Flex alignItems="center">
                      <Link href="/dashboard/membership/manage" passHref>
                        <StyledAnchor>
                          <Span color={membership ? 'keeperGreen' : 'white'} borderColor={membership ? 'keeperGreen' : 'white'}>
                            Purchase your QuidditchUK Membership
                          </Span>
                        </StyledAnchor>
                      </Link>

                      {membership && <Checkmark />}
                    </Flex>
                  </ListItem>

                  <ListItem color={club ? 'keeperGreen' : 'white'}>
                    <Flex alignItems="center">
                      <Link href="/dashboard/membership/club" passHref>
                        <StyledAnchor>
                          <Span color={club ? 'keeperGreen' : 'white'} borderColor={club ? 'keeperGreen' : 'white'}>Select your club</Span>
                        </StyledAnchor>
                      </Link>

                      {!!club && <Checkmark />}
                    </Flex>
                  </ListItem>
                </StyledList>
              </CenterJustify>

              <CenterJustify>
                <Image
                  alt="London Unbreakables line up at the keeper line ready for brooms up"
                  src="https://images.prismic.io/chaser/b97e3eab-dcb7-4474-85e0-914afe58ae74_IMG_0529.JPG?auto=compress,format"
                  height={600}
                  width={900}
                />
              </CenterJustify>
            </Grid>
          </Box>

          <Grid
            gridTemplateColumns={{ _: '1fr', m: '2fr 1fr' }}
            gridGap={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
          >
            {membership && (
              <Flex flexDirection="column">

                <Heading as="h2" isBody color="primary">My membership</Heading>

                <ProductCard
                  key={membership?.id}
                  id={membership?.id}
                  image={membership?.images ? membership.images[0] : null}
                  description={membership?.description}
                  name={membership?.name}
                  expires={membership?.metadata?.expires}
                />
              </Flex>
            )}

            {club && (
              <Flex flexDirection="column">
                <Heading as="h2" isBody color="primary">My club</Heading>

                <Link href="/clubs/[club]" as={`/clubs/${club.slug}`} passHref>
                  <StyledLink>
                    <ClubCard
                      backgroundColor={club.featured_color}
                      color={club.text_color}
                      name={club.name}
                      league={club.league}
                      venue={club.venue}
                      status={club.status}
                      icon={club.icon}
                      image={club.images ? (
                        <Image
                          src={club.images[0]}
                          alt={club.name}
                          width={1600}
                          height={900}
                        />
                      ) : null}
                    />
                  </StyledLink>
                </Link>
              </Flex>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  return {
    props: {
      user,
    },
  };
};

Dashboard.defaultProps = {};

Dashboard.propTypes = {
  user: PropTypes.shape({
    club_uuid: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    is_student: PropTypes.bool,
  }).isRequired,
};

export default Dashboard;
