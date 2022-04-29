import dynamic from 'next/dynamic';
import { Box, Flex } from '@chakra-ui/react';

import { rem } from 'styles/theme';
import { getScoutingApplicationEvents } from 'modules/prismic';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import isAuthorized from 'modules/auth';

const Logo = dynamic(() => import('components/shared/logo'));
const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));

const NationalTeamProfile = dynamic(() =>
  import('components/dashboard/national-team-profile')
);
const NationalTeamScouting = dynamic(() =>
  import('components/dashboard/national-team-scouting')
);

const Info = ({ user, events }) => (
  <>
    <Meta
      description="Sign in to QuidditchUK to manage your QuidditchUK National Team Profile"
      subTitle="National Team Profile"
    />
    <Box bg="greyLight" py={{ base: 4, lg: 10 }} px={{ base: 4, sm: 8, md: 9 }}>
      <Container maxWidth={rem(500)}>
        <Flex justifyContent="center" alignItems="center">
          <Logo />
        </Flex>

        <NationalTeamProfile profile={user} />

        <NationalTeamScouting events={events} />
      </Container>
    </Box>
  </>
);

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);
  if (!isAuthorized(AUTHENTICATION_TOKEN)) {
    return { props: {} };
  }

  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  const events = await getScoutingApplicationEvents();

  return {
    props: {
      user,
      events,
    },
  };
};

export default Info;
