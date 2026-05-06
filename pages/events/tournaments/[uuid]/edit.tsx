import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';

import type { tournaments as PrismaTournament } from '@prisma/client';
import generateServerSideHeaders from 'modules/headers';

import { EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';
import Modal from 'components/shared/modal';
import Button from 'components/shared/button';

import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';

import tournamentsService from 'services/tournaments';

import useCachedResponse from 'hooks/useCachedResponse';
import { getPlainScopes, hasScope } from 'modules/scopes';
import useMe from 'hooks/useMe';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import useResponse from 'hooks/useResponse';
import TournamentForm from 'components/events/tournaments/tournament-form';
import TournamentTeams from 'components/events/tournaments/tournament-teams';

const TournamentPage = ({ tournament: initialData }: { tournament: PrismaTournament }) => {
  const router = useRouter();
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const tournament_uuid = router.query.uuid;

  const { data: tournament, refetch } = useCachedResponse<PrismaTournament>({
    queryKey: ['/tournaments/', tournament_uuid],
    queryFn: () => tournamentsService.getTournament({ tournament_uuid: tournament_uuid }),
    initialData,
  });

  const { mutate: deleteTournament } = useResponse({
    queryFn: tournamentsService.deleteTournament,
    onSettled: () => {
      onClose();
      router.push('/events/tournaments');
    },
  });

  return (
    <>
      <Meta subTitle={tournament?.name} title="Tournaments Admin Dashboard" />
      <Slice>
        <Flex flexDirection="row" width="100%" alignItems="center" justifyContent="space-between" gap={2}>
          <HeadingWithBreadcrumbs
            breadcrumbs={[
              { link: '/events', title: 'Events' },
              { link: '/events/tournaments', title: 'Tournaments' },
            ]}
            heading={tournament?.name}
          />

          {hasScope([EMT], userScopes) && (
            <Button variant="secondary" onClick={onOpen}>
              Delete Tournament
            </Button>
          )}
        </Flex>

        {hasScope([EMT], userScopes) && <TournamentForm initialTournament={tournament} />}

        <TournamentTeams tournament_uuid={tournament_uuid as string} />
      </Slice>

      <Modal
        title="Delete Tournament"
        isOpen={isOpen}
        onClose={onClose}
        footerAction={() => deleteTournament({ tournament_uuid: tournament.uuid })}
        footerTitle="Delete"
        footerButtonProps={{ variant: 'secondary' }}
      >
        {/* QQ better wording */}
        <Text>Are you sure you want to delete {tournament?.name}?</Text>
        <Text fontWeight="bold">
          This action cannot be undone, and any members attached to the tournament will become unassigned.
        </Text>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [EMT]);

  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const headers = generateServerSideHeaders(context.req);

  const [{ data: tournament }, basePageProps] = await Promise.all([
    tournamentsService.getTournament({
      tournament_uuid: context.params?.uuid,
      headers,
    }),
    getBasePageProps(),
  ]);

  return {
    props: {
      tournament,
      ...basePageProps,
    },
  };
};

export default TournamentPage;

TournamentPage.auth = {
  skeleton: <Box />,
};
