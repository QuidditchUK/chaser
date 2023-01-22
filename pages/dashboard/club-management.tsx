import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { Heading, Box } from '@chakra-ui/react';
import { clubs as PrismaClub } from '@prisma/client';
import { getBasePageProps } from 'modules/prismic';
import { isScoped_ServerProps } from 'modules/auth';
import useCachedResponse from 'hooks/useCachedResponse';

import clubsService from 'services/clubs';
import ClubMembers from 'components/admin/clubs/club-members';
import { getPlainScopes } from 'modules/scopes';
import { CLUB_MANAGEMENT } from 'constants/scopes';

import Slice from 'components/shared/slice';
import useMe from 'hooks/useMe';

const Meta = dynamic(() => import('components/shared/meta'));

const ClubManagement = () => {
  const { data: user } = useMe();

  const { data: club, refetch } = useCachedResponse<PrismaClub>({
    queryKey: ['/clubs/', user?.club_uuid],
    queryFn: () => clubsService.getClub({ club_uuid: user.club_uuid }),
    selector: (res) => res.data.club,
    enabled: Boolean(user),
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

        <ClubMembers
          club={club}
          refetch={refetch}
          scopes={getPlainScopes(user?.scopes)}
        />
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [CLUB_MANAGEMENT]);

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

export default ClubManagement;

ClubManagement.auth = {
  skeleton: <Box />,
};
