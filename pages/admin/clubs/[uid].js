import Link from 'next/link';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { Heading } from '@chakra-ui/react';

import { getUserScopes, hasScope } from 'modules/scopes';
import { CLUBS_READ, CLUBS_WRITE } from 'constants/scopes';
import Slice from 'components/shared/slice';
// import Button from 'components/shared/button';
import isAuthorized from 'modules/auth';
const Dashboard = ({ club }) => {
  return (
    <Slice>
      <Heading as="h3" fontFamily="body" color="qukBlue">
        <Link href="/admin">Dashboard</Link> /{' '}
        <Link href="/admin/clubs/">Clubs</Link> / {club?.name}
      </Heading>
    </Slice>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  if (!isAuthorized(req, res, [CLUBS_READ, CLUBS_WRITE])) {
    return { props: {} };
  }

  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  const scopes = getUserScopes(AUTHENTICATION_TOKEN);
  const { data: club } = await api.get(`/clubs/${params?.uid}`, {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  return {
    props: {
      scopes,
      club,
    },
  };
};

export default Dashboard;
