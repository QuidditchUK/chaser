import { Heading, Grid, Flex, HStack, Box, List, Text } from '@chakra-ui/react';
import { DeleteIcon, SmallAddIcon } from '@chakra-ui/icons';
import useCachedResponse from 'hooks/useCachedResponse';
import tournamentsService from 'services/tournaments';
import Button from 'components/shared/button';
import { users as User } from '@prisma/client';
import { Li } from 'components/shared/List';
import { useState } from 'react';
import Select from 'components/formControls/select';

const TournamentTeamPlayers = ({ tournament_uuid, team_uuid }) => {
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>();

  const { data, isLoading, isError, refetch } = useCachedResponse<{
    team_users: User[];
    possible_users: User[];
  }>({
    queryKey: ['/tournaments', tournament_uuid, '/teams', team_uuid, '/players'],
    queryFn: () =>
      tournamentsService.getTournamentTeamPlayers({
        tournament_uuid,
        team_uuid,
      }),
  });

  if (isLoading || isError) {
    return <></>;
  }
  const { team_users, possible_users } = data;

  // QQQQ
  const addUserToTeam = async () => {
    setSelectedUserUuid(undefined);
    await tournamentsService.addUserToTeam({
      tournament_uuid,
      data: { team_uuid: selectedUserUuid, user_uuid: selectedUserUuid },
    });
    refetch();
  };

  // QQQQ
  const removeUserFromTeam = async (user: User) => {
    await tournamentsService.removeUserFromTeam({
      tournament_uuid,
      team_uuid: team_uuid,
      user_uuid: user.uuid,
    });
    refetch();
  };

  return (
    <>
      <Flex flexDirection="row" width="100%" alignItems="center" justifyContent="space-between">
        <Heading as="h4" fontFamily="body" color="qukBlue" fontSize="2xl">
          Players
        </Heading>

        <HStack spacing={3}>
          <Select
            onChange={(event) => {
              setSelectedUserUuid(event.target.value);
            }}
            label="Select player to add"
            id="user_uuid"
            placeholder="Select a user"
            options={possible_users.map((user) => ({
              value: user.uuid,
              label: user.first_name + ' ' + user.last_name,
            }))}
            value={selectedUserUuid}
          />
          <Button
            variant="transparent"
            borderColor="qukBlue"
            color="qukBlue"
            _hover={{ bg: 'gray.300' }}
            rightIcon={<SmallAddIcon />}
            disabled={!selectedUserUuid}
            onClick={addUserToTeam}
          >
            Add Player
          </Button>
        </HStack>
      </Flex>

      <Grid gridTemplateColumns={{ base: '1fr 1fr' }} gridGap={4}>
        <List>
          {team_users?.map((user) => (
            <Li
              key={user.uuid}
              showActiveLabel={false}
              href={`/admin/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user.uuid}`}
              icon={<Box height="3rem" width="3rem" borderRadius="full" bg="gray.400" />}
              name={
                <Text color="qukBlue" fontWeight="bold" my={1}>
                  {user.first_name + ' ' + user.last_name || 'Unnamed User'}
                </Text>
              }
              //QQ Add other params - say, are they active at all, have they paid tournament fee
              subtitle={<>This user is on this team in this tournament</>}
              action={
                <>
                  <Button variant="primary" rightIcon={<DeleteIcon />} onClick={() => removeUserFromTeam(user)}>
                    Remove User
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

export default TournamentTeamPlayers;
