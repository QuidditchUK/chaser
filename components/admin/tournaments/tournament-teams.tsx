import { Heading, Grid, Flex, HStack, Box, List, Text } from '@chakra-ui/react';
import { DeleteIcon, SmallAddIcon } from '@chakra-ui/icons';
import useCachedResponse from 'hooks/useCachedResponse';
import tournamentsService from 'services/tournaments';
import Button from 'components/shared/button';
import { teams as Team } from '@prisma/client';
import { Li } from 'components/shared/List';
import { useState } from 'react';
import Select from 'components/formControls/select';

const TournamentTeams = ({ tournament_uuid }) => {
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
      <Flex flexDirection="row" width="100%" alignItems="center" justifyContent="space-between">
        <Heading as="h4" fontFamily="body" color="qukBlue" fontSize="2xl">
          Teams
        </Heading>

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
      </Flex>

      <Grid gridTemplateColumns={{ base: '1fr 1fr' }} gridGap={4}>
        <List>
          {tournament_teams?.map((team) => (
            <Li
              key={team.uuid}
              showActiveLabel={false}
              href={`/admin/tournaments/${tournament_uuid}/teams/${team.uuid}`}
              icon={<Box height="3rem" width="3rem" borderRadius="full" bg="gray.400" />}
              name={
                <Text color="qukBlue" fontWeight="bold" my={1}>
                  {team.name || 'Unnamed'}
                </Text>
              }
              //QQ Add other params
              subtitle={<>This team is in a tournament</>}
              action={
                <>
                  <Button variant="primary" rightIcon={<DeleteIcon />} onClick={() => removeTeamFromTournament(team)}>
                    Add Team
                  </Button>
                </>
              }
            />
          ))}
        </List>
      </Grid>
    </>
  );
};

export default TournamentTeams;
