import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import schedulerMock from 'mocks/scheduler.json';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';

import { Heading, Grid, Text, Box, Flex } from '@chakra-ui/react';
import Image from 'components/shared/image';
import axios from 'axios';

const Slice = dynamic(() => import('components/shared/slice'));

const SchedulerFeed = ({ primary }) => {
  const { scheduler_url } = primary;

  // const { data } = useQuery(scheduler_url, () => axios.get(scheduler_url), {
  //   refetchInterval: 300000 // 5 minute refetch
  // });

  const data = schedulerMock;

  const grouped = groupBy(data, (game) => game?.timeslot?.time);

  return (
    <Slice variant="light" size="sm">
      {Object.keys(grouped).map((k) => {
        const items = grouped[k];

        const orderedByPitch = orderBy(items, ({ pitch }) => pitch);

        return (
          <Grid gridGap={4} gridTemplateColumns="1fr" key={k} mb={2}>
            <Heading fontSize="xl" fontFamily="body" textAlign="center">
              {DateTime.fromISO(k).toFormat('h:mm a')}
            </Heading>

            {orderedByPitch.map((game) => (
              <Flex
                borderRadius="lg"
                bg="white"
                p={4}
                key={game?.id}
                flexDirection="column"
                alignContent="center"
              >
                <Flex alignItems="center" justifyContent="center">
                  <Text m={0} fontSize="xs">
                    Pitch {game?.pitch} |{' '}
                    {DateTime.fromISO(game?.timeslot?.time).toFormat('h:mm a')}
                  </Text>
                </Flex>

                <Grid gridTemplateColumns="1fr auto 1fr" gridGap={4}>
                  <Grid
                    gridTemplateColumns={{ base: 'auto', md: '50px auto' }}
                    gridGap={2}
                    alignItems="center"
                  >
                    <Box h="50px" w="50px">
                      <Image
                        src={game?.teamA?.logoUrl}
                        alt={game?.teamA?.name}
                        height="50px"
                        width="50px"
                        layout="responsive"
                      />
                    </Box>
                    <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                      {game?.teamA?.name}
                    </Text>
                  </Grid>

                  {game?.status === 'FINISHED' ? (
                    <Flex alignItems="center" justifyContent="center">
                      <Grid gridTemplateColumns="1fr auto 1fr" gridGap={2}>
                        <Text fontWeight="bold" fontSize="2xl">
                          {game?.teamAScore}
                          {game?.snitchCaughtBy === 'TEAM_A' && <>*</>}
                        </Text>
                        <Text fontWeight="bold" fontSize="2xl">
                          —
                        </Text>
                        <Text fontWeight="bold" fontSize="2xl">
                          {game?.teamBScore}
                          {game?.snitchCaughtBy === 'TEAM_B' && <>*</>}
                        </Text>
                      </Grid>
                    </Flex>
                  ) : (
                    <Box />
                  )}

                  <Grid
                    gridTemplateColumns={{ base: '1fr', md: 'auto 50px' }}
                    gridGap={2}
                    gridTemplateAreas={{
                      base: "'logo' 'name'",
                      md: "'name logo'",
                    }}
                    alignItems="center"
                  >
                    <Text
                      fontWeight="bold"
                      fontSize={{ base: 'sm', md: 'md' }}
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
                      <Image
                        src={game?.teamB?.logoUrl}
                        alt={game?.teamB?.name}
                        height="50px"
                        width="50px"
                        layout="responsive"
                      />
                    </Flex>
                  </Grid>
                </Grid>
              </Flex>
            ))}
          </Grid>
        );
      })}
    </Slice>
  );
};

export default SchedulerFeed;
