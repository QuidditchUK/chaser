import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';

import type { tournaments as PrismaTournament } from '@prisma/client';
import type { teams as PrismaTeam } from '@prisma/client';

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
import TournamentTeamPlayers from 'components/events/tournaments/tournament-team-players';

// QQQQ fetch registration details
// QQQQ admin needs to be able to manually mark a player as paid
// QQQQ anyone can pay a player's registration fee
// QQQQ before they can pay, the player needs to have an active quk membership
const TeamPage = () => {
  const router = useRouter();
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const tournament_uuid = router.query.uuid;
  const team_uuid = router.query.team_uuid;
  const user_uuid = router.query.user_uuid;

  const {
    data: tournament_team,
    isLoading,
    isError,
  } = useCachedResponse<{
    tournament: PrismaTournament;
    team: PrismaTeam;
  }>({
    queryKey: ['/tournaments/', tournament_uuid, '/teams/', team_uuid],
    queryFn: () =>
      tournamentsService.getTournamentTeam({
        tournament_uuid: tournament_uuid,
        team_uuid: team_uuid,
      }),
  });

  const removeTeamFromTournament = async () => {
    await tournamentsService.removeTeamFromTournament({
      tournament_uuid,
      team_uuid: team_uuid,
    });
    router.push(`/events/tournaments/${tournament_uuid}`);
  };

  if (isLoading || isError || !tournament_team) {
    return null;
  }

  return (
    <>
      <Meta subTitle={tournament_team?.tournament.name} title="Tournament Team Admin Dashboard" />
      <Slice>
        <Flex flexDirection="row" width="100%" alignItems="center" justifyContent="space-between" gap={2}>
          <HeadingWithBreadcrumbs
            breadcrumbs={[
              { link: '/events', title: 'Events' },
              { link: '/events/tournaments', title: 'Tournaments' },
              {
                link: `/events/tournaments/${tournament_uuid}`,
                title: tournament_team?.tournament.name,
              },
            ]}
            heading={'Team'}
          />

          {hasScope([EMT], userScopes) && (
            <Button variant="secondary" onClick={onOpen}>
              Delete Team
            </Button>
          )}
        </Flex>

        <TournamentTeamPlayers tournament_uuid={tournament_uuid} team_uuid={team_uuid} />
      </Slice>

      <Modal
        title="Delete Team from Tournament"
        isOpen={isOpen}
        onClose={onClose}
        footerAction={() => removeTeamFromTournament()}
        footerTitle="Delete"
        footerButtonProps={{ variant: 'secondary' }}
      >
        {/* QQ better wording */}
        <Text>Are you sure you want to delete {tournament_team.team.name}?</Text>
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

export default TeamPage;

TeamPage.auth = {
  skeleton: <Box />,
};
