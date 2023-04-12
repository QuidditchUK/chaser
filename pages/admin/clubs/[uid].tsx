import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { Heading, Box } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import type { clubs as PrismaClub } from '@prisma/client';
import generateServerSideHeaders from 'modules/headers';

import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';

import UpdateClubForm from 'components/admin/clubs/update-club-form';
import ClubTeams from 'components/admin/clubs/club-teams';
import ClubMembers from 'components/admin/clubs/club-members';

import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';

import clubsService from 'services/clubs';

import useCachedResponse from 'hooks/useCachedResponse';
import { getPlainScopes, hasScope } from 'modules/scopes';
import useMe from 'hooks/useMe';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';

const ClubPage = ({ club: initialData }: { club: PrismaClub }) => {
  const router = useRouter();
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  const { data: club, refetch } = useCachedResponse<PrismaClub>({
    queryKey: ['/clubs/', router.query.uid],
    queryFn: () => clubsService.getClub({ club_uuid: router.query.uid }),
    initialData,
  });

  return (
    <>
      <Meta subTitle={club?.name} title="Clubs Admin Dashboard" />
      <Slice>
        <HeadingWithBreadcrumbs
          breadcrumbs={[
            { link: '/admin', title: 'Dashboard' },
            { link: '/admin/clubs', title: 'Clubs' },
          ]}
          heading={club?.name}
        />

        {hasScope([CLUBS_WRITE, EMT], userScopes) && (
          <UpdateClubForm club={club} refetch={refetch} />
        )}

        {hasScope([CLUBS_WRITE, EMT], userScopes) && (
          <ClubTeams club_uuid={club?.uuid} />
        )}
        <Heading fontFamily="body" color="qukBlue" fontSize="2xl">
          Members
        </Heading>
        <ClubMembers club={club} refetch={refetch} scopes={userScopes} />
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [
    CLUBS_READ,
    CLUBS_WRITE,
    EMT,
  ]);

  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const headers = generateServerSideHeaders(context.req);

  const [{ data: club }, basePageProps] = await Promise.all([
    clubsService.getClub({ club_uuid: context.params?.uid, headers }),
    getBasePageProps(),
  ]);

  return {
    props: {
      club,
      ...basePageProps,
    },
  };
};

export default ClubPage;

ClubPage.auth = {
  skeleton: <Box />,
};
