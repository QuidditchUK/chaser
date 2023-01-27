import { Heading, Grid, Flex, useDisclosure, HStack } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import useCachedResponse from 'hooks/useCachedResponse';
import clubsService from 'services/clubs';
import AddClubTeamForm from 'components/admin/clubs/add-club-team-form';
import Card from 'components/shared/card';
import Button from 'components/shared/button';
import { teams as Team } from '@prisma/client';

const ClubTeams = ({ club_uuid }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data: teams, refetch } = useCachedResponse<Team[]>({
    queryKey: ['/clubs', club_uuid, '/teams'],
    queryFn: () => clubsService.getClubTeams({ club_uuid }),
  });

  const onAddTeam = () => {
    onClose();
    refetch();
  };

  return (
    <>
      <Flex
        flexDirection="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading as="h4" fontFamily="body" color="qukBlue">
          Teams
        </Heading>

        <HStack spacing={3}>
          {/* <Button variant="green" isDisabled={teams?.length === 0}> */}
          <Button variant="green" isDisabled>
            Assign Members
          </Button>

          <Button
            variant="transparent"
            borderColor="qukBlue"
            color="qukBlue"
            _hover={{ bg: 'gray.300' }}
            rightIcon={<SmallAddIcon />}
            onClick={onOpen}
          >
            Add Team
          </Button>
        </HStack>
      </Flex>

      {teams?.length !== 0 && (
        <Grid
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
          gridGap={4}
        >
          {teams?.map((team) => (
            <Card title={team?.name} key={team?.uuid} />
          ))}
        </Grid>
      )}

      <AddClubTeamForm
        isOpen={isOpen}
        onClose={onAddTeam}
        club_uuid={club_uuid}
      />
    </>
  );
};

export default ClubTeams;
