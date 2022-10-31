import dynamic from 'next/dynamic';
import { Box, Grid } from '@chakra-ui/react';

import {
  getBasePageProps,
  getScoutingApplicationEvents,
} from 'modules/prismic';
import generateServerSideHeaders from 'modules/headers';
import usersService from 'services/users';
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
      description="Sign in to QuadballUK to manage your QuadballUK National Team Profile"
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

  const headers = generateServerSideHeaders(req);

  const [{ data: user }, events, basePageProps] = await Promise.all([
    usersService.getUser({ headers }),
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
