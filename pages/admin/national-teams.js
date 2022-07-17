import Link from 'next/link';
import { Flex, Heading } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { EMT, HEAD_SCOUT } from 'constants/scopes';
import { getUserScopes, hasScope } from 'modules/scopes';
import isAuthorized from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import generateServerSideHeaders from 'modules/headers';
import PendingScoutingRequests from 'components/admin/scouting/pending-scouting-requests';

import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';

const NationalTeams = ({ scopes }) => {
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

        {hasScope([HEAD_SCOUT], scopes) && (
          <PendingScoutingRequests scopes={scopes} />
        )}
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [EMT, HEAD_SCOUT]);
  if (!auth) {
    return { props: {} };
  }

  const headers = generateServerSideHeaders(req);

  const [scopes, basePageProps] = await Promise.all([
    getUserScopes(headers),
    getBasePageProps(),
  ]);

  return {
    props: {
      scopes,
      ...basePageProps,
    },
  };
};

export default NationalTeams;
