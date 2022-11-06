import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Flex, Heading, Box } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { EMT, HEAD_SCOUT } from 'constants/scopes';
import { getPlainScopes, hasScope } from 'modules/scopes';
import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import PendingScoutingRequests from 'components/admin/scouting/pending-scouting-requests';

import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';
import { useSession } from 'next-auth/react';

const NationalTeams = () => {
  const { data: session } = useSession();
  const { user } = session;
  const userScopes = getPlainScopes(user.scopes);

  return (
    <>
      <Meta subTitle="National Teams" title="Admin Dashboard" />
      <Slice>
        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading
            as="h3"
            fontFamily="body"
            color="qukBlue"
            display="flex"
            alignItems="center"
          >
            <Link href="/admin">Dashboard</Link> <ChevronRightIcon /> National
            Teams
          </Heading>
        </Flex>

        {hasScope([HEAD_SCOUT], userScopes) && (
          <PendingScoutingRequests scopes={userScopes} />
        )}
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [EMT, HEAD_SCOUT]);

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

export default NationalTeams;

NationalTeams.auth = {
  skeleton: <Box />,
};
