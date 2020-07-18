import React from 'react';
import { api } from 'modules/api';
import Meta from 'components/meta';
import { Box } from 'components/layout';
import Heading from 'components/heading';
import { parseCookies } from 'modules/cookies';

const Dashboard = () => (
  <>
    <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Dashboard" />
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Heading as="h1" isBody>DASHBOARD</Heading>
    </Box>
  </>
);

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { data: product } = await api.get('/products/me', {
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
      product,
      user,
      club,
    },
  };
};

export default Dashboard;
