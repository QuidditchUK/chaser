import { useState, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import {
  Box,
  Grid,
  Flex,
  ListItem,
  Text,
  OrderedList,
  Heading,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { getUserScopes, hasScope } from 'modules/scopes';
import { DASHBOARD_SCOPES, EMT, USERS_READ } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Card from 'components/shared/card';
import isAuthorized from 'modules/auth';
const Dashboard = ({ scopes }) => {
  return (
    <Slice>
      <Heading as="h3" fontFamily="body" color="qukBlue">
        Admin Dashboard
      </Heading>
      <Grid
        gridGap={4}
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
      >
        {hasScope([USERS_READ, EMT], scopes) && (
          <Card title="Users" href="/admin/users" />
        )}
        {hasScope([EMT], scopes) && <Card title="Clubs" />}
        {hasScope([EMT], scopes) && <Card title="Transfers" />}
        {hasScope([EMT], scopes) && <Card title="National Teams" />}
        {hasScope([EMT], scopes) && <Card title="Volunteer Permissions" />}
      </Grid>
    </Slice>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!isAuthorized(AUTHENTICATION_TOKEN, DASHBOARD_SCOPES)) {
    return { props: {} };
  }

  const scopes = getUserScopes(AUTHENTICATION_TOKEN);

  return {
    props: {
      scopes,
    },
  };
};

export default Dashboard;
