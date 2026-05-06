import { Heading, Grid, Flex, HStack, Box, List, Text, Td, Tr, Link } from '@chakra-ui/react';
import Table from 'components/shared/table';

import { DeleteIcon, SmallAddIcon } from '@chakra-ui/icons';
import useCachedResponse from 'hooks/useCachedResponse';
import tournamentsService from 'services/tournaments';
import Button from 'components/shared/button';
import { teams as Team } from '@prisma/client';
import { Li } from 'components/shared/List';
import { useState } from 'react';
import Select from 'components/formControls/select';
import useMe from 'hooks/useMe';
import { getPlainScopes, hasScope } from 'modules/scopes';
import { EMT } from 'constants/scopes';

const TournamentTeams = ({ tournament_uuid }: { tournament_uuid: string; readonly?: boolean }) => {
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);
  // QQQQ club presidents can add their clubs teams to the tournament, but not teams of other clubs. EMT can add any team.

  const [selectedTeamUuid, setSelectedTeamUuid] = useState<string>();

  const { data, isLoading, isError, refetch } = useCachedResponse<{
    tournament_teams: Team[];
    possible_teams: Team[];
  }>({
    queryKey: ['/tournaments', tournament_uuid, '/teams'],
    queryFn: () => tournamentsService.getTournamentTeams({ tournament_uuid }),
  });

  if (isLoading || isError) {
    return <></>;
  }
  const { tournament_teams, possible_teams } = data;

  const addTeamToTournament = async () => {
    setSelectedTeamUuid(undefined);
    await tournamentsService.addTeamToTournament({
      tournament_uuid,
      data: { team_uuid: selectedTeamUuid },
    });
    refetch();
  };

  const removeTeamFromTournament = async (team: Team) => {
    await tournamentsService.removeTeamFromTournament({
      tournament_uuid,
      team_uuid: team.uuid,
    });
    refetch();
  };

  return (
    <>
      <Box bg="white" p={4} marginTop={4} marginBottom={4} borderRadius="lg">
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap={6}>
          <Heading as="h4" fontFamily="body" color="qukBlue" fontSize="2xl" marginTop={0}>
            Teams
          </Heading>
          {hasScope([EMT], userScopes) && (
            <HStack spacing={3}>
              <Select
                onChange={(event) => {
                  setSelectedTeamUuid(event.target.value);
                }}
                label="Select team to add"
                id="team_uuid"
                placeholder="Select a team"
                options={possible_teams.map((team) => ({
                  value: team.uuid,
                  label: team.name,
                }))}
                value={selectedTeamUuid}
              />
              <Button
                marginTop={6}
                variant="transparent"
                borderColor="qukBlue"
                color="qukBlue"
                _hover={{ bg: 'gray.300' }}
                rightIcon={<SmallAddIcon />}
                disabled={!selectedTeamUuid}
                onClick={addTeamToTournament}
              >
                Add Team
              </Button>
            </HStack>
          )}
        </Flex>

        <Table columns={['Name', 'Actions']} isLoading={isLoading} skeletonRows={10}>
          {tournament_teams?.map((team) => {
            return (
              <Tr key={team.uuid}>
                <Td>
                  <Link href={`/events/tournaments/${tournament_uuid}/teams/${team.uuid}`}>{team.name}</Link>
                </Td>

                <Td>
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap={6}>
                    {hasScope([EMT], userScopes) ? (
                      <>
                        <Link href={`/events/tournaments/${tournament_uuid}/teams/${team.uuid}`}>
                          Manage team players
                        </Link>
                        <Button
                          variant="secondary"
                          rightIcon={<DeleteIcon />}
                          onClick={() => removeTeamFromTournament(team)}
                        >
                          Remove Team
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href={`/events/tournaments/${tournament_uuid}/teams/${team.uuid}`}>
                          View team players
                        </Link>
                      </>
                    )}
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Box>
    </>
  );
};

export default TournamentTeams;
