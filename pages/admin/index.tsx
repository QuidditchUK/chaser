import { GetServerSideProps } from 'next';
import { Grid, Heading, Box } from '@chakra-ui/react';
import { getPlainScopes, hasScope } from 'modules/scopes';
import { isScoped_ServerProps } from 'modules/auth';
import {
  DASHBOARD_SCOPES,
  EMT,
  USERS_READ,
  CLUBS_READ,
  TRANSFER_READ,
} from 'constants/scopes';
import Slice from 'components/shared/slice';
import Card from 'components/shared/card';
import { getBasePageProps } from 'modules/prismic';
import Meta from 'components/shared/meta';
import useMe from 'hooks/useMe';

const Dashboard = () => {
  const { data: user } = useMe();

  const userScopes = getPlainScopes(user?.scopes);
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
          {hasScope([USERS_READ, EMT], userScopes) && (
            <Card title="Users" href="/admin/users" />
          )}
          {hasScope([CLUBS_READ, EMT], userScopes) && (
            <Card title="Clubs" href="/admin/clubs" />
          )}
          {hasScope([TRANSFER_READ, EMT], userScopes) && (
            <Card title="Transfers" href="/admin/transfers" />
          )}
          {hasScope([EMT], userScopes) && (
            <Card title="Volunteer Permissions" href="/admin/permissions" />
          )}
          {hasScope([EMT], userScopes) && (
            <Card title="Memberships" href="/admin/memberships" />
          )}
          {/* TODO: Enable when SSP released */}
          {/* {hasScope([EMT], userScopes) && (
            <Card title="System Settings" href="/admin/settings" />
          )} */}
        </Grid>
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, DASHBOARD_SCOPES);

  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: await getBasePageProps(),
  };
};

export default Dashboard;

Dashboard.auth = {
  skeleton: <Box />,
};
