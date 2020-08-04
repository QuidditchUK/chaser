import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Box, Flex } from 'components/layout';
import { Logo } from 'components/logo';
import { rem } from 'styles/theme';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';

const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const InfoForm = dynamic(() => import('components/info-form'));
const PasswordForm = dynamic(() => import('components/password-form'));

const logo = '/images/logo.png';

const Info = ({ user }) => (
  <>
    <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Sign In" />
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Container maxWidth={rem(500)}>
        <Flex justifyContent="center" alignItems="center"><Logo src={logo} alt="Quidditch UK" /></Flex>
        <Heading as="h1" isBody textAlign="center">Update your Info</Heading>

        <InfoForm user={user} />

        <Heading as="h3" isBody color="primary">Change your password</Heading>

        <PasswordForm />
      </Container>
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

Info.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default Info;
