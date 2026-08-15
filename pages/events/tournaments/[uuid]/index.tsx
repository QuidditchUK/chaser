import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';
import { Box, Flex, Heading, Link, Text, useDisclosure } from '@chakra-ui/react';

import type { tournaments as PrismaTournament } from '@prisma/client';
import generateServerSideHeaders from 'modules/headers';

import { EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';
import Modal from 'components/shared/modal';
import Button from 'components/shared/button';

import { getBasePageProps } from 'modules/prismic';

import tournamentsService from 'services/tournaments';

import useCachedResponse from 'hooks/useCachedResponse';
import { getPlainScopes, hasScope } from 'modules/scopes';
import useMe from 'hooks/useMe';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import useResponse from 'hooks/useResponse';
import TournamentTeams from 'components/events/tournaments/tournament-teams';

const TournamentPage = ({ tournament: initialData }: { tournament: PrismaTournament }) => {
  const router = useRouter();
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const tournament_uuid = router.query.uuid;

  const {
    data: tournament,
    refetch,
    isLoading,
  } = useCachedResponse<PrismaTournament>({
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
      <Meta subTitle={tournament?.name} title={`Tournament: ${tournament?.name}`} />
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
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap={6}>
              <Link href={`/events/tournaments/${tournament?.uuid}/edit`}>Update Tournament</Link>
              <Button variant="secondary" onClick={onOpen}>
                Delete Tournament
              </Button>
            </Flex>
          )}
        </Flex>

        <Box bg="white" p={4} marginTop={4} marginBottom={4} borderRadius="lg">
          <Heading as="h4" fontFamily="body" color="qukBlue" fontSize="2xl" marginTop={0}>
            Tournament details
          </Heading>
          <Text>
            <b>Tournament name:</b>
            <br /> {tournament?.name || 'N/A'}
          </Text>
          <Text>
            <b>Location:</b>
            <br /> {tournament?.location || 'N/A'}
          </Text>
          <Text>
            <b>Description:</b> <br /> {tournament?.description || 'N/A'}
          </Text>
          <Text>
            <b>Tournament dates</b>
            <br /> {tournament?.start ? new Date(tournament.start).toLocaleDateString() : 'N/A'} -{' '}
            {tournament?.end ? new Date(tournament.end).toLocaleDateString() : 'N/A'}
          </Text>
          <Text>
            <b>Tournament registration dates</b>
            <br /> {tournament?.registrationStart
              ? new Date(tournament.registrationStart).toLocaleDateString()
              : 'N/A'}{' '}
            - {tournament?.registrationEnd ? new Date(tournament.registrationEnd).toLocaleDateString() : 'N/A'}
          </Text>
        </Box>

        <TournamentTeams tournament_uuid={tournament_uuid as string} readonly />
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
