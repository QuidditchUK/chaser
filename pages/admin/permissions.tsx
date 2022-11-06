import Link from 'next/link';
import { Flex, Heading, Box } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { ADMIN, EMT, HEAD_SCOUT, VOLUNTEER } from 'constants/scopes';
import { getPlainScopes } from 'modules/scopes';
import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';

import Slice from 'components/shared/slice';
import PermissionBlock from 'components/permissions/permissions-block';
import Meta from 'components/shared/meta';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';

const Permissions = () => {
  const { data: session } = useSession();
  const { user } = session;
  const userScopes = getPlainScopes(user.scopes);

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

        <PermissionBlock label="EMT" scope={EMT} scopes={userScopes} />
        <PermissionBlock label="Admin" scope={ADMIN} scopes={userScopes} />
        <PermissionBlock
          label="Head Scout"
          scope={HEAD_SCOUT}
          scopes={userScopes}
        />
        <PermissionBlock
          label="Volunteers"
          scope={VOLUNTEER}
          scopes={userScopes}
        />
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = isScoped_ServerProps(context, [EMT]);
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

export default Permissions;

Permissions.auth = {
  skeleton: <Box />,
};
