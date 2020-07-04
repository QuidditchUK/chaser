import React from 'react';
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

export const getServerSideProps = async (ctx) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(ctx.req);

  if (!AUTHENTICATION_TOKEN) {
    const { res } = ctx;
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: {},
  };
};

export default Dashboard;
