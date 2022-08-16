import dynamic from 'next/dynamic';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import GameCard from 'components/events/game-card';

import { Heading, Grid, Box } from '@chakra-ui/react';
import axios from 'axios';
import useCachedResponse from 'hooks/useCachedResponse';

const Slice = dynamic(() => import('components/shared/slice'));

const SchedulerFeed = ({ primary }) => {
  const { scheduler_url } = primary;

  const { data } = useCachedResponse({
    queryKey: scheduler_url?.url,
    queryFn: () => axios.get(scheduler_url?.url),
    refetchInterval: 300000, // 5 minute refetch
  });

  const grouped = groupBy(data, (game) => game?.label?.trim());
  const groupedOrder = orderBy(Object.keys(grouped), (group) => group);

  return (
    <Slice variant="light">
      <Heading as="h2" fontSize="3xl" mt={2} textAlign="center">
        Results
      </Heading>

      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
        gridGap={{ base: 4, md: 9 }}
      >
        {groupedOrder.map((k, index) => {
          const items = grouped[k];

          const orderedByTimeslot = orderBy(
            items,
            ({ timeslot }) => timeslot?.time
          );

          return (
            <Box key={k}>
              <Heading fontSize="xl" fontFamily="body" textAlign="center">
                {k}
              </Heading>
              <Grid
                gridGap={4}
                gridTemplateColumns="1fr"
                mb={2}
                sx={{
                  '& a': {
                    textDecoration: 'none',
                    color: 'black',
                    '&:hover': {
                      textDecoration: 'none',
                      color: 'black',
                    },
                  },
                }}
              >
                {orderedByTimeslot.map((game, i) => (
                  <GameCard
                    key={game?.id}
                    game={game}
                    size="sm"
                    index={index}
                  />
                ))}
              </Grid>
            </Box>
          );
        })}
      </Grid>
    </Slice>
  );
};

export default SchedulerFeed;
