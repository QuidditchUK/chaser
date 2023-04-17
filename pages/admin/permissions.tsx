import { Flex, Box } from '@chakra-ui/react';

import { ADMIN, BANNED, EMT, HEAD_SCOUT, VOLUNTEER } from 'constants/scopes';
import { getPlainScopes } from 'modules/scopes';
import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';

import Slice from 'components/shared/slice';
import PermissionBlock from 'components/permissions/permissions-block';
import Meta from 'components/shared/meta';
import { GetServerSideProps } from 'next';
import useMe from 'hooks/useMe';
import SkeletonLoaderWrapper from 'components/shared/SkeletonLoaderWrapper';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';

const Permissions = () => {
  const { data: user, isLoading } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  return (
    <>
      <Meta subTitle="Volunteers Permissions" title="Admin Dashboard" />
      <SkeletonLoaderWrapper isLoading={isLoading} loaderComponent={<Box />}>
        <Slice>
          <Flex
            flexDirection="row"
            width="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            <HeadingWithBreadcrumbs
              breadcrumbs={[{ link: '/admin', title: 'Dashboard' }]}
              heading="Volunteer Permissions"
            />
          </Flex>

          <PermissionBlock
            label="EMT"
            scope={EMT}
            userScopes={userScopes}
            actionScopes={[ADMIN]}
            allowEditing={true}
          />
          <PermissionBlock
            label="Admin"
            scope={ADMIN}
            userScopes={userScopes}
            actionScopes={[ADMIN]}
            allowEditing={true}
          />
          <PermissionBlock
            label="Head Scout"
            scope={HEAD_SCOUT}
            userScopes={userScopes}
            actionScopes={[ADMIN, EMT]}
            allowEditing={true}
          />
          <PermissionBlock
            label="Volunteers"
            scope={VOLUNTEER}
            userScopes={userScopes}
            actionScopes={[ADMIN, EMT]}
            allowEditing={true}
          />
          <PermissionBlock
            label="Banned users (not reversible)"
            scope={BANNED}
            userScopes={userScopes}
            actionScopes={[ADMIN]}
            allowEditing={false}
          />
        </Slice>
      </SkeletonLoaderWrapper>
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
