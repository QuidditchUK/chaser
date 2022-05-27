import dynamic from 'next/dynamic';
import { Box, Grid } from '@chakra-ui/react';

import {
  getBasePageProps,
  getScoutingApplicationEvents,
} from 'modules/prismic';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import isAuthorized from 'modules/auth';

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
      <Container>
        <Grid
          gridGap={4}
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
          mt={3}
        >
          <Box bg="gray.100" borderRadius="lg" p={4}>
            <NationalTeamProfile profile={user} />
          </Box>

          <Box bg="qukBlue" borderRadius="lg" p={4}>
            <NationalTeamScouting events={events} />
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

  const [{ data: user }, events, basePageProps] = await Promise.all([
    api.get('/users/me', {
      headers: { Authorization: `Bearer ${AUTHENTICATION_TOKEN}` },
    }),
    getScoutingApplicationEvents(),
    getBasePageProps(),
  ]);

  return {
    props: {
      user,
      events,
      ...basePageProps,
    },
  };
};

export default Info;
