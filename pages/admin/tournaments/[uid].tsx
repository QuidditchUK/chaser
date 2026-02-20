import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';
import { Heading, Box, Flex, Text, useDisclosure } from '@chakra-ui/react';

import type { clubs as PrismaClub } from '@prisma/client';
import generateServerSideHeaders from 'modules/headers';

import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';
import Modal from 'components/shared/modal';
import Button from 'components/shared/button';

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
import useResponse from 'hooks/useResponse';

const ClubPage = ({ club: initialData }: { club: PrismaClub }) => {
  const router = useRouter();
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: club, refetch } = useCachedResponse<PrismaClub>({
    queryKey: ['/clubs/', router.query.uid],
    queryFn: () => clubsService.getClub({ club_uuid: router.query.uid }),
    initialData,
  });

  const { mutate: deleteClub } = useResponse({
    queryFn: clubsService.deleteClub,
    onSettled: () => {
      onClose();
      router.push('/admin/clubs');
    },
  });

  return (
    <>
      <Meta subTitle={club?.name} title="Clubs Admin Dashboard" />
      <Slice>
        <Flex
          flexDirection="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <HeadingWithBreadcrumbs
            breadcrumbs={[
              { link: '/admin', title: 'Dashboard' },
              { link: '/admin/clubs', title: 'Clubs' },
            ]}
            heading={club?.name}
          />

          {hasScope([CLUBS_WRITE, EMT], userScopes) && !club.active && (
            <Button variant="secondary" onClick={onOpen}>
              Delete Club
            </Button>
          )}
        </Flex>

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

      <Modal
        title="Delete Club"
        isOpen={isOpen}
        onClose={onClose}
        footerAction={() => deleteClub({ club_uuid: club.uuid })}
        footerTitle="Delete"
        footerButtonProps={{ variant: 'secondary' }}
      >
        <Text>Are you sure you want to delete {club?.name}?</Text>
        <Text fontWeight="bold">
          This action cannot be undone, and any members attached to the club
          will become unassigned.
        </Text>
      </Modal>
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
