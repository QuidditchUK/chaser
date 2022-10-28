import dynamic from 'next/dynamic';
import { Heading } from '@chakra-ui/react';
import isAuthorized from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import generateServerSideHeaders from 'modules/headers';
import { getUserScopes } from 'modules/scopes';
import useCachedResponse from 'hooks/useCachedResponse';

import usersService from 'services/users';
import clubsService from 'services/clubs';
import ClubMembers from 'components/admin/clubs/club-members';

import Slice from 'components/shared/slice';
import { CLUB_MANAGEMENT } from 'constants/scopes';

const Meta = dynamic(() => import('components/shared/meta'));

const ClubManagement = ({ user, scopes }) => {
  const { data: club, refetch } = useCachedResponse({
    queryKey: ['/clubs/', user?.club_uuid],
    queryFn: () => clubsService.getClub({ club_uuid: user?.club_uuid }),
  });

  return (
    <>
      <Meta
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Dashboard"
      />
      <Slice>
        <Heading as="h1" fontFamily="body" color="qukBlue" fontSize="3xl">
          {club?.name}
        </Heading>

        <ClubMembers club={club} refetch={refetch} scopes={scopes} />
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, [CLUB_MANAGEMENT]);
  if (!auth) {
    return { props: {} };
  }

  const headers = generateServerSideHeaders(req);

  const { data: user } = await usersService.getUser({ headers });
  const scopes = await getUserScopes(headers);
  const basePageProps = await getBasePageProps();

  return {
    props: {
      user,
      scopes,
      ...basePageProps,
    },
  };
};

export default ClubManagement;
