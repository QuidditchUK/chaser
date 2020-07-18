import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

const ListItem = styled.li`
  ${color};
  height: 30px;
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
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};
  ${color};
  ${border};
`;

const StyledList = styled.ol``;

const Dashboard = ({ user, products, club }) => {
  console.log(club);
  const hasMembership = useRef(!!products.length);
  const hasClub = useRef(user.club_uuid);
  const setupProfile = useRef(user.first_name && user.last_name);

  return (
    <>
      <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Dashboard" />
      <Box
        bg="greyLight"
        py={{ _: 4, l: 10 }}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container>
          <Box bg="white" borderRadius={1}>
            <Grid
              gridTemplateColumns={{ _: '1fr', m: '2fr 1fr' }}
              gridGap={{ _: 'gutter._', m: 'gutter.m' }}
              bg="white"
              color="primary"
              borderRadius={1}
              overflow="hidden"
            >
              <Flex flexDirection="column" padding={4}>
                <Heading as="h2" isBody color="primary">Get ready for brooms up</Heading>
                <Content>As the new season approaches, complete the following list to be ready when the season kicks off:</Content>

                <StyledList>
                  <ListItem color={hasMembership.current ? 'keeperGreen' : 'black'}>
                    <Flex alignItems="center">
                      <Link href="/dashboard/membership/manage" passHref>
                        <StyledAnchor color={hasMembership.current ? 'keeperGreen' : 'black'} borderColor={hasMembership.current ? 'keeperGreen' : 'black'}>
                          Purchase your QuidditchUK Membership
                        </StyledAnchor>
                      </Link>

                      {hasMembership.current && <Checkmark />}
                    </Flex>
                  </ListItem>

                  <ListItem color={hasClub.current ? 'keeperGreen' : 'black'}>
                    <Flex alignItems="center">
                      <Link href="/dashboard/membership/club" passHref>
                        <StyledAnchor color={hasClub.current ? 'keeperGreen' : 'black'} borderColor={hasClub.current ? 'keeperGreen' : 'black'}>
                          Select your club
                        </StyledAnchor>
                      </Link>

                      {!!hasClub.current && <Checkmark />}
                    </Flex>
                  </ListItem>

                  <ListItem color={setupProfile.current ? 'keeperGreen' : 'black'}>
                    <Flex alignItems="center">
                      <Link href="/dashboard/account/profile" passHref>
                        <StyledAnchor color={setupProfile.current ? 'keeperGreen' : 'black'} borderColor={setupProfile.current ? 'keeperGreen' : 'black'}>
                          Setup your profile
                        </StyledAnchor>
                      </Link>

                      {setupProfile.current && <Checkmark />}
                    </Flex>
                  </ListItem>
                </StyledList>
              </Flex>

              <Image
                alt="London Unbreakables line up at the keeper line ready for brooms up"
                src="https://images.prismic.io/chaser/b97e3eab-dcb7-4474-85e0-914afe58ae74_IMG_0529.JPG?auto=compress,format"
                height={600}
                width={900}
              />
            </Grid>
          </Box>

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

  const { data: products } = await api.get('/products/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  let club = null;
  if (user.club_uuid) {
    club = await api.get(`/clubs/${user.club_uuid}`);
  }

  return {
    props: {
      products,
      user,
      club,
    },
  };
};

Dashboard.defaultProps = {
  products: [],
  club: null,
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    club_uuid: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({})),
  club: PropTypes.shape({}),
};

export default Dashboard;
