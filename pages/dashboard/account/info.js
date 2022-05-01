import dynamic from 'next/dynamic';
import { Box, Flex, Heading, Grid } from '@chakra-ui/react';

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
      <Container>
        <Flex justifyContent="center" alignItems="center">
          <Logo />
        </Flex>
        <Heading as="h1" fontFamily="body" textAlign="center">
          Update your Info
        </Heading>

        <Grid gridGap={4} gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}>
          <Box bg="gray.100" borderRadius="lg" p={4}>
            <Heading
              as="h3"
              fontFamily="body"
              color="qukBlue"
              fontSize="xl"
              mt={0}
            >
              Change your details
            </Heading>
            <InfoForm user={user} />
          </Box>

          <Box bg="gray.100" borderRadius="lg" p={4}>
            <Heading
              as="h3"
              fontFamily="body"
              color="qukBlue"
              fontSize="xl"
              mt={0}
            >
              Change your password
            </Heading>

            <PasswordForm />
          </Box>
        </Grid>
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
