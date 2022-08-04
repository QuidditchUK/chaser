import { DateTime } from 'luxon';
import {
  Grid,
  Text,
  Box,
  Flex,
  Divider,
  Accordion,
  AccordionItem,
  Heading,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import Image from 'components/shared/image';
import DescriptionList, {
  Description,
} from 'components/shared/description-list';
import useCachedResponse from 'hooks/useCachedResponse';
import axios from 'axios';
import { orderBy } from 'lodash';

const PITCH_COLOR = [
  'northernMagenta',
  'tornadoOrange',
  'southernBlue',
  'pink.500',
  'keeperGreen',
  'monarchRed',
  'northernMagenta',
  'tornadoOrange',
  'southernBlue',
  'pink.500',
  'keeperGreen',
  'monarchRed',
];

function GameCard({ game, size = 'md', index }) {
  const headReferee = game?.officials?.find(
    (official) => official?.role === 'HEAD_REFEREE'
  );
  const snitchRunner = game?.officials?.find(
    (official) => official?.role === 'SNITCH_RUNNER'
  );
  const timekeeper = game?.officials?.find(
    (official) => official?.role === 'TIMEKEEPER'
  );
  const scorekeeper = game?.officials?.find(
    (official) => official?.role === 'SCOREKEEPER'
  );
  const snitchReferee = game?.officials?.find(
    (official) => official?.role === 'SNITCH_REFEREE'
  );
  const pitchManager = game?.officials?.find(
    (official) => official?.role === 'PITCH_MANAGER'
  );
  const firstAider = game?.officials?.find(
    (official) => official?.role === 'FIRST_AIDER'
  );
  const assistantReferees = game?.officials?.filter(
    (official) => official?.role === 'ASSISTANT_REFEREE'
  );
  const goalReferees = game?.officials?.filter(
    (official) => official?.role === 'GOAL_REFEREE'
  );

  const { data: teamASheet } = useCachedResponse({
    queryKey: [
      'quidditchScheduler',
      'aff',
      'team',
      game?.teamA?.id,
      'tournament',
      game?.timeslot?.tournament?.id,
    ],
    queryFn: () =>
      axios.get(
        `https://api.quidditchscheduler.com/aff/team/${game?.teamA?.id}/tournament/${game?.timeslot?.tournament?.id}`
      ),
    staleTime: 300000, // 5 minutes
  });

  const { data: teamBSheet } = useCachedResponse({
    queryKey: [
      'quidditchScheduler',
      'aff',
      'team',
      game?.teamB?.id,
      'tournament',
      game?.timeslot?.tournament?.id,
    ],
    queryFn: () =>
      axios.get(
        `https://api.quidditchscheduler.com/aff/team/${game?.teamB?.id}/tournament/${game?.timeslot?.tournament?.id}`
      ),
    staleTime: 300000, // 5 minutes
  });

  const teamARoster = orderBy(
    teamASheet
      ?.filter((player) => player?.rostered)
      ?.map(({ jerseyNumber, ...rest }) => ({
        ...rest,
        jerseyNumber: isNaN(parseInt(jerseyNumber))
          ? null
          : parseInt(jerseyNumber),
      })),
    ['jerseyNumber']
  );
  const teamBRoster = orderBy(
    teamBSheet
      ?.filter((player) => player?.rostered)
      ?.map(({ jerseyNumber, ...rest }) => ({
        ...rest,
        jerseyNumber: isNaN(parseInt(jerseyNumber))
          ? null
          : parseInt(jerseyNumber),
      })),
    ['jerseyNumber']
  );

  return (
    <Flex
      borderRadius="lg"
      bg="white"
      flexDirection="column"
      alignContent="center"
      width="100%"
      height="100%"
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
      lineHeight="24px"
      position="relative"
    >
      <Grid
        bg="qukBlue"
        width="100%"
        height="100%"
        gridTemplateColumns="1fr 1fr"
        position="absolute"
        borderRadius="lg"
      >
        <Box
          display="block"
          height="100%"
          overflow="hidden"
          position="relative"
          opacity={0.8}
        >
          {game?.teamA?.logoUrl && (
            <Image
              layout="fill"
              objectPosition="center center"
              objectFit="cover"
              src={game?.teamA?.logoUrl}
              alt={game?.teamA?.name}
              gridArea="teamA"
              borderRadius="lg"
            />
          )}
        </Box>
        <Box
          position="absolute"
          width="50%"
          bgGradient="linear(to-l, qukBlue, rgba(0, 0, 0, 0))"
          height="100%"
        />

        <Box
          display="block"
          height="100%"
          overflow="hidden"
          position="relative"
          opacity={0.8}
        >
          {game?.teamB?.logoUrl && (
            <Image
              layout="fill"
              src={game?.teamB?.logoUrl}
              alt={game?.teamB?.name}
              borderRadius="lg"
            />
          )}
        </Box>
        <Box
          position="absolute"
          right="0"
          width="51%"
          bgGradient="linear(to-r, qukBlue, rgba(0, 0, 0, 0))"
          height="100%"
        />
      </Grid>

      <Box
        width="100%"
        height="100%"
        position="absolute"
        bgGradient={`linear(to-t, ${
          PITCH_COLOR[index % PITCH_COLOR.length]
        }, rgba(0, 0, 0, 0))`}
        borderRadius="lg"
      />

      <Flex alignItems="center" justifyContent="center" pt={4} zIndex={1}>
        <Grid gridTemplateColumns="1fr auto 1fr" gridGap={2}>
          <Text
            my={0}
            fontSize="xs"
            justifySelf="end"
            color="white"
            textShadow="0 0 5px rgb(0,0,0)"
          >
            Pitch {game?.pitch}
          </Text>
          <Text
            my={0}
            fontSize="xs"
            justifySelf="center"
            color="white"
            textShadow="0 0 5px rgb(0,0,0)"
          >
            |
          </Text>
          <Text
            my={0}
            fontSize="xs"
            justifySelf="start"
            color="white"
            textShadow="0 0 5px rgb(0,0,0)"
          >
            {DateTime.fromISO(game?.timeslot?.time).toFormat('h:mm a')}
          </Text>
        </Grid>
      </Flex>

      <Grid
        gridTemplateColumns="1fr 1fr 1fr"
        gridGap={4}
        px={4}
        pb={4}
        zIndex={1}
      >
        <Grid
          gridTemplateColumns={
            size === 'sm' ? '1fr' : { base: '1fr', md: '50px auto' }
          }
          gridTemplateRows={
            size === 'sm' ? '50px auto' : { base: '50px auto', md: 'auto' }
          }
          gridGap={2}
          alignItems="center"
        >
          <Box h="50px" w="50px">
            {game?.teamA?.logoUrl && (
              <Image
                src={game?.teamA?.logoUrl}
                alt={game?.teamA?.name}
                height="50px"
                width="50px"
                layout="responsive"
              />
            )}
          </Box>
          <Text
            fontWeight="bold"
            fontSize={{ base: 'sm', md: 'md' }}
            color="white"
            textShadow="0 0 5px rgb(0,0,0)"
          >
            {game?.teamA?.name}
          </Text>
        </Grid>

        {game?.status === 'FINISHED' ? (
          <Flex alignItems="center" justifyContent="center">
            <Grid gridTemplateColumns="1fr auto 1fr" gridGap={2}>
              <Text
                fontWeight="bold"
                fontSize={size === 'sm' ? '2xl' : { base: '2xl', md: '4xl' }}
                justifySelf="end"
                color="white"
                textShadow="0 0 5px rgb(0,0,0)"
              >
                {game?.teamAScore}
                {game?.snitchCaughtBy === 'TEAM_A' && <>*</>}
              </Text>
              <Text
                fontWeight="bold"
                fontSize={size === 'sm' ? '2xl' : { base: '2xl', md: '4xl' }}
                justifySelf="center"
                color="white"
                textShadow="0 0 5px rgb(0,0,0)"
              >
                —
              </Text>
              <Text
                fontWeight="bold"
                fontSize={size === 'sm' ? '2xl' : { base: '2xl', md: '4xl' }}
                justifySelf="start"
                color="white"
                textShadow="0 0 5px rgb(0,0,0)"
              >
                {game?.teamBScore}
                {game?.snitchCaughtBy === 'TEAM_B' && <>*</>}
              </Text>
            </Grid>
          </Flex>
        ) : (
          <Box />
        )}

        <Grid
          gridTemplateColumns={
            size === 'sm' ? '1fr' : { base: '1fr', md: 'auto 50px' }
          }
          gridTemplateRows={
            size === 'sm' ? '50px auto' : { base: '50px auto', md: 'auto' }
          }
          gridGap={2}
          gridTemplateAreas={
            size === 'sm'
              ? "'logo' 'name'"
              : {
                  base: "'logo' 'name'",
                  md: "'name logo'",
                }
          }
          alignItems="center"
        >
          <Text
            fontWeight="bold"
            color="white"
            textShadow="0 0 5px rgb(0,0,0)"
            fontSize={size === 'sm' ? 'sm' : { base: 'sm', md: 'md' }}
            gridArea="name"
            textAlign="right"
          >
            {game?.teamB?.name}
          </Text>
          <Flex
            h="50px"
            w="50px"
            gridArea="logo"
            flexDirection="column"
            justifySelf="flex-end"
          >
            {game?.teamB?.logoUrl && (
              <Image
                src={game?.teamB?.logoUrl}
                alt={game?.teamB?.name}
                height="50px"
                width="50px"
                layout="responsive"
              />
            )}
          </Flex>
        </Grid>
      </Grid>

      <Accordion allowToggle zIndex="1" width="100%">
        <AccordionItem>
          <Heading m={0}>
            <AccordionButton
              bg="transparent"
              color="white"
              fontFamily="body"
              fontWeight="bold"
              m={0}
              border="0"
              cursor="pointer"
            >
              <Flex
                alignItems="center"
                width="100%"
                textAlign="center"
                justifyContent="center"
                textShadow="0 0 5px rgb(0,0,0)"
              >
                Details
                <AccordionIcon />
              </Flex>
            </AccordionButton>
          </Heading>

          <AccordionPanel
            pb={4}
            backgroundColor="rgba(255,255,255,0.8)"
            borderBottomRadius="md"
          >
            <Heading color="qukBlue" fontSize="2xl" fontFamily="body">
              Volunteers
            </Heading>
            <Grid
              gridTemplateColumns={
                size === 'sm' ? '1fr' : { base: '1fr', md: '1fr 1fr' }
              }
              gridGap={16}
            >
              <DescriptionList>
                <Description
                  term="Head Referee"
                  description={headReferee?.volunteer?.person?.fullName}
                />
                <Description
                  term="Snitch Runner"
                  description={snitchRunner?.volunteer?.person?.fullName}
                />
                <Description
                  term="Snitch Referee"
                  description={snitchReferee?.volunteer?.person?.fullName}
                />
                {assistantReferees?.map((referee) => (
                  <Description
                    key={referee?.id}
                    term="Assistant Referee"
                    description={referee?.volunteer?.person?.fullName}
                  />
                ))}
              </DescriptionList>

              <DescriptionList>
                <Description
                  term="Scorekeeper"
                  description={scorekeeper?.volunteer?.person?.fullName}
                />
                <Description
                  term="Timekeeper"
                  description={timekeeper?.volunteer?.person?.fullName}
                />
                {goalReferees?.map((referee) => (
                  <Description
                    key={referee?.id}
                    term="Goal Referee"
                    description={referee?.volunteer?.person?.fullName}
                  />
                ))}
                <Description
                  term="First Aider"
                  description={firstAider?.volunteer?.person?.fullName}
                />
                <Description
                  term="Pitch Manager"
                  description={pitchManager?.volunteer?.person?.fullName}
                />
              </DescriptionList>
            </Grid>

            <Divider
              borderColor="qukBlue"
              opacity="1"
              borderBottomWidth="2px"
              mt={10}
            />

            <Grid
              gridTemplateColumns={
                size === 'sm' ? '1fr' : { base: '1fr', md: '1fr 1fr' }
              }
              gridGap={16}
            >
              <Box justifyItems="start">
                <Heading color="qukBlue" fontSize="2xl" fontFamily="body">
                  {game?.teamA?.name} Roster
                </Heading>
                <DescriptionList>
                  {teamARoster?.map((player) => (
                    <Description
                      key={player?.id}
                      term={player?.jerseyNumber}
                      description={player?.person?.fullName}
                    />
                  ))}
                </DescriptionList>
              </Box>

              <Box>
                <Heading color="qukBlue" fontSize="2xl" fontFamily="body">
                  {game?.teamB?.name} Roster
                </Heading>
                <DescriptionList>
                  {teamBRoster?.map((player) => (
                    <Description
                      key={player?.id}
                      term={player?.jerseyNumber}
                      description={player?.person?.fullName}
                    />
                  ))}
                </DescriptionList>
              </Box>
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}

export default GameCard;
