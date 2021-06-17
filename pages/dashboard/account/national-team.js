import dynamic from 'next/dynamic';
import { Box, Flex } from '@chakra-ui/react';

import { rem } from 'styles/theme';
// import { api } from 'modules/api';
// import { parseCookies } from 'modules/cookies';

const Logo = dynamic(() => import('components/logo'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));

const NationalTeamProfile = dynamic(() =>
  import('components/national-team-profile')
);
const NationalTeamScouting = dynamic(() =>
  import('components/national-team-scouting')
);

const Info = () => (
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

        {/* TODO: Need to handle passing data to this form, from the new API endpoint. */}
        <NationalTeamProfile />

        <NationalTeamScouting />
      </Container>
    </Box>
  </>
);

// TODO: Implement the authorization on this page (inc. 'Meta' code above). I have this disabled so I can access it locally.
// export const getServerSideProps = async ({ req, res }) => {
//   const { AUTHENTICATION_TOKEN } = parseCookies(req);

//   if (!AUTHENTICATION_TOKEN) {
//     res.setHeader('location', '/login');
//     res.statusCode = 302;
//     res.end();
//     return { props: {} };
//   }

//   const { data: user } = await api.get('/users/national-team', {
//     headers: {
//       Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
//     },
//   });

//   return {
//     props: {
//       user,
//     },
//   };
// };

export default Info;
