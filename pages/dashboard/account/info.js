import dynamic from 'next/dynamic';
import { Box, Flex, Heading } from '@chakra-ui/react';

import { rem } from 'styles/theme';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import isAuthorized from 'modules/auth';

const Logo = dynamic(() => import('components/shared/logo'));
const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));

const InfoForm = dynamic(() => import('components/dashboard/info-form'));
const PasswordForm = dynamic(() =>
  import('components/dashboard/password-form')
);

const Info = ({ user }) => (
  <>
    <Meta
      description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
      subTitle="Sign In"
    />
    <Box bg="greyLight" py={{ base: 4, lg: 10 }} px={{ base: 4, sm: 8, md: 9 }}>
      <Container maxWidth={rem(500)}>
        <Flex justifyContent="center" alignItems="center">
          <Logo />
        </Flex>
        <Heading as="h1" fontFamily="body" textAlign="center">
          Update your Info
        </Heading>

        <InfoForm user={user} />

        <Heading as="h3" fontFamily="body" color="qukBlue" fontSize="xl">
          Change your password
        </Heading>

        <PasswordForm />
      </Container>
    </Box>
  </>
);

export const getServerSideProps = async ({ req, res }) => {
  if (!isAuthorized(req, res)) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);

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

export default Info;
