import { parseCookies } from 'modules/cookies';
import { Grid, Heading } from '@chakra-ui/react';
import { getUserScopes, hasScope } from 'modules/scopes';
import {
  DASHBOARD_SCOPES,
  EMT,
  USERS_READ,
  CLUBS_READ,
} from 'constants/scopes';
import Slice from 'components/shared/slice';
import Card from 'components/shared/card';
import isAuthorized from 'modules/auth';
import Meta from 'components/shared/meta';
import { getBasePageProps } from 'modules/prismic';
const Dashboard = ({ scopes }) => {
  return (
    <>
      <Meta subTitle="Admin Dashboard" />
      <Slice>
        <Heading as="h3" fontFamily="body" color="qukBlue">
          Dashboard
        </Heading>
        <Grid
          gridGap={4}
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
        >
          {hasScope([USERS_READ, EMT], scopes) && <Card title="Users" />}
          {hasScope([CLUBS_READ, EMT], scopes) && (
            <Card title="Clubs" href="/admin/clubs" />
          )}
          {hasScope([EMT], scopes) && <Card title="Transfers" />}
          {hasScope([EMT], scopes) && <Card title="National Teams" />}
          {hasScope([EMT], scopes) && (
            <Card title="Volunteer Permissions" href="/admin/permissions" />
          )}
        </Grid>
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, DASHBOARD_SCOPES);
  if (!auth) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);
  const scopes = await getUserScopes(AUTHENTICATION_TOKEN);
  const basePageProps = await getBasePageProps();

  return {
    props: {
      scopes,
      ...basePageProps,
    },
  };
};

export default Dashboard;
