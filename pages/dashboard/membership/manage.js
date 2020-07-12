import React from 'react';
import Link from 'next/link';
import Meta from 'components/meta';
import { parseCookies } from 'modules/cookies';
import { Box } from 'components/layout';
import Heading from 'components/heading';
import Content from 'components/content';
import Button from 'components/button';

const ManageMembership = () => (
  <>
    <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Manage" />
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Heading as="h2" isBody>Current Membership</Heading>
      <Content>
        You have no current QuidditchUK Membership. A QuidditchUK Membership is required to play at any QuidditchUK Tournaments, and must be purchased each season.
        <Link as="/dashboard/membership/purchase" href="/dashboard/membership/purchase"><a><Button type="button" variant="primary">Purchase Membership</Button></a></Link>
      </Content>
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

  return {
    props: {
    },
  };
};

export default ManageMembership;
