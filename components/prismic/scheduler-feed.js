import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';
import GameCard from 'components/events/game-card';

import { Heading, Grid } from '@chakra-ui/react';
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

  const grouped = groupBy(data, (game) => game?.timeslot?.time);
  const groupedOrder = orderBy(Object.keys(grouped), (group) => group);

  return (
    <>
      {data?.[0]?.timeslot?.tournament?.publicSchedule && (
        <Slice variant="light" size="sm">
          {groupedOrder.map((k) => {
            const items = grouped[k];

            const orderedByPitch = orderBy(items, ({ pitch }) => pitch);

            return (
              <Grid
                gridGap={4}
                gridTemplateColumns="1fr"
                key={k}
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
                <Heading fontSize="xl" fontFamily="body" textAlign="center">
                  {DateTime.fromISO(k).toFormat('h:mm a')}
                </Heading>

                {orderedByPitch.map((game, i) => (
                  <Fragment key={game?.id}>
                    {game?.timeslot?.tournament?.publicSchedule && (
                      <GameCard game={game} index={i} />
                    )}
                  </Fragment>
                ))}
              </Grid>
            );
          })}
        </Slice>
      )}
    </>
  );
};

export default SchedulerFeed;
