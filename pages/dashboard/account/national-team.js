import dynamic from 'next/dynamic';
import { Box, Flex } from '@chakra-ui/react';

import { rem } from 'styles/theme';
import { getScoutingApplicationEvents } from 'modules/prismic';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';

const Logo = dynamic(() => import('components/logo'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));

const NationalTeamProfile = dynamic(() =>
  import('components/national-team-profile')
);
const NationalTeamScouting = dynamic(() =>
  import('components/national-team-scouting')
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

        <NationalTeamProfile user={user} />

        <NationalTeamScouting events={events} />
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

  const events = await getScoutingApplicationEvents();

  return {
    props: {
      user,
      events,
    },
  };
};

export default Info;
