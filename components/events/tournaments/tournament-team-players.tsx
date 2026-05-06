import { Heading, Grid, Flex, HStack, Box, List, Text, Link, Td, Tr } from '@chakra-ui/react';
import { DeleteIcon, SmallAddIcon } from '@chakra-ui/icons';
import useCachedResponse from 'hooks/useCachedResponse';
import tournamentsService from 'services/tournaments';
import Button from 'components/shared/button';
import { users as User } from '@prisma/client';
import { Li } from 'components/shared/List';
import { useState } from 'react';
import Select from 'components/formControls/select';
import Table from 'components/shared/table';
import { EMT } from 'constants/scopes';
import { getPlainScopes, hasScope } from 'modules/scopes';
import useMe from 'hooks/useMe';

const TournamentTeamPlayers = ({ tournament_uuid, team_uuid }) => {
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user?.scopes);

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

  const addUserToTeam = async () => {
    setSelectedUserUuid(undefined);
    await tournamentsService.addPlayerToTeam({
      tournament_uuid,
      team_uuid,
      data: { user_uuid: selectedUserUuid },
    });
    refetch();
  };

  const removeUserFromTeam = async (user: User) => {
    await tournamentsService.removePlayerFromTeam({
      tournament_uuid,
      team_uuid: team_uuid,
      user_uuid: user.uuid,
    });
    refetch();
  };

  return (
    <Box bg="white" p={4} marginTop={4} marginBottom={4} borderRadius="lg">
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap={6}>
        <Heading as="h4" fontFamily="body" color="qukBlue" fontSize="2xl" marginTop={0}>
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
            marginTop={6}
          >
            Add Player
          </Button>
        </HStack>
      </Flex>

      {/* QQQQ show if the user has paid (And is active this season) */}
      <Table columns={['Name', 'Actions']} isLoading={isLoading} skeletonRows={10}>
        {team_users?.map((user) => {
          return (
            <Tr key={user.uuid}>
              <Td>
                <Text>
                  {user.first_name} {user.last_name}
                </Text>
              </Td>

              <Td>
                <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap={6}>
                  {hasScope([EMT], userScopes) ? (
                    <>
                      <Link href={`/events/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user.uuid}`}>
                        Manage player registration
                      </Link>
                      <Button variant="secondary" rightIcon={<DeleteIcon />} onClick={() => removeUserFromTeam(user)}>
                        Remove Player
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href={`/events/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user.uuid}`}>
                        View player registration
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
  );
};

export default TournamentTeamPlayers;
