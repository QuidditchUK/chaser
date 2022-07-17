import Link from 'next/link';
import { Flex, Heading } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { ADMIN, EMT } from 'constants/scopes';
import { getUserScopes } from 'modules/scopes';
import isAuthorized from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import generateServerSideHeaders from 'modules/headers';

import Slice from 'components/shared/slice';
import PermissionBlock from 'components/permissions/permissions-block';
import Meta from 'components/shared/meta';

const Dashboard = ({ scopes }) => {
  return (
    <>
      <Meta subTitle="Volunteers Permissions" title="Admin Dashboard" />
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
            <Link href="/admin">Dashboard</Link> <ChevronRightIcon /> Volunteer
            Permissions
          </Heading>
        </Flex>

        <PermissionBlock label="EMT" scope={EMT} scopes={scopes} />
        <PermissionBlock label="Admin" scope={ADMIN} scopes={scopes} />
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [EMT]);
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

export default Dashboard;
